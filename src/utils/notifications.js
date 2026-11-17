import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function scheduleJobReminder(job, seconds) {
  if (Platform.OS === 'web') {
    throw new Error('Open the Android app to schedule a reminder.');
  }

  let permission = await Notifications.getPermissionsAsync();

  if (!permission.granted && permission.canAskAgain) {
    permission = await Notifications.requestPermissionsAsync();
  }

  if (!permission.granted) {
    throw new Error(
      'Notifications are disabled. Allow them in your device settings.'
    );
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'SoloTrack follow-up',
      body: `${job.title}: ${job.nextAction || 'Review this job.'}`,
      sound: 'default',
      data: { jobId: job.id },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      repeats: false,
      // Expo creates its native fallback channel when channelId is omitted.
      // This avoids the channel-management bridge crash in affected Expo Go builds.
    },
  });
}
