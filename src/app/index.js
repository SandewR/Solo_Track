import { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS, RADIUS, SPACING } from '../constants/solotrack_theme';
import { initialJobs } from '../data/jobs';
import {
  getAttentionReasons,
  getJobSummary,
  getOutstandingBalance,
} from '../utils/job_helpers';


function isToday(value) {
  return new Date(value).toDateString() === new Date().toDateString();
}

function formatTime(value) {
  return new Date(value).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatMoney(value) {
  return `LKR ${value.toLocaleString('en-LK')}`;
}

function getStatusColors(status) {
  if (status === 'Completed') {
    return {
      backgroundColor: COLORS.completedSoft,
      color: COLORS.completed,
    };
  }

  if (status === 'In progress') {
    return {
      backgroundColor: COLORS.inProgressSoft,
      color: COLORS.inProgress,
    };
  }

  return {
    backgroundColor: COLORS.scheduledSoft,
    color: COLORS.scheduled,
  };
}

export default function TodayScreen()
{
const [showAll, setShowAll] = useState(false);
const [selectedJob, setSelectedJob] = useState(null);

const now = Date.now();

const sortedJobs = [...initialJobs].sort(
  (first, second) =>
    new Date(first.scheduledAt) - new Date(second.scheduledAt)
);

const attentionJobs = sortedJobs.filter(
  (job) => getAttentionReasons(job, now).length > 0
);

const visibleJobs = showAll ? sortedJobs : attentionJobs;

const summary = getJobSummary(initialJobs, now);

const nextAttentionJob = attentionJobs[0] ?? null;

  function renderJob({ item }) {
  const statusColors = getStatusColors(item.status);
  const reasons = getAttentionReasons(item, now);
  const balance = getOutstandingBalance(item);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${item.title}`}
      onPress={() => setSelectedJob(item)}
      style={({ pressed }) => [
        styles.jobCard,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.rowBetween}>
        <Text style={styles.service}>{item.serviceType}</Text>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColors.backgroundColor },
          ]}
        >
          <Text
            style={[styles.statusText, { color: statusColors.color }]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <Text style={styles.jobTitle}>{item.title}</Text>

      <Text style={styles.secondaryText}>
        {item.customerName}
      </Text>

      {reasons.length > 0 && (
        <Text style={styles.attentionText}>
          {reasons.join(' · ')}
        </Text>
      )}

      <Text style={styles.detailText}>
        {balance === null
          ? 'Price not agreed'
          : `Remaining balance: ${formatMoney(balance)}`}
      </Text>

      <View style={styles.divider} />

      <View style={styles.rowBetween}>
        <View style={styles.flexible}>
          <Text style={styles.smallLabel}>{item.dateType}</Text>

          <Text style={styles.detailText}>
            {isToday(item.scheduledAt)
              ? 'Today'
              : new Date(item.scheduledAt).toLocaleDateString()}
            {' · '}
            {formatTime(item.scheduledAt)}
          </Text>
        </View>

        <View style={[styles.flexible, styles.alignRight]}>
          <Text style={styles.smallLabel}>Location</Text>

          <Text style={[styles.detailText, styles.rightText]}>
            {item.location}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={visibleJobs}
        keyExtractor={(item) => item.id}
        renderItem={renderJob}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.brand}>SoloTrack</Text>
                <Text style={styles.secondaryText}>
                  Your work, in one place.
                </Text>
              </View>

              <View style={styles.brandMark}>
                <Text style={styles.brandMarkText}>ST</Text>
              </View>
            </View>

            <View style={styles.headingSection}>
              <Text style={styles.date}>
                {new Date().toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </Text>
              <Text style={styles.pageTitle}>Keep Work Moving</Text>
            </View>

            <Pressable
  accessibilityRole="button"
  accessibilityLabel={
    nextAttentionJob
      ? `Open priority job: ${nextAttentionJob.title}`
      : 'Show all jobs'
  }
  onPress={() => {
    if (nextAttentionJob) {
      setSelectedJob(nextAttentionJob);
    } else {
      setShowAll(true);
    }
  }}
  style={({ pressed }) => [
    styles.hero,
    pressed && styles.pressed,
  ]}
>
  <Text style={styles.heroLabel}>NEEDS YOUR ATTENTION</Text>

  <Text style={styles.heroTitle}>
    {nextAttentionJob
      ? nextAttentionJob.title
      : 'You’re up to date.'}
  </Text>

  <Text style={styles.heroDescription}>
    {nextAttentionJob
      ? nextAttentionJob.nextAction ||
        'Review this job’s outstanding payment.'
      : 'No overdue work, due follow-ups or completed unpaid jobs.'}
  </Text>

  <View style={styles.heroFooter}>
    <Text style={styles.heroLocation}>
      {nextAttentionJob
        ? getAttentionReasons(nextAttentionJob, now).join(' · ')
        : 'Explore your job list'}
    </Text>

    <Text style={styles.heroArrow}>↗</Text>
  </View>
</Pressable>

            <View style={styles.summaryRow}>
  <View style={styles.summaryCard}>
    <Text style={styles.smallLabel}>Needs attention</Text>
    <Text style={styles.summaryValue}>
      {summary.attentionCount}
    </Text>
    <Text style={styles.secondaryText}>
      {summary.activeCount} active jobs
    </Text>
  </View>

  <View style={styles.summaryCard}>
    <Text style={styles.smallLabel}>Outstanding</Text>
    <Text style={styles.moneyValue}>
      {formatMoney(summary.outstandingAmount)}
    </Text>
    <Text style={styles.secondaryText}>
      {formatMoney(summary.overdueAmount)} overdue
    </Text>
  </View>
</View>

            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitle}>
                {showAll ? 'All jobs' : 'Needs attention'}
              </Text>

              <Pressable
                accessibilityRole="button"
                onPress={() => setShowAll((current) => !current)}
                style={styles.textButton}
              >
                <Text style={styles.textButtonLabel}>
                  {showAll ? 'Needs attention' : 'View all'}
                </Text>
              </Pressable>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.jobCard}>
          <Text style={styles.jobTitle}>Nothing needs attention</Text>
           <Text style={styles.secondaryText}>You have no due follow-ups, overdue work or completed unpaid jobs.Choose View all to review your other work.</Text>
          </View>
}
        ListFooterComponent={
          <Text style={styles.sampleNote}>
            Sample job records · illustrative prices
          </Text>
        }
      />

      <Modal
        visible={selectedJob !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedJob(null)}
      >
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalSheet} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <View style={styles.sheetHandle} />

              <Text style={styles.service}>JOB PREVIEW</Text>
              <Text style={styles.pageTitle}>{selectedJob?.title}</Text>
              <Text style={styles.secondaryText}>
                {selectedJob?.description}
              </Text>

              {selectedJob && (
                <View style={styles.previewDetails}>
                  <Text style={styles.detailText}>
                    Customer: {selectedJob.customerName}
                  </Text>
                  <Text style={styles.detailText}>
                    Location: {selectedJob.location}
                  </Text>
                  <Text style={styles.detailText}>
                    {selectedJob.dateType}:{' '}
                    {new Date(selectedJob.scheduledAt).toLocaleString()}
                  </Text>
                  <Text style={styles.detailText}>
                    Agreed price:{' '}
                    {selectedJob.agreedAmount === null
                      ? 'Not agreed yet'
                      : formatMoney(selectedJob.agreedAmount)}
                  </Text>
                  <Text style={styles.detailText}>
                    Received: {formatMoney(selectedJob.amountPaid)}
                  </Text>
                  <Text style={styles.secondaryText}>
                    {selectedJob.notes}
                  </Text>
                </View>
              )}

              <Pressable
                accessibilityRole="button"
                onPress={() => setSelectedJob(null)}
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.primaryButtonText}>Close preview</Text>
              </Pressable>
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  headerContent: {
    gap: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  flexible: {
    flex: 1,
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  rightText: {
    textAlign: 'right',
  },
  brand: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  brandMark: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.medium,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandMarkText: {
    color: COLORS.primary,
    fontWeight: '800',
    fontSize: 16,
  },
  headingSection: {
    gap: SPACING.sm,
  },
  date: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  pageTitle: {
    fontSize: 28,
    lineHeight: 35,
    fontWeight: '800',
    color: COLORS.text,
  },
  hero: {
    backgroundColor: COLORS.darkSurface,
    borderRadius: RADIUS.large,
    padding: SPACING.xl,
    gap: SPACING.md,
    elevation: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  heroLabel: {
    color: '#A7E3D6',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 31,
    fontWeight: '700',
  },
  heroDescription: {
    color: '#D2DEE6',
    fontSize: 15,
    lineHeight: 22,
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  heroLocation: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
  },
  heroArrow: {
    color: '#A7E3D6',
    fontSize: 26,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  smallLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  summaryValue: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.text,
  },
  moneyValue: {
    fontSize: 21,
    fontWeight: '800',
    color: COLORS.primary,
  },
  secondaryText: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  textButton: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: SPACING.sm,
  },
  textButtonLabel: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  jobCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  service: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  jobTitle: {
    color: COLORS.text,
    fontSize: 18,
    lineHeight: 25,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  detailText: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
  },
  sampleNote: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
  pressed: {
    opacity: 0.8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.large,
    borderTopRightRadius: RADIUS.large,
    maxHeight: '85%',
  },
  modalContent: {
    padding: SPACING.xl,
    gap: SPACING.lg,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginBottom: SPACING.sm,
  },
  previewDetails: {
    gap: SPACING.md,
  },
  primaryButton: {
    minHeight: 52,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.medium,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },

attentionText: {
  color: COLORS.overdue,
  fontSize: 13,
  lineHeight: 20,
  fontWeight: '600',
},
  primaryButtonText: {
    color: COLORS.onPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
});