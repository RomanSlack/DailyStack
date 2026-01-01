import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Icon } from '../../components/Icon';
import { useTaskStore } from '../../stores/taskStore';
import { useUserStore } from '../../stores/userStore';
import { BLUEPRINT_TASKS } from '../../data/blueprintProtocol';
import { colors, spacing, borderRadius } from '../../lib/theme';

const { width, height } = Dimensions.get('window');

export default function TodayScreen() {
  const { completeTask, uncompleteTask, isTaskCompleted, getCompletionPercentage, getTodayXP } = useTaskStore();
  const { currentStreak, totalXP } = useUserStore();

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [showCelebration, setShowCelebration] = React.useState(false);
  const [perfectDay, setPerfectDay] = React.useState(false);

  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const celebrationAnim = React.useRef(new Animated.Value(0)).current;
  const checkAnim = React.useRef(new Animated.Value(0)).current;

  // Get all tasks and their completion status
  const allTasks = BLUEPRINT_TASKS;
  const completedCount = allTasks.filter(t => isTaskCompleted(t.id)).length;
  const completionPercentage = getCompletionPercentage();

  // Find first incomplete task, or show completed state
  const incompleteTasks = allTasks.filter(t => !isTaskCompleted(t.id));
  const currentTask = incompleteTasks[0] || null;
  const allComplete = incompleteTasks.length === 0;

  const handleComplete = () => {
    if (!currentTask) return;

    // Animate the card
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Show checkmark animation
    Animated.sequence([
      Animated.timing(checkAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(200),
      Animated.timing(checkAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    completeTask(currentTask.id);

    // Check if this completes all tasks
    if (incompleteTasks.length === 1) {
      setPerfectDay(true);
      triggerCelebration();
    }
  };

  const handleSkip = () => {
    // Move to next task without completing
    if (incompleteTasks.length > 1) {
      // Reorder tasks - move current to end
      // For now, just show next incomplete
    }
  };

  const triggerCelebration = () => {
    setShowCelebration(true);
    Animated.sequence([
      Animated.timing(celebrationAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(celebrationAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowCelebration(false);
    });
  };

  const formatTime = () => {
    const now = new Date();
    const hours = now.getHours();
    if (hours < 12) return 'morning';
    if (hours < 17) return 'afternoon';
    return 'evening';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Streak */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good {formatTime()}</Text>
          <Text style={styles.subtitle}>
            {allComplete ? "You crushed it today!" : "Let's build your streak"}
          </Text>
        </View>
        <View style={styles.streakContainer}>
          <Icon name="flame" size={28} color={currentStreak > 0 ? colors.accent.warning : colors.text.tertiary} />
          <Text style={[styles.streakNumber, currentStreak > 0 && styles.streakActive]}>
            {currentStreak}
          </Text>
        </View>
      </View>

      {/* Progress Ring */}
      <View style={styles.progressSection}>
        <View style={styles.progressRing}>
          <View style={styles.progressRingInner}>
            <Text style={styles.progressPercent}>{Math.round(completionPercentage)}%</Text>
            <Text style={styles.progressLabel}>complete</Text>
          </View>
        </View>
        <View style={styles.progressStats}>
          <Text style={styles.progressText}>
            <Text style={styles.progressBold}>{completedCount}</Text>/{allTasks.length} tasks
          </Text>
          <Text style={styles.xpText}>+{getTodayXP()} XP today</Text>
        </View>
      </View>

      {/* Task Card */}
      <View style={styles.cardSection}>
        {allComplete ? (
          <View style={styles.completeCard}>
            <View style={styles.completeIconContainer}>
              <Icon name="check" size={64} color={colors.accent.success} strokeWidth={3} />
            </View>
            <Text style={styles.completeTitle}>Perfect Day!</Text>
            <Text style={styles.completeSubtitle}>
              You've completed your entire protocol.{'\n'}See you tomorrow!
            </Text>
            <View style={styles.completeStats}>
              <View style={styles.completeStat}>
                <Text style={styles.completeStatValue}>{getTodayXP()}</Text>
                <Text style={styles.completeStatLabel}>XP earned</Text>
              </View>
              <View style={styles.completeStatDivider} />
              <View style={styles.completeStat}>
                <Text style={styles.completeStatValue}>{currentStreak}</Text>
                <Text style={styles.completeStatLabel}>day streak</Text>
              </View>
            </View>
          </View>
        ) : (
          <Animated.View style={[styles.taskCard, { transform: [{ scale: scaleAnim }] }]}>
            {/* Task Number */}
            <Text style={styles.taskNumber}>
              TASK {completedCount + 1} OF {allTasks.length}
            </Text>

            {/* Task Icon */}
            <View style={styles.taskIconContainer}>
              <Icon
                name={currentTask?.icon || 'circle'}
                size={48}
                color={colors.accent.primary}
              />
            </View>

            {/* Task Info */}
            <Text style={styles.taskName}>{currentTask?.title}</Text>
            <Text style={styles.taskDescription}>{currentTask?.description}</Text>

            {/* XP Badge */}
            <View style={styles.xpBadge}>
              <Icon name="zap" size={14} color={colors.accent.primary} />
              <Text style={styles.xpBadgeText}>+{currentTask?.xp} XP</Text>
            </View>

            {/* Complete Button */}
            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleComplete}
              activeOpacity={0.8}
            >
              <Icon name="check" size={24} color={colors.text.inverse} strokeWidth={3} />
              <Text style={styles.completeButtonText}>Done</Text>
            </TouchableOpacity>

            {/* Skip Link */}
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>

            {/* Checkmark overlay animation */}
            <Animated.View
              style={[
                styles.checkOverlay,
                {
                  opacity: checkAnim,
                  transform: [{
                    scale: checkAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    }),
                  }],
                },
              ]}
              pointerEvents="none"
            >
              <Icon name="check" size={80} color={colors.accent.success} strokeWidth={3} />
            </Animated.View>
          </Animated.View>
        )}
      </View>

      {/* Progress Dots */}
      <View style={styles.dotsContainer}>
        {allTasks.slice(0, 13).map((task, index) => (
          <View
            key={task.id}
            style={[
              styles.dot,
              isTaskCompleted(task.id) && styles.dotComplete,
              currentTask?.id === task.id && styles.dotCurrent,
            ]}
          />
        ))}
      </View>

      {/* Celebration Overlay */}
      {showCelebration && (
        <Animated.View
          style={[
            styles.celebrationOverlay,
            { opacity: celebrationAnim },
          ]}
        >
          <Text style={styles.celebrationEmoji}>🎉</Text>
          <Text style={styles.celebrationTitle}>PERFECT DAY!</Text>
          <Text style={styles.celebrationSubtitle}>
            Your streak is now {currentStreak} days
          </Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  greeting: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: '300',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.text.tertiary,
    fontSize: 15,
    marginTop: 4,
  },
  streakContainer: {
    alignItems: 'center',
  },
  streakNumber: {
    color: colors.text.tertiary,
    fontSize: 20,
    fontWeight: '600',
    marginTop: 2,
  },
  streakActive: {
    color: colors.accent.warning,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    gap: spacing.xl,
  },
  progressRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    borderColor: colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${colors.accent.primary}08`,
  },
  progressRingInner: {
    alignItems: 'center',
  },
  progressPercent: {
    color: colors.text.primary,
    fontSize: 32,
    fontWeight: '600',
  },
  progressLabel: {
    color: colors.text.tertiary,
    fontSize: 12,
    marginTop: -2,
  },
  progressStats: {
    alignItems: 'flex-start',
    flex: 1,
  },
  progressText: {
    color: colors.text.secondary,
    fontSize: 18,
  },
  progressBold: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  xpText: {
    color: colors.accent.primary,
    fontSize: 16,
    fontWeight: '500',
    marginTop: 6,
  },
  cardSection: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  taskCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.subtle,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  taskNumber: {
    color: colors.text.tertiary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: spacing.lg,
  },
  taskIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${colors.accent.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  taskName: {
    color: colors.text.primary,
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  taskDescription: {
    color: colors.text.tertiary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.accent.primary}15`,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: 4,
    marginBottom: spacing.xl,
  },
  xpBadgeText: {
    color: colors.accent.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.full,
    gap: spacing.sm,
    width: '100%',
  },
  completeButtonText: {
    color: colors.text.inverse,
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  skipText: {
    color: colors.text.tertiary,
    fontSize: 14,
  },
  checkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${colors.background.card}90`,
    borderRadius: borderRadius.xl,
  },
  completeCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.accent.success,
    shadowColor: colors.accent.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  completeIconContainer: {
    marginBottom: spacing.lg,
  },
  completeTitle: {
    color: colors.accent.success,
    fontSize: 28,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  completeSubtitle: {
    color: colors.text.tertiary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  completeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    paddingTop: spacing.lg,
  },
  completeStat: {
    flex: 1,
    alignItems: 'center',
  },
  completeStatValue: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: '300',
  },
  completeStatLabel: {
    color: colors.text.tertiary,
    fontSize: 12,
    marginTop: 4,
  },
  completeStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border.subtle,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: spacing.xl,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.background.tertiary,
  },
  dotComplete: {
    backgroundColor: colors.accent.success,
  },
  dotCurrent: {
    backgroundColor: colors.accent.primary,
    width: 24,
  },
  celebrationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: `${colors.background.primary}F5`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrationEmoji: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  celebrationTitle: {
    color: colors.accent.success,
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: 2,
  },
  celebrationSubtitle: {
    color: colors.text.secondary,
    fontSize: 18,
    marginTop: spacing.md,
  },
});
