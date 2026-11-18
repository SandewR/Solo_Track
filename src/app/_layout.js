import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { JobProvider } from '../context/job_context';

import StartupBackground from '../components/startup_background';

export default function RootLayout() {
  return (
    <JobProvider>
      <StatusBar style="dark" />
      <StartupBackground> 
      <Stack
      
        screenOptions={{
          headerShown: false,
        }}
      />
      </StartupBackground>
    </JobProvider>
  );
}