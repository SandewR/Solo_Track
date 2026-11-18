import { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '../../constants/solotrack_theme';
import { useJobs } from '../../context/job_context';
import { getOutstandingBalance } from '../../utils/job_helpers';
import { useRouter } from 'expo-router';

const FILTERS = ['All', 'Active', 'Completed'];

export default function JobsScreen() {
  const router = useRouter();  
  const { jobs, lastResumedAt } = useJobs();
  const [filter, setFilter] = useState('All');

  const filteredJobs = jobs.filter((job) => {
    if (filter === 'Active') {
      return job.status !== 'Completed' && job.status !== 'Cancelled';
    }

    if (filter === 'Completed') {
      return job.status === 'Completed';
    }

    return true;
  });

  function renderJob({ item }) {
    const balance = getOutstandingBalance(item);

    return (
      <Pressable
  style={styles.card}
  accessibilityRole="button"
  onPress={() =>
    router.push({
      pathname: '/job/[id]',
      params: { id: item.id },
    })
  }
>
        <View style={styles.cardHeader}>
          <Text style={styles.customer}>{item.customerName}</Text>

          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <Text style={styles.jobTitle}>{item.title}</Text>
        <Text style={styles.location}>{item.location}</Text>

        <View style={styles.cardFooter}>
          <Text style={styles.date}>
            {new Date(item.scheduledAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
            })}
          </Text>

          <Text style={styles.balance}>
            {balance === null
              ? 'Price not agreed'
              : balance === 0
                ? 'Fully paid'
                : `LKR ${balance.toLocaleString('en-LK')} remaining`}
          </Text>
        </View>
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        renderItem={renderJob}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.workspaceBanner}>
  <Image
    source={require('../../../assets/images/solotrack.png')}
    style={styles.workspaceImage}
    resizeMode="cover"
  />
  <Text style={styles.bannerTitle}>{'Every job.\nOne place.'}</Text>
</View>
            <Text style={styles.eyebrow}>YOUR WORKSPACE</Text>
            <Text style={styles.title}>Jobs</Text>
            <Text style={styles.description}>
              Keep every job and outstanding payment in view.
            </Text>
<Text style={styles.description}>
  {lastResumedAt
    ? `Updated after returning at ${new Date(
        lastResumedAt
      ).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })}`
    : 'Your workspace is ready'}
</Text>
            <View style={styles.filters}>
              {FILTERS.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => setFilter(option)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: filter === option }}
                  style={[
                    styles.filter,
                    filter === option && styles.selectedFilter,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      filter === option && styles.selectedFilterText,
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.count}>
              {filteredJobs.length}{' '}
              {filteredJobs.length === 1 ? 'job' : 'jobs'}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Nothing here yet</Text>
            <Text style={styles.description}>
              Jobs matching this filter will appear here.
            </Text>
          </View>
        }
      />
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
    paddingBottom: 32,
  },
  eyebrow: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
    marginBottom: 20,
  },
  filter: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedFilter: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  selectedFilterText: {
    color: COLORS.onPrimary,
  },
  count: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 14,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 12,
  },
  customer: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  statusBadge: {
    flexShrink: 1,
    backgroundColor: COLORS.primarySoft,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  jobTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 26,
  },
  location: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 18,
    paddingTop: 14,
  },
  date: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  balance: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'right',
  },
  emptyCard: {
    padding: 24,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  workspaceBanner: {
  height: 170,
  borderRadius: 22,
  overflow: 'hidden',
  marginBottom: 24,
  backgroundColor: COLORS.darkSurface,
},
workspaceImage: {
  width: '100%',
  height: '100%',
},
bannerTitle: {
  position: 'absolute',
  left: 18,
  bottom: 18,
  color: '#FFFFFF',
  fontSize: 24,
  lineHeight: 29,
  fontWeight: '800',
},
});