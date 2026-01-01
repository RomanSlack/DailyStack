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
import { Icon, IconName } from '../../components/Icon';
import { useUserStore } from '../../stores/userStore';
import {
  SUPPLEMENTS,
  calculateAllTierTotals,
  FULL_STACK_IDS,
  TIER_INFO,
  TierType,
} from '../../data/supplements';
import { MEAL_COST_SUMMARY, BLUEPRINT_MEALS } from '../../data/meals';
import {
  calculateROI,
  calculateHealthcareSavings,
  RISK_REDUCTIONS,
  LONGEVITY_FACTS,
} from '../../data/healthcareROI';
import { colors, spacing, borderRadius } from '../../lib/theme';

type SelectedTier = TierType;

export default function BudgetScreen() {
  const { hasBudgetAccess, unlockBudget } = useUserStore();
  const [selectedTier, setSelectedTier] = React.useState<SelectedTier>('budget');
  const [expandedSection, setExpandedSection] = React.useState<string | null>('overview');

  const handleUnlock = () => {
    Alert.alert(
      'Unlock Budget Tracker',
      'Get lifetime access to:\n\n• Supplement cost calculator\n• Budget meal alternatives\n• Healthcare ROI projections\n• Affiliate savings links\n\nOne-time purchase: $2.99',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unlock — $2.99',
          onPress: () => {
            unlockBudget();
            Alert.alert('Unlocked!', 'You now have full access to the Budget Tracker.');
          },
        },
      ]
    );
  };

  // Show paywall if not unlocked
  if (!hasBudgetAccess) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.paywallScroll}>
          <View style={styles.paywallContainer}>
            <View style={styles.paywallIcon}>
              <Icon name="piggy-bank" size={56} color={colors.accent.success} />
            </View>
            <Text style={styles.paywallTitle}>Budget Tracker</Text>
            <Text style={styles.paywallSubtitle}>
              The Blueprint costs $2,000+/month.{'\n'}We'll show you how to do it for under $200.
            </Text>

            {/* Savings Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>$361</Text>
                <Text style={styles.statDesc}>Bryan's monthly supplement cost</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statNumber, { color: colors.accent.success }]}>$89</Text>
                <Text style={styles.statDesc}>Budget alternatives (same benefits)</Text>
              </View>
            </View>

            <View style={styles.paywallSavings}>
              <Text style={styles.savingsAmount}>Save $3,264/year</Text>
              <Text style={styles.savingsNote}>on supplements alone</Text>
            </View>

            {/* Features */}
            <View style={styles.paywallFeatures}>
              <View style={styles.paywallFeature}>
                <Icon name="check" size={18} color={colors.accent.success} />
                <Text style={styles.paywallFeatureText}>3-tier supplement comparison</Text>
              </View>
              <View style={styles.paywallFeature}>
                <Icon name="check" size={18} color={colors.accent.success} />
                <Text style={styles.paywallFeatureText}>Budget meal swaps ($15 vs $50/day)</Text>
              </View>
              <View style={styles.paywallFeature}>
                <Icon name="check" size={18} color={colors.accent.success} />
                <Text style={styles.paywallFeatureText}>Healthcare ROI projections</Text>
              </View>
              <View style={styles.paywallFeature}>
                <Icon name="check" size={18} color={colors.accent.success} />
                <Text style={styles.paywallFeatureText}>Direct links to buy</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.unlockButton} onPress={handleUnlock}>
              <Text style={styles.unlockButtonText}>Unlock for $2.99</Text>
            </TouchableOpacity>
            <Text style={styles.unlockNote}>One-time purchase • Lifetime access</Text>
            <Text style={styles.roiText}>That's 1,092x ROI on your $2.99</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const supplementTotals = calculateAllTierTotals(FULL_STACK_IDS);

  const totalMonthlyCost = {
    bryansChoice: supplementTotals.bryansChoice + MEAL_COST_SUMMARY.bryansMonthly,
    budget: supplementTotals.budget + MEAL_COST_SUMMARY.budgetMonthly,
    ultraBudget: supplementTotals.ultraBudget + MEAL_COST_SUMMARY.budgetMonthly,
  };

  const savings = totalMonthlyCost.bryansChoice - totalMonthlyCost[selectedTier];
  const savingsPercent = Math.round((savings / totalMonthlyCost.bryansChoice) * 100);

  // Healthcare ROI calculations
  const annualProtocolCost = totalMonthlyCost[selectedTier] * 12;
  const roi = calculateROI(annualProtocolCost, 35);
  const healthSavings = calculateHealthcareSavings(35);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Budget</Text>
          <Text style={styles.subtitle}>Blueprint on your terms</Text>
        </View>

        {/* Tier Selector */}
        <View style={styles.tierSelector}>
          {(Object.keys(TIER_INFO) as TierType[]).map((tier) => (
            <TouchableOpacity
              key={tier}
              style={[
                styles.tierButton,
                selectedTier === tier && styles.tierButtonActive,
                selectedTier === tier && { borderColor: TIER_INFO[tier].color },
              ]}
              onPress={() => setSelectedTier(tier)}
            >
              <Text
                style={[
                  styles.tierButtonText,
                  selectedTier === tier && { color: TIER_INFO[tier].color },
                ]}
              >
                {TIER_INFO[tier].label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Cost Overview Card */}
        <View style={styles.costCard}>
          <View style={styles.costHeader}>
            <Text style={styles.costLabel}>YOUR MONTHLY COST</Text>
            <View style={[styles.savingsBadge, { backgroundColor: `${colors.accent.success}20` }]}>
              <Icon name="trending-up" size={12} color={colors.accent.success} />
              <Text style={styles.savingsText}>Save {savingsPercent}%</Text>
            </View>
          </View>

          <View style={styles.costRow}>
            <Text style={styles.costAmount}>
              ${Math.round(totalMonthlyCost[selectedTier])}
            </Text>
            <Text style={styles.costCompare}>
              vs ${Math.round(totalMonthlyCost.bryansChoice)} Bryan's way
            </Text>
          </View>

          <View style={styles.costBreakdown}>
            <View style={styles.breakdownItem}>
              <Icon name="pill" size={16} color={colors.text.tertiary} />
              <Text style={styles.breakdownLabel}>Supplements</Text>
              <Text style={styles.breakdownValue}>
                ${Math.round(supplementTotals[selectedTier])}/mo
              </Text>
            </View>
            <View style={styles.breakdownItem}>
              <Icon name="salad" size={16} color={colors.text.tertiary} />
              <Text style={styles.breakdownLabel}>Meals</Text>
              <Text style={styles.breakdownValue}>
                ${Math.round(selectedTier === 'bryansChoice' ? MEAL_COST_SUMMARY.bryansMonthly : MEAL_COST_SUMMARY.budgetMonthly)}/mo
              </Text>
            </View>
          </View>

          <View style={styles.savingsHighlight}>
            <Icon name="piggy-bank" size={20} color={colors.accent.success} />
            <Text style={styles.savingsHighlightText}>
              You save ${Math.round(savings)}/month (${Math.round(savings * 12)}/year)
            </Text>
          </View>
        </View>

        {/* Supplements Section */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('supplements')}
        >
          <View style={styles.sectionLeft}>
            <Icon name="pill" size={20} color={colors.accent.primary} />
            <Text style={styles.sectionTitle}>Supplements</Text>
          </View>
          <View style={styles.sectionRight}>
            <Text style={styles.sectionCount}>{SUPPLEMENTS.length} items</Text>
            <Icon
              name={expandedSection === 'supplements' ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.text.tertiary}
            />
          </View>
        </TouchableOpacity>

        {expandedSection === 'supplements' && (
          <View style={styles.sectionContent}>
            {SUPPLEMENTS.map((supplement) => (
              <TouchableOpacity
                key={supplement.id}
                style={styles.itemCard}
                onPress={() => {
                  const link = supplement[selectedTier].link;
                  if (link) Linking.openURL(link);
                }}
              >
                <View style={styles.itemLeft}>
                  <View style={styles.itemIcon}>
                    <Icon name={supplement.icon} size={18} color={colors.accent.primary} />
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{supplement.name}</Text>
                    <Text style={styles.itemBrand}>{supplement[selectedTier].brand}</Text>
                  </View>
                </View>
                <View style={styles.itemRight}>
                  <Text style={styles.itemPrice}>${supplement[selectedTier].price}</Text>
                  <Text style={styles.itemPriceLabel}>/mo</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Meals Section */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('meals')}
        >
          <View style={styles.sectionLeft}>
            <Icon name="salad" size={20} color={colors.accent.primary} />
            <Text style={styles.sectionTitle}>Meals</Text>
          </View>
          <View style={styles.sectionRight}>
            <Text style={styles.sectionCount}>{BLUEPRINT_MEALS.length} recipes</Text>
            <Icon
              name={expandedSection === 'meals' ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.text.tertiary}
            />
          </View>
        </TouchableOpacity>

        {expandedSection === 'meals' && (
          <View style={styles.sectionContent}>
            {BLUEPRINT_MEALS.map((meal) => (
              <View key={meal.id} style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <View style={styles.itemIcon}>
                    <Icon name={meal.icon} size={18} color={colors.accent.primary} />
                  </View>
                  <View style={styles.mealInfo}>
                    <Text style={styles.itemName}>{meal.name}</Text>
                    <Text style={styles.mealMeta}>
                      {meal.calories} cal • {meal.protein}g protein • {meal.prepTime} min
                    </Text>
                  </View>
                </View>

                <View style={styles.mealPricing}>
                  <View style={styles.mealPriceRow}>
                    <Text style={styles.mealPriceLabel}>Bryan's way:</Text>
                    <Text style={styles.mealPriceOld}>
                      ${meal.bryansVersion.costPerServing.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.mealPriceRow}>
                    <Text style={styles.mealPriceLabel}>Budget way:</Text>
                    <Text style={styles.mealPriceNew}>
                      ${meal.budgetVersion.costPerServing.toFixed(2)}
                    </Text>
                  </View>
                </View>

                {selectedTier !== 'bryansChoice' && (
                  <View style={styles.swapsList}>
                    <Text style={styles.swapsTitle}>Smart swaps:</Text>
                    {meal.budgetVersion.swaps.slice(0, 2).map((swap, index) => (
                      <Text key={index} style={styles.swapItem}>• {swap}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Healthcare ROI Section */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('healthcare')}
        >
          <View style={styles.sectionLeft}>
            <Icon name="heart" size={20} color={colors.accent.error} />
            <Text style={styles.sectionTitle}>Healthcare ROI</Text>
          </View>
          <View style={styles.sectionRight}>
            <Text style={styles.sectionCount}>{roi.roi > 0 ? `+${roi.roi}%` : `${roi.roi}%`} ROI</Text>
            <Icon
              name={expandedSection === 'healthcare' ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.text.tertiary}
            />
          </View>
        </TouchableOpacity>

        {expandedSection === 'healthcare' && (
          <View style={styles.sectionContent}>
            {/* ROI Summary Card */}
            <View style={styles.roiCard}>
              <View style={styles.roiHeader}>
                <Text style={styles.roiLabel}>POTENTIAL RETURN ON INVESTMENT</Text>
              </View>
              <View style={styles.roiMainStat}>
                <Text style={styles.roiPercent}>{roi.roi > 0 ? '+' : ''}{roi.roi}%</Text>
                <Text style={styles.roiSubtext}>estimated healthcare ROI</Text>
              </View>
              <View style={styles.roiGrid}>
                <View style={styles.roiGridItem}>
                  <Text style={styles.roiGridValue}>${healthSavings.annual.toLocaleString()}</Text>
                  <Text style={styles.roiGridLabel}>Est. Annual Savings</Text>
                </View>
                <View style={styles.roiGridItem}>
                  <Text style={styles.roiGridValue}>${healthSavings.tenYear.toLocaleString()}</Text>
                  <Text style={styles.roiGridLabel}>10-Year Savings</Text>
                </View>
              </View>
              <View style={styles.roiNote}>
                <Icon name="info" size={14} color={colors.text.tertiary} />
                <Text style={styles.roiNoteText}>
                  Based on reduced risk of chronic conditions from lifestyle interventions
                </Text>
              </View>
            </View>

            {/* Risk Reductions */}
            <Text style={styles.subsectionTitle}>POTENTIAL RISK REDUCTION</Text>
            {RISK_REDUCTIONS.map((risk) => (
              <View key={risk.condition} style={styles.riskCard}>
                <View style={styles.riskHeader}>
                  <View style={styles.riskIconContainer}>
                    <Icon name={risk.icon} size={18} color={colors.accent.primary} />
                  </View>
                  <View style={styles.riskInfo}>
                    <Text style={styles.riskCondition}>{risk.condition}</Text>
                    <Text style={styles.riskCost}>
                      Avg. cost if developed: ${risk.annualCostIfDeveloped.toLocaleString()}/yr
                    </Text>
                  </View>
                </View>
                <View style={styles.riskBarContainer}>
                  <View style={styles.riskBarBg}>
                    <View
                      style={[
                        styles.riskBarFill,
                        { width: `${100 - risk.reductionWithProtocol}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.riskReduction}>-{risk.reductionWithProtocol}% risk</Text>
                </View>
              </View>
            ))}

            {/* Longevity Facts */}
            <Text style={styles.subsectionTitle}>WHY THIS MATTERS</Text>
            <View style={styles.factsGrid}>
              {LONGEVITY_FACTS.slice(0, 4).map((fact, index) => (
                <View key={index} style={styles.factCard}>
                  <Icon name={fact.icon} size={20} color={colors.accent.primary} />
                  <Text style={styles.factStat}>{fact.stat}</Text>
                  <Text style={styles.factLabel}>{fact.label}</Text>
                  <Text style={styles.factSource}>{fact.source}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>${Math.round(totalMonthlyCost[selectedTier] / 30)}</Text>
            <Text style={styles.statLabel}>PER DAY</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.accent.success }]}>
              ${Math.round(healthSavings.lifetime / 1000)}K
            </Text>
            <Text style={styles.statLabel}>LIFETIME SAVINGS</Text>
          </View>
        </View>

        {/* Value Proposition Card */}
        <View style={styles.valueCard}>
          <View style={styles.valueHeader}>
            <Icon name="trending-up" size={24} color={colors.accent.success} />
            <Text style={styles.valueTitle}>Your Health Investment</Text>
          </View>
          <Text style={styles.valueText}>
            For ${Math.round(totalMonthlyCost[selectedTier])}/month, you're potentially avoiding
            ${Math.round(healthSavings.annual).toLocaleString()}/year in future healthcare costs.
            That's a {roi.roi > 0 ? roi.roi : 0}% return on your investment.
          </Text>
          <View style={styles.valueStats}>
            <View style={styles.valueStat}>
              <Text style={styles.valueStatValue}>{roi.breakEvenMonths}</Text>
              <Text style={styles.valueStatLabel}>months to break even</Text>
            </View>
            <View style={styles.valueStatDivider} />
            <View style={styles.valueStat}>
              <Text style={styles.valueStatValue}>{healthSavings.preventedConditions}+</Text>
              <Text style={styles.valueStatLabel}>conditions prevented</Text>
            </View>
          </View>
        </View>

        {/* CTA */}
        <View style={styles.ctaCard}>
          <Icon name="info" size={20} color={colors.accent.primary} />
          <Text style={styles.ctaText}>
            All links support the app through affiliate commissions at no extra cost to you.
          </Text>
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
  subtitle: {
    color: colors.text.tertiary,
    fontSize: 14,
    marginTop: 4,
  },
  tierSelector: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  tierButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    alignItems: 'center',
  },
  tierButtonActive: {
    backgroundColor: colors.background.card,
  },
  tierButtonText: {
    color: colors.text.tertiary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  costCard: {
    backgroundColor: colors.background.card,
    marginHorizontal: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    marginBottom: spacing.md,
  },
  costHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  costLabel: {
    color: colors.text.tertiary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  savingsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  savingsText: {
    color: colors.accent.success,
    fontSize: 12,
    fontWeight: '600',
  },
  costRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  costAmount: {
    color: colors.text.primary,
    fontSize: 48,
    fontWeight: '200',
    letterSpacing: -2,
  },
  costCompare: {
    color: colors.text.tertiary,
    fontSize: 13,
  },
  costBreakdown: {
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  breakdownLabel: {
    color: colors.text.secondary,
    fontSize: 14,
    flex: 1,
  },
  breakdownValue: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  savingsHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
  },
  savingsHighlightText: {
    color: colors.accent.success,
    fontSize: 14,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.secondary,
    marginTop: spacing.sm,
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  sectionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionCount: {
    color: colors.text.tertiary,
    fontSize: 13,
  },
  sectionContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  itemCard: {
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
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  itemBrand: {
    color: colors.text.tertiary,
    fontSize: 12,
    marginTop: 2,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    color: colors.accent.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  itemPriceLabel: {
    color: colors.text.tertiary,
    fontSize: 10,
  },
  mealCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  mealInfo: {
    flex: 1,
  },
  mealMeta: {
    color: colors.text.tertiary,
    fontSize: 12,
    marginTop: 2,
  },
  mealPricing: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  mealPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  mealPriceLabel: {
    color: colors.text.tertiary,
    fontSize: 12,
  },
  mealPriceOld: {
    color: colors.text.tertiary,
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  mealPriceNew: {
    color: colors.accent.success,
    fontSize: 12,
    fontWeight: '600',
  },
  swapsList: {
    marginTop: spacing.sm,
  },
  swapsTitle: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  swapItem: {
    color: colors.text.tertiary,
    fontSize: 11,
    marginLeft: spacing.sm,
    lineHeight: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  statValue: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: '200',
  },
  statLabel: {
    color: colors.text.tertiary,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: spacing.xs,
  },
  ctaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background.card,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  ctaText: {
    color: colors.text.tertiary,
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
  // Healthcare ROI Styles
  roiCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.accent.success,
  },
  roiHeader: {
    marginBottom: spacing.md,
  },
  roiLabel: {
    color: colors.text.tertiary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  roiMainStat: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  roiPercent: {
    color: colors.accent.success,
    fontSize: 56,
    fontWeight: '200',
    letterSpacing: -2,
  },
  roiSubtext: {
    color: colors.text.tertiary,
    fontSize: 14,
    marginTop: -4,
  },
  roiGrid: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    paddingTop: spacing.md,
  },
  roiGridItem: {
    flex: 1,
    alignItems: 'center',
  },
  roiGridValue: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: '300',
  },
  roiGridLabel: {
    color: colors.text.tertiary,
    fontSize: 11,
    marginTop: 4,
  },
  roiNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
  },
  roiNoteText: {
    color: colors.text.tertiary,
    fontSize: 11,
    flex: 1,
    lineHeight: 16,
  },
  subsectionTitle: {
    color: colors.text.tertiary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  riskCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  riskIconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  riskInfo: {
    flex: 1,
  },
  riskCondition: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  riskCost: {
    color: colors.text.tertiary,
    fontSize: 11,
    marginTop: 2,
  },
  riskBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  riskBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: colors.accent.success,
    borderRadius: 4,
    overflow: 'hidden',
  },
  riskBarFill: {
    height: '100%',
    backgroundColor: colors.background.tertiary,
    borderRadius: 4,
  },
  riskReduction: {
    color: colors.accent.success,
    fontSize: 12,
    fontWeight: '600',
    width: 70,
    textAlign: 'right',
  },
  factsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  factCard: {
    width: '48%',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    margin: spacing.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  factStat: {
    color: colors.text.primary,
    fontSize: 24,
    fontWeight: '300',
    marginTop: spacing.sm,
  },
  factLabel: {
    color: colors.text.tertiary,
    fontSize: 11,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 14,
  },
  factSource: {
    color: colors.accent.primary,
    fontSize: 9,
    marginTop: spacing.xs,
    opacity: 0.7,
  },
  valueCard: {
    backgroundColor: colors.background.card,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.accent.success,
  },
  valueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  valueTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  valueText: {
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 20,
  },
  valueStats: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
  },
  valueStat: {
    flex: 1,
    alignItems: 'center',
  },
  valueStatValue: {
    color: colors.accent.success,
    fontSize: 24,
    fontWeight: '300',
  },
  valueStatLabel: {
    color: colors.text.tertiary,
    fontSize: 11,
    marginTop: 4,
  },
  valueStatDivider: {
    width: 1,
    backgroundColor: colors.border.subtle,
  },
  bottomPadding: {
    height: 100,
  },
  // Paywall styles
  paywallScroll: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  paywallContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  paywallIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${colors.accent.success}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  paywallTitle: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  paywallSubtitle: {
    color: colors.text.secondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
    width: '100%',
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  statNumber: {
    color: colors.text.primary,
    fontSize: 32,
    fontWeight: '600',
  },
  statDesc: {
    color: colors.text.tertiary,
    fontSize: 11,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  paywallSavings: {
    alignItems: 'center',
    backgroundColor: `${colors.accent.success}15`,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    width: '100%',
    marginBottom: spacing.md,
  },
  savingsAmount: {
    color: colors.accent.success,
    fontSize: 24,
    fontWeight: '700',
  },
  savingsNote: {
    color: colors.text.tertiary,
    fontSize: 13,
    marginTop: 2,
  },
  paywallFeatures: {
    width: '100%',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  paywallFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  paywallFeatureText: {
    color: colors.text.primary,
    fontSize: 16,
  },
  unlockButton: {
    backgroundColor: colors.accent.success,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.full,
    width: '100%',
    alignItems: 'center',
  },
  unlockButtonText: {
    color: colors.text.inverse,
    fontSize: 18,
    fontWeight: '600',
  },
  unlockNote: {
    color: colors.text.tertiary,
    fontSize: 13,
    marginTop: spacing.md,
  },
  roiText: {
    color: colors.accent.success,
    fontSize: 12,
    fontWeight: '500',
    marginTop: spacing.sm,
  },
});
