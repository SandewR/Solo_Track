import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AppState } from 'react-native';

import { initialJobs } from '../data/jobs';

const JobContext = createContext(null);

export const JOB_STATUSES = [
  'New',
  'Awaiting approval',
  'Scheduled',
  'In progress',
  'Ready for collection',
  'Completed',
  'Cancelled',
];

export function JobProvider({ children }) {
  const [jobs, setJobs] = useState(() =>
    initialJobs.map((job) => ({ ...job }))
  );
  const [lastResumedAt, setLastResumedAt] = useState(null);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      const wasAway =
        appState.current === 'background' ||
        appState.current === 'inactive';

      if (wasAway && nextState === 'active') {
        setLastResumedAt(Date.now());
      }

      appState.current = nextState;
    });

    return () => subscription.remove();
  }, []);

  function updateJobStatus(jobId, status) {
    if (!JOB_STATUSES.includes(status)) {
      throw new Error('Invalid job status.');
    }

    setJobs((currentJobs) =>
      currentJobs.map((job) =>
        job.id === jobId ? { ...job, status } : job
      )
    );
  }

  return (
    <JobContext.Provider
      value={{
        jobs,
        updateJobStatus,
        lastResumedAt,
      }}
    >
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobContext);

  if (context === null) {
    throw new Error('useJobs must be used inside JobProvider.');
  }

  return context;
}