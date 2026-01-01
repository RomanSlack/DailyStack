import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Icon } from '../../components/Icon';
import { ArcProgress, BarChart, LineChart, ProgressBar } from '../../components/charts';
import { useUserStore } from '../../stores/userStore';
import { useTaskStore } from '../../stores/taskStore';
import {
  calculateBioAge,
  calculateFactorsFromAppData,
  getBioAgeMessage,
  xpToYearsSaved,
  GRADE_COLORS,
  STATUS_COLORS,
  BioAgeResult,
} from '../../data/bioAge';
import { colors, spacing, borderRadius } from '../../lib/theme';

const { width } = Dimensions.get('window');

export default function BioAgeScreen() {
  const { totalXP, currentStreak, longestStreak, createdAt } = useUserStore();
  const { completions } = useTaskStore();
  const [userAge, setUserAge] = React.useState(35);

  // Calculate days since start
  const daysSinceStart = Math.max(
    1,
    Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24))
  );

  // Calculate factors from app data
  const appFactors = calculateFactorsFromAppData(
    completions,
    currentStreak,
    longestStreak,
    daysSinceStart
  );

  // Calculate bio-age
  const bioAgeResult = calculateBioAge({
    ...appFactors,
    chronologicalAge: userAge,
    smokingStatus: 'never',
    alcoholFrequency: 'occasional',
  } as any);

  const yearsSaved = xpToYearsSaved(totalXP);

  // Mock weekly data for line chart
  const weeklyBioAge = React.useMemo(() => {
    const baseAge = bioAgeResult.biologicalAge;
    return [
      baseAge + 0.3,
      baseAge + 0.2,
      baseAge + 0.1,
      baseAge,
      baseAge - 0.1,
      baseAge - 0.15,
      baseAge - 0.2,
    ];
  }, [bioAgeResult.biologicalAge]);

  const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Factor bar chart data
  const factorChartData = bioAgeResult.factors.slice(0, 6).map((f) => ({
    label: f.name.slice(0, 3),
    value: f.score,
    color: STATUS_COLORS[f.status],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Bio-Age</Text>
          <View style={styles.gradeContainer}>
            <Text style={[styles.grade, { color: GRADE_COLORS[bioAgeResult.grade] }]}>
              {bioAgeResult.grade}
            </Text>
          </View>
        </View>

        {/* Main Bio-Age Display */}
        <View style={styles.mainCard}>
          <View style={styles.bioAgeDisplay}>
            <ArcProgress
              progress={Math.max(0, (1 - bioAgeResult.ageDifference / 20) * 100)}
              size={200}
              strokeWidth={12}
              color={GRADE_COLORS[bioAgeResult.grade]}
            >
              <Text style={styles.bioAgeValue}>
                {bioAgeResult.biologicalAge.toFixed(1)}
              </Text>
              <Text style={styles.bioAgeLabel}>BIO-AGE</Text>
            </ArcProgress>
          </View>

          <View style={styles.ageComparison}>
            <View style={styles.ageItem}>
              <Text style={styles.ageItemValue}>{userAge}</Text>
              <Text style={styles.ageItemLabel}>Actual Age</Text>
            </View>
            <View style={styles.ageDivider}>
              <Icon name="chevron-right" size={20} color={colors.text.tertiary} />
            </View>
            <View style={styles.ageItem}>
              <Text style={[styles.ageItemValue, { color: GRADE_COLORS[bioAgeResult.grade] }]}>
                {bioAgeResult.ageDifference > 0 ? '+' : ''}{bioAgeResult.ageDifference.toFixed(1)}
              </Text>
              <Text style={styles.ageItemLabel}>Difference</Text>
            </View>
          </View>

          <Text style={styles.motivationalText}>
            {getBioAgeMessage(bioAgeResult)}
          </Text>
        </View>

        {/* Years Saved Counter */}
        <View style={styles.yearsSavedCard}>
          <View style={styles.yearsSavedHeader}>
            <Icon name="clock" size={24} color={colors.accent.success} />
            <Text style={styles.yearsSavedTitle}>Years Saved</Text>
          </View>
          <Text style={styles.yearsSavedValue}>{yearsSaved.toFixed(1)}</Text>
          <Text style={styles.yearsSavedSubtext}>
            Through your protocol adherence
          </Text>
          <View style={styles.yearsSavedStats}>
            <View style={styles.yearsSavedStat}>
              <Text style={styles.statValue}>{totalXP.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total XP</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.yearsSavedStat}>
              <Text style={styles.statValue}>{bioAgeResult.percentile}th</Text>
              <Text style={styles.statLabel}>Percentile</Text>
            </View>
          </View>
        </View>

        {/* Weekly Trend Chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>WEEKLY TREND</Text>
          <Text style={styles.cardSubtitle}>Your bio-age over the past week</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={weeklyBioAge}
              labels={weekLabels}
              height={140}
              color={GRADE_COLORS[bioAgeResult.grade]}
              showDots={true}
              fillGradient={true}
            />
          </View>
        </View>

        {/* Factor Scores */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>FACTOR BREAKDOWN</Text>
          <Text style={styles.cardSubtitle}>What's impacting your bio-age</Text>
          <View style={styles.chartContainer}>
            <BarChart
              data={factorChartData}
              height={100}
              showLabels={true}
              showValues={true}
            />
          </View>
        </View>

        {/* Detailed Factors */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>DETAILED SCORES</Text>
          {bioAgeResult.factors.map((factor) => (
            <View key={factor.name} style={styles.factorRow}>
              <View style={styles.factorLeft}>
                <View style={[styles.factorIcon, { backgroundColor: `${STATUS_COLORS[factor.status]}20` }]}>
                  <Icon name={factor.icon} size={16} color={STATUS_COLORS[factor.status]} />
                </View>
                <Text style={styles.factorName}>{factor.name}</Text>
              </View>
              <View style={styles.factorRight}>
                <View style={styles.factorBarContainer}>
                  <View
                    style={[
                      styles.factorBar,
                      {
                        width: `${factor.score}%`,
                        backgroundColor: STATUS_COLORS[factor.status],
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.factorScore, { color: STATUS_COLORS[factor.status] }]}>
                  {factor.score}%
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Impact Summary */}
        <View style={styles.impactGrid}>
          <View style={styles.impactCard}>
            <Icon name="dumbbell" size={24} color={colors.accent.primary} />
            <Text style={styles.impactValue}>
              {bioAgeResult.factors.find(f => f.name === 'Exercise')?.impact.toFixed(1) || '0'}
            </Text>
            <Text style={styles.impactLabel}>years from exercise</Text>
          </View>
          <View style={styles.impactCard}>
            <Icon name="moon" size={24} color={colors.accent.primary} />
            <Text style={styles.impactValue}>
              {bioAgeResult.factors.find(f => f.name === 'Sleep')?.impact.toFixed(1) || '0'}
            </Text>
            <Text style={styles.impactLabel}>years from sleep</Text>
          </View>
        </View>

        {/* Connect Wearables CTA */}
        <TouchableOpacity style={styles.wearablesCta}>
          <View style={styles.wearablesLeft}>
            <View style={styles.wearablesIcon}>
              <Icon name="activity" size={24} color={colors.accent.primary} />
            </View>
            <View>
              <Text style={styles.wearablesTitle}>Connect Wearables</Text>
              <Text style={styles.wearablesSubtitle}>
                Sync Apple Health, Oura, or Whoop for more accurate bio-age
              </Text>
            </View>
          </View>
          <Icon name="chevron-right" size={20} color={colors.text.tertiary} />
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: '300',
    letterSpacing: -0.5,
  },
  gradeContainer: {
    backgroundColor: colors.background.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  grade: {
    fontSize: 18,
    fontWeight: '700',
  },
  mainCard: {
    backgroundColor: colors.background.card,
    marginHorizontal: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    alignItems: 'center',
  },
  bioAgeDisplay: {
    marginBottom: spacing.lg,
  },
  bioAgeValue: {
    color: colors.text.primary,
    fontSize: 48,
    fontWeight: '200',
    letterSpacing: -2,
  },
  bioAgeLabel: {
    color: colors.text.tertiary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    marginTop: -4,
  },
  ageComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  ageItem: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  ageItemValue: {
    color: colors.text.primary,
    fontSize: 24,
    fontWeight: '300',
  },
  ageItemLabel: {
    color: colors.text.tertiary,
    fontSize: 11,
    marginTop: 4,
  },
  ageDivider: {
    paddingHorizontal: spacing.md,
  },
  motivationalText: {
    color: colors.text.secondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  yearsSavedCard: {
    backgroundColor: colors.background.card,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.accent.success,
    alignItems: 'center',
  },
  yearsSavedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  yearsSavedTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  yearsSavedValue: {
    color: colors.accent.success,
    fontSize: 64,
    fontWeight: '200',
    letterSpacing: -3,
  },
  yearsSavedSubtext: {
    color: colors.text.tertiary,
    fontSize: 13,
    marginBottom: spacing.lg,
  },
  yearsSavedStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    paddingTop: spacing.md,
    width: '100%',
  },
  yearsSavedStat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: '300',
  },
  statLabel: {
    color: colors.text.tertiary,
    fontSize: 11,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border.subtle,
  },
  card: {
    backgroundColor: colors.background.card,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  cardTitle: {
    color: colors.text.tertiary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginBottom: spacing.xs,
  },
  cardSubtitle: {
    color: colors.text.secondary,
    fontSize: 13,
    marginBottom: spacing.lg,
  },
  chartContainer: {
    marginTop: spacing.sm,
  },
  factorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  factorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  factorIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  factorName: {
    color: colors.text.primary,
    fontSize: 14,
  },
  factorRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  factorBarContainer: {
    width: 80,
    height: 6,
    backgroundColor: colors.background.tertiary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  factorBar: {
    height: '100%',
    borderRadius: 3,
  },
  factorScore: {
    fontSize: 13,
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },
  impactGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  impactCard: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  impactValue: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: '200',
    marginTop: spacing.sm,
  },
  impactLabel: {
    color: colors.text.tertiary,
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  wearablesCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.card,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.accent.primary,
  },
  wearablesLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  wearablesIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: `${colors.accent.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  wearablesTitle: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: '500',
  },
  wearablesSubtitle: {
    color: colors.text.tertiary,
    fontSize: 12,
    marginTop: 2,
    maxWidth: 220,
  },
  bottomPadding: {
    height: 100,
  },
});
