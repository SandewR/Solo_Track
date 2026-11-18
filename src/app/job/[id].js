import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Modal,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '../../constants/solotrack_theme';
import { JOB_STATUSES, useJobs } from '../../context/job_context';
import { getOutstandingBalance } from '../../utils/job_helpers';
import { useState } from 'react';
import { scheduleJobReminder } from '../../utils/notifications';

const JOB_PHOTO_OVERRIDES = {
  'batery-repair': require('../../../assets/images/batery-repair.png'),
  'office-cleaning': require('../../../assets/images/office-cleaning.png'),
  'phone-repair': require('../../../assets/images/phone-repair.png'),
};

function formatMoney(amount) {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    return 'Not recorded';
  }

  return `LKR ${amount.toLocaleString('en-LK')}`;
}

function getJobImage(serviceType) {
  const type = String(serviceType ?? '').trim().toLowerCase();

  if (type.includes('cleaning')) {
    return require('../../../assets/images/cleaning.png');
  }

  if (type.includes('maintenance')) {
    return require('../../../assets/images/maintenance.png');
  }

  if (type.includes('phone') && type.includes('repair')) {
    return require('../../../assets/images/phone-repair.png');
  }

  return require('../../../assets/images/solotrack.png');
}

export default function JobDetailsScreen() {
  const [pendingStatus, setPendingStatus] = useState(null);
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { jobs, updateJobStatus } = useJobs();
  const [scheduling, setScheduling] = useState(false);
  const jobId = Array.isArray(id) ? id[0] : id;
  const job = jobs.find((item) => item.id === jobId);

  async function handleReminder(seconds) {
  if (!job || scheduling) {
    return;
  }

  setScheduling(true);

  try {
    await scheduleJobReminder(job, seconds);

    Alert.alert(
      'Reminder scheduled',
      seconds === 10
        ? 'Your test reminder will appear in about 10 seconds.'
        : 'We will remind you to follow up in one hour.'
    );
  } catch (error) {
    Alert.alert(
      'Reminder unavailable',
      error instanceof Error ? error.message : 'Please try again.'
    );
  } finally {
    setScheduling(false);
  }
}

function handleStatusChange(status) {
  if (!job || job.status === status) {
    return;
  }

  setPendingStatus(status);
}

function confirmStatusChange() {
  if (!job || !pendingStatus) {
    return;
  }

  updateJobStatus(job.id, pendingStatus);
  setPendingStatus(null);
  goBack();
}

  function goBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/jobs');
    }
  }

  if (!job) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Job not found</Text>
          <Pressable onPress={goBack} style={styles.backButton}>
            <Text style={styles.backText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const balance = getOutstandingBalance(job);
  const imageKey = /\biphone[\s-]*12\b/i.test(job.title ?? '')
    ? 'batery-repair'
    : job.imageKey;
  const jobImage = JOB_PHOTO_OVERRIDES[imageKey] ?? getJobImage(job.serviceType);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          onPress={goBack}
          style={styles.backButton}
          accessibilityRole="button"
        >
          <Text style={styles.backText}>‹ Back</Text>
        </Pressable>

        <Image source={jobImage} style={styles.jobImage} resizeMode="cover" />

        <Text style={styles.eyebrow}>JOB DETAILS</Text>
        <Text style={styles.title}>{job.title}</Text>
        <Text style={styles.description}>{job.description}</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Customer and work</Text>

          <Text style={styles.label}>Customer</Text>
          <Text style={styles.value}>{job.customerName}</Text>

          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>{job.location}</Text>

          <Text style={styles.label}>Scheduled time</Text>
          <Text style={styles.value}>
            {new Date(job.scheduledAt).toLocaleString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>

          <Text style={styles.label}>Next action</Text>
          <Text style={styles.value}>
            {job.nextAction || 'No follow-up recorded'}
          </Text>
        </View>

        <View style={styles.paymentCard}>
          <Text style={styles.paymentHeading}>PAYMENT SUMMARY</Text>

          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Agreed price</Text>
            <Text style={styles.paymentValue}>
              {formatMoney(job.agreedAmount)}
            </Text>
          </View>

          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Received</Text>
            <Text style={styles.paymentValue}>
              {formatMoney(job.amountPaid)}
            </Text>
          </View>

          <View style={styles.balanceRow}>
            <Text style={styles.paymentLabel}>Remaining</Text>
            <Text style={styles.balance}>
              {balance === null ? 'Not calculated' : formatMoney(balance)}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Work status</Text>
          <Text style={styles.description}>
            Select a status to update this job.
          </Text>

          <View style={styles.statusOptions}>
            {JOB_STATUSES.map((status) => (
              <Pressable
                key={status}
                onPress={() => handleStatusChange(status)}
                accessibilityRole="button"
                accessibilityState={{ selected: job.status === status }}
                style={[
                  styles.statusOption,
                  job.status === status && styles.selectedStatus,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    job.status === status && styles.selectedStatusText,
                  ]}
                >
                  {status}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.note}>
            Completing work does not mark its payment as received.
          </Text>
        </View>
        <View style={styles.card}>
  <Text style={styles.sectionTitle}>Follow-up reminder</Text>

  <Text style={styles.description}>
    Get a reminder to review this job or contact the customer.
  </Text>

  <Pressable
    onPress={() => handleReminder(3600)}
    disabled={scheduling}
    accessibilityRole="button"
    style={[
      styles.reminderButton,
      scheduling && styles.disabledButton,
    ]}
  >
    <Text style={styles.reminderButtonText}>
      {scheduling ? 'Scheduling…' : 'Remind me in one hour'}
    </Text>
  </Pressable>

  <Pressable
    onPress={() => handleReminder(10)}
    disabled={scheduling}
    accessibilityRole="button"
    style={styles.testButton}
  >
    <Text style={styles.backText}>Test reminder in 10 seconds</Text>
  </Pressable>
</View>
      </ScrollView>

    <Modal
  visible={pendingStatus !== null}
  transparent
  animationType="fade"
  onRequestClose={() => setPendingStatus(null)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.confirmCard}>
      <Text style={styles.sectionTitle}>Change work status?</Text>

      <Text style={styles.description}>
        Mark this job as {pendingStatus}? Confirm to save and return
        to your jobs.
      </Text>

      <View style={styles.confirmActions}>
        <Pressable
          onPress={() => setPendingStatus(null)}
          style={styles.cancelButton}
          accessibilityRole="button"
        >
          <Text style={styles.backText}>Cancel</Text>
        </Pressable>

        <Pressable
          onPress={confirmStatusChange}
          style={styles.confirmButton}
          accessibilityRole="button"
        >
          <Text style={styles.reminderButtonText}>Confirm</Text>
        </Pressable>
      </View>
    </View>
  </View>
</Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 24,
    paddingBottom: 36,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingRight: 20,
    marginBottom: 16,
  },
  backText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.primary,
  },
  eyebrow: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '800',
    color: COLORS.text,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.text,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 18,
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '600',
    color: COLORS.text,
  },
  paymentCard: {
    backgroundColor: COLORS.darkSurface,
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
  },
  paymentHeading: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#A7DDD2',
    marginBottom: 14,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 9,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#D2DEE5',
  },
  paymentValue: {
    flexShrink: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'right',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#37505F',
    paddingTop: 16,
    marginTop: 10,
  },
  balance: {
    flexShrink: 1,
    fontSize: 20,
    fontWeight: '800',
    color: '#A7DDD2',
    textAlign: 'right',
  },
  statusOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 18,
  },
  statusOption: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
  },
  selectedStatus: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  selectedStatusText: {
    color: COLORS.onPrimary,
  },
  note: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.textSecondary,
    marginTop: 18,
  },
  reminderButton: {
  backgroundColor: COLORS.primary,
  borderRadius: 14,
  padding: 16,
  alignItems: 'center',
  marginTop: 18,
},
reminderButtonText: {
  color: COLORS.onPrimary,
  fontSize: 15,
  fontWeight: '700',
},
disabledButton: {
  opacity: 0.5,
},
testButton: {
  paddingVertical: 16,
  alignItems: 'center',
},
modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(10, 25, 35, 0.55)',
  justifyContent: 'center',
  padding: 24,
},
confirmCard: {
  backgroundColor: COLORS.surface,
  padding: 24,
  borderRadius: 24,
},
confirmActions: {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: 16,
  marginTop: 24,
},
cancelButton: {
  padding: 12,
},
confirmButton: {
  backgroundColor: COLORS.primary,
  paddingHorizontal: 22,
  paddingVertical: 14,
  borderRadius: 14,
},
jobImage: {
  width: '100%',
  height: 150,
  borderRadius: 20,
  marginBottom: 20,
},
});
