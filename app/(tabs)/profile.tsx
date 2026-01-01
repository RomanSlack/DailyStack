import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon, IconName } from '../../components/Icon';
import { useUserStore } from '../../stores/userStore';
import { useTaskStore } from '../../stores/taskStore';
import { LEVEL_TITLES, getLevelFromXP } from '../../data/blueprintProtocol';
import { colors, spacing, borderRadius } from '../../lib/theme';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  requirement: number;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-task', title: 'First Steps', description: 'Complete your first task', icon: 'star', requirement: 1 },
  { id: 'week-streak', title: 'Week One', description: '7-day streak', icon: 'flame', requirement: 7 },
  { id: 'month-streak', title: 'Month', description: '30-day streak', icon: 'trophy', requirement: 30 },
  { id: 'hundred-tasks', title: 'Century', description: '100 tasks completed', icon: 'award', requirement: 100 },
  { id: 'level-5', title: 'Adept', description: 'Reach level 5', icon: 'shield', requirement: 5 },
  { id: 'level-10', title: 'Legend', description: 'Reach level 10', icon: 'crown', requirement: 10 },
];

export default function ProfileScreen() {
  const {
    totalXP,
    currentStreak,
    longestStreak,
    streakFreezes,
    isPremium,
    getLevel,
    getLevelTitle,
    addStreakFreeze,
    setPremium,
  } = useUserStore();
  const { completions } = useTaskStore();
  const level = getLevel();

  const unlockedAchievements = React.useMemo(() => {
    const unlocked: string[] = [];
    if (completions.length >= 1) unlocked.push('first-task');
    if (longestStreak >= 7) unlocked.push('week-streak');
    if (longestStreak >= 30) unlocked.push('month-streak');
    if (completions.length >= 100) unlocked.push('hundred-tasks');
    if (level >= 5) unlocked.push('level-5');
    if (level >= 10) unlocked.push('level-10');
    return unlocked;
  }, [completions.length, longestStreak, level]);

  const handleBuyStreakFreeze = () => {
    Alert.alert(
      'Streak Freeze',
      'Protect your streak for one day.\n\n$0.99',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Purchase',
          onPress: () => {
            addStreakFreeze(1);
            Alert.alert('Success', 'Streak freeze added.');
          },
        },
      ]
    );
  };

  const handleUnlockUnlimited = () => {
    Alert.alert(
      'Unlock Unlimited',
      'Get lifetime access to all features:\n\n• Unlimited streak freezes\n• Advanced analytics\n• Custom protocols\n• Priority support\n\nOne-time purchase: $10',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unlock — $10',
          onPress: () => {
            setPremium(true);
            addStreakFreeze(99);
            Alert.alert('Unlocked', 'Welcome to Blueprint Unlimited.');
          },
        },
      ]
    );
  };

  const handleViewBlueprint = () => {
    Linking.openURL('https://blueprint.bryanjohnson.com');
  };

  const handleResetProgress = async () => {
    const confirmed = window.confirm(
      'Reset All Progress?\n\nThis will delete ALL your data including XP, streaks, and task completions. This cannot be undone!'
    );

    if (confirmed) {
      // Clear storage
      await AsyncStorage.removeItem('blueprint-user-storage');
      await AsyncStorage.removeItem('blueprint-task-storage');

      // Reset stores
      useUserStore.setState({
        totalXP: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastCompletedDate: null,
        streakFreezes: 1,
        isPremium: false,
        hasBudgetAccess: false,
        createdAt: new Date().toISOString(),
      });

      useTaskStore.setState({
        completions: [],
      });

      window.alert('Progress reset!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{level}</Text>
            </View>
            {isPremium && <View style={styles.premiumIndicator} />}
          </View>
          <Text style={styles.userName}>{getLevelTitle()}</Text>
          <Text style={styles.userSubtitle}>Level {level}</Text>
          {isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>UNLIMITED</Text>
            </View>
          )}
        </View>

        {/* Stats Row */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalXP.toLocaleString()}</Text>
            <Text style={styles.statLabel}>XP</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{currentStreak}</Text>
            <Text style={styles.statLabel}>STREAK</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{streakFreezes}</Text>
            <Text style={styles.statLabel}>FREEZES</Text>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ACHIEVEMENTS</Text>
          <View style={styles.achievementsGrid}>
            {ACHIEVEMENTS.map((achievement) => {
              const isUnlocked = unlockedAchievements.includes(achievement.id);
              return (
                <View
                  key={achievement.id}
                  style={[styles.achievementCard, isUnlocked && styles.achievementUnlocked]}
                >
                  <View style={styles.achievementIconContainer}>
                    <Icon
                      name={achievement.icon}
                      size={20}
                      color={isUnlocked ? colors.accent.success : colors.text.tertiary}
                      strokeWidth={1.5}
                    />
                  </View>
                  <Text style={[styles.achievementTitle, !isUnlocked && styles.achievementTitleLocked]}>
                    {achievement.title}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Store */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>STORE</Text>

          <TouchableOpacity style={styles.storeItem} onPress={handleBuyStreakFreeze}>
            <View style={styles.storeLeft}>
              <View style={styles.storeIconContainer}>
                <Icon name="snowflake" size={20} color={colors.accent.primary} />
              </View>
              <View>
                <Text style={styles.storeTitle}>Streak Freeze</Text>
                <Text style={styles.storeDesc}>Protect streak for 1 day</Text>
              </View>
            </View>
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>$0.99</Text>
            </View>
          </TouchableOpacity>

          {!isPremium && (
            <TouchableOpacity style={[styles.storeItem, styles.unlimitedItem]} onPress={handleUnlockUnlimited}>
              <View style={styles.storeLeft}>
                <View style={[styles.storeIconContainer, styles.unlimitedIcon]}>
                  <Icon name="gem" size={20} color={colors.accent.warning} />
                </View>
                <View>
                  <Text style={styles.storeTitle}>Unlimited</Text>
                  <Text style={styles.storeDesc}>Lifetime access to all features</Text>
                </View>
              </View>
              <View style={[styles.priceTag, styles.unlimitedPrice]}>
                <Text style={styles.priceText}>$10</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>RESOURCES</Text>
          <TouchableOpacity style={styles.linkItem} onPress={handleViewBlueprint}>
            <Text style={styles.linkText}>View Blueprint Protocol</Text>
            <Icon name="external-link" size={16} color={colors.accent.primary} />
          </TouchableOpacity>
        </View>

        {/* Dev/Testing */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DEVELOPER</Text>
          <TouchableOpacity style={styles.resetButton} onPress={handleResetProgress}>
            <Icon name="trash" size={18} color={colors.accent.error} />
            <Text style={styles.resetText}>Reset All Progress</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Blueprint Quest</Text>
          <Text style={styles.footerVersion}>Version 1.0.0</Text>
        </View>

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
  userCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.text.inverse,
    fontSize: 24,
    fontWeight: '300',
  },
  premiumIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.accent.warning,
    borderWidth: 2,
    borderColor: colors.background.primary,
  },
  userName: {
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: '300',
  },
  userSubtitle: {
    color: colors.text.tertiary,
    fontSize: 13,
    marginTop: 2,
  },
  premiumBadge: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: `${colors.accent.warning}20`,
    borderRadius: borderRadius.sm,
  },
  premiumText: {
    color: colors.accent.warning,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.background.card,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: '300',
  },
  statLabel: {
    color: colors.text.tertiary,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border.subtle,
  },
  section: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  sectionLabel: {
    color: colors.text.tertiary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginBottom: spacing.md,
    marginLeft: spacing.xs,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  achievementCard: {
    width: '31%',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    margin: spacing.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  achievementUnlocked: {
    borderColor: colors.accent.success,
  },
  achievementIconContainer: {
    marginBottom: spacing.sm,
  },
  achievementTitle: {
    color: colors.text.primary,
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  achievementTitleLocked: {
    color: colors.text.tertiary,
  },
  storeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  unlimitedItem: {
    borderColor: colors.accent.warning,
  },
  storeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  unlimitedIcon: {
    backgroundColor: `${colors.accent.warning}20`,
  },
  storeTitle: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: '500',
  },
  storeDesc: {
    color: colors.text.tertiary,
    fontSize: 12,
    marginTop: 2,
  },
  priceTag: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  unlimitedPrice: {
    backgroundColor: colors.accent.warning,
  },
  priceText: {
    color: colors.text.inverse,
    fontSize: 13,
    fontWeight: '600',
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  linkText: {
    color: colors.text.primary,
    fontSize: 14,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.accent.error}10`,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: `${colors.accent.error}30`,
  },
  resetText: {
    color: colors.accent.error,
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    paddingVertical: spacing.lg,
  },
  footerText: {
    color: colors.text.tertiary,
    fontSize: 13,
    fontWeight: '500',
  },
  footerVersion: {
    color: colors.text.tertiary,
    fontSize: 11,
    marginTop: 4,
    opacity: 0.5,
  },
  bottomPadding: {
    height: 100,
  },
});
