import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Icon } from '../../components/Icon';
import { useUserStore } from '../../stores/userStore';
import { useTaskStore } from '../../stores/taskStore';
import { BLUEPRINT_TASKS } from '../../data/blueprintProtocol';
import { xpToYearsSaved, calculateBioAge, calculateFactorsFromAppData, GRADE_COLORS } from '../../data/bioAge';
import { calculateAllTierTotals, FULL_STACK_IDS } from '../../data/supplements';
import { MEAL_COST_SUMMARY } from '../../data/meals';
import { colors, spacing, borderRadius } from '../../lib/theme';

export default function ProgressScreen() {
  const router = useRouter();
  const { totalXP, currentStreak, longestStreak, createdAt, getLevel } = useUserStore();
  const { completions } = useTaskStore();

  const level = getLevel();
  const yearsSaved = xpToYearsSaved(totalXP);

  // Bio-age calculation
  const daysSinceStart = Math.max(
    1,
    Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24))
  );
  const appFactors = calculateFactorsFromAppData(
    completions,
    currentStreak,
    longestStreak,
    daysSinceStart
  );
  const bioAgeResult = calculateBioAge({
    ...appFactors,
    chronologicalAge: 35,
    smokingStatus: 'never',
    alcoholFrequency: 'occasional',
  } as any);

  // Budget calculation
  const supplementTotals = calculateAllTierTotals(FULL_STACK_IDS);
  const budgetMonthlyCost = supplementTotals.budget + MEAL_COST_SUMMARY.budgetMonthly;

  // Weekly chart data
  const last7Days = React.useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayCompletions = completions.filter((c) => c.date === dateStr).length;
      const percentage = (dayCompletions / BLUEPRINT_TASKS.length) * 100;
      days.push({
        date: dateStr,
        day: date.toLocaleDateString('en-US', { weekday: 'narrow' }),
        completions: dayCompletions,
        percentage,
      });
    }
    return days;
  }, [completions]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Progress</Text>
        </View>

        {/* Main Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: `${colors.accent.warning}15` }]}>
              <Icon name="flame" size={24} color={colors.accent.warning} />
            </View>
            <Text style={styles.statValue}>{currentStreak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: `${colors.accent.primary}15` }]}>
              <Icon name="zap" size={24} color={colors.accent.primary} />
            </View>
            <Text style={styles.statValue}>{level}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: `${colors.accent.success}15` }]}>
              <Icon name="clock" size={24} color={colors.accent.success} />
            </View>
            <Text style={[styles.statValue, { color: colors.accent.success }]}>{yearsSaved.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Yrs Saved</Text>
          </View>
        </View>

        {/* Weekly Activity */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>This Week</Text>
          <View style={styles.weekChart}>
            {last7Days.map((day, index) => (
              <View key={day.date} style={styles.dayColumn}>
                <View style={styles.dayBarTrack}>
                  <View
                    style={[
                      styles.dayBar,
                      {
                        height: `${Math.max(day.percentage, 8)}%`,
                        backgroundColor: day.percentage >= 80 ? colors.accent.success : colors.accent.primary,
                      },
                    ]}
                  />
                </View>
                <Text style={[
                  styles.dayLabel,
                  index === 6 && styles.dayLabelToday
                ]}>
                  {day.day}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* XP Progress */}
        <View style={styles.card}>
          <View style={styles.xpHeader}>
            <Text style={styles.cardTitle}>Total XP</Text>
            <Text style={styles.xpValue}>{totalXP.toLocaleString()}</Text>
          </View>
          <Text style={styles.xpSubtext}>
            {Math.round(totalXP / daysSinceStart)} XP per day average
          </Text>
        </View>

        {/* Deep Dive Section */}
        <Text style={styles.sectionTitle}>Insights</Text>

        {/* Bio-Age Card */}
        <TouchableOpacity
          style={styles.insightCard}
          onPress={() => router.push('/bio-age')}
          activeOpacity={0.7}
        >
          <View style={[styles.insightIconCircle, { backgroundColor: `${GRADE_COLORS[bioAgeResult.grade]}15` }]}>
            <Text style={[styles.gradeText, { color: GRADE_COLORS[bioAgeResult.grade] }]}>
              {bioAgeResult.grade}
            </Text>
          </View>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Biological Age</Text>
            <Text style={styles.insightSubtitle}>
              {bioAgeResult.biologicalAge.toFixed(1)} years old
            </Text>
          </View>
          <Icon name="chevron-right" size={20} color={colors.text.tertiary} />
        </TouchableOpacity>

        {/* Budget Card */}
        <TouchableOpacity
          style={styles.insightCard}
          onPress={() => router.push('/budget')}
          activeOpacity={0.7}
        >
          <View style={[styles.insightIconCircle, { backgroundColor: `${colors.accent.success}15` }]}>
            <Icon name="piggy-bank" size={24} color={colors.accent.success} />
          </View>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Budget Tracker</Text>
            <Text style={styles.insightSubtitle}>
              ${Math.round(budgetMonthlyCost)}/month
            </Text>
          </View>
          <Icon name="chevron-right" size={20} color={colors.text.tertiary} />
        </TouchableOpacity>

        {/* Streak Record */}
        {longestStreak > 0 && (
          <View style={styles.recordCard}>
            <Icon name="trophy" size={24} color={colors.accent.warning} />
            <View style={styles.recordContent}>
              <Text style={styles.recordLabel}>Best Streak</Text>
              <Text style={styles.recordValue}>{longestStreak} days</Text>
            </View>
            {currentStreak >= longestStreak && currentStreak > 0 && (
              <View style={styles.recordBadge}>
                <Text style={styles.recordBadgeText}>RECORD!</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  title: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    color: colors.text.primary,
    fontSize: 24,
    fontWeight: '600',
  },
  statLabel: {
    color: colors.text.tertiary,
    fontSize: 12,
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.background.card,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  cardTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  weekChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 80,
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
  },
  dayBarTrack: {
    width: 24,
    height: 60,
    backgroundColor: colors.background.tertiary,
    borderRadius: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  dayBar: {
    width: '100%',
    borderRadius: 12,
  },
  dayLabel: {
    color: colors.text.tertiary,
    fontSize: 11,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  dayLabelToday: {
    color: colors.accent.primary,
    fontWeight: '600',
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpValue: {
    color: colors.accent.primary,
    fontSize: 24,
    fontWeight: '600',
  },
  xpSubtext: {
    color: colors.text.tertiary,
    fontSize: 13,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  insightIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  gradeText: {
    fontSize: 18,
    fontWeight: '700',
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  insightSubtitle: {
    color: colors.text.tertiary,
    fontSize: 13,
    marginTop: 2,
  },
  recordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.accent.warning}08`,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: `${colors.accent.warning}25`,
  },
  recordContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  recordLabel: {
    color: colors.text.tertiary,
    fontSize: 12,
  },
  recordValue: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: '600',
  },
  recordBadge: {
    backgroundColor: colors.accent.warning,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  recordBadgeText: {
    color: colors.text.inverse,
    fontSize: 10,
    fontWeight: '700',
  },
  bottomPadding: {
    height: 100,
  },
});
