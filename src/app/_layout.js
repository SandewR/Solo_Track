import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { JobProvider } from '../context/job_context';

export default function RootLayout() {
  return (
    <JobProvider>
      <StatusBar style="dark" />

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </JobProvider>
  );
}