# Blueprint Quest - Differentiated Product Plan

## Core Concept
A gamified longevity protocol tracker that combines **budget-friendly alternatives**, **biological age scoring**, and **social challenges** to stand out in a crowded market.

---

## Three Pillars of Differentiation

### Pillar 1: Blueprint on a Budget
**Target User:** Curious about longevity but can't afford $2k+/month

**Features:**
- [ ] Budget tier for each supplement (Good/Better/Best with prices)
- [ ] "Cost per day" calculator showing affordable alternatives
- [ ] Meal prep guides with grocery costs
- [ ] DIY alternatives (e.g., olive oil instead of expensive brands)
- [ ] Price comparison tool for supplements
- [ ] Monthly cost tracker ("You're doing Blueprint for $X/month")
- [ ] Affiliate links to budget alternatives (revenue stream)

**Data Model:**
```typescript
interface SupplementTier {
  id: string;
  name: string; // e.g., "NMN"
  bryansChoice: { brand: string; price: number; link: string };
  budgetAlt: { brand: string; price: number; link: string };
  ultraBudget: { brand: string; price: number; link: string };
  dailyCost: { premium: number; budget: number; ultraBudget: number };
}
```

**Screens:**
- `/budget` - Cost breakdown by category
- `/supplements` - Tier comparison with buy links
- `/meal-prep` - Weekly meal plans with shopping lists

---

### Pillar 2: Biological Age Gamification
**Target User:** Data-driven biohackers who want to see results

**Core Mechanic:** XP represents estimated biological age reduction
- Not just "points" but meaningful health metric
- "You've earned 1,250 XP = estimated 0.3 years younger"

**Features:**
- [ ] Bio-Age Score (calculated from habits + wearable data)
- [ ] Chronological vs Biological age display
- [ ] "Years Saved" lifetime counter
- [ ] Wearable integrations:
  - [ ] Apple Health (sleep, HRV, steps, resting HR)
  - [ ] Oura Ring
  - [ ] Whoop
  - [ ] Fitbit
- [ ] Auto-complete tasks from wearable data
- [ ] Weekly bio-age trend chart
- [ ] Biomarker logging (optional manual entry)
- [ ] Photo tracking for visible aging (skin, body)

**Bio-Age Algorithm (Simplified):**
```typescript
interface BioAgeFactors {
  // Positive factors (reduce bio-age)
  sleepScore: number;        // 0-100 from wearable
  hrvScore: number;          // 0-100 normalized
  exerciseMinutes: number;   // weekly
  fastingHours: number;      // average daily
  supplementAdherence: number; // 0-100%

  // Negative factors (increase bio-age)
  missedSleepDays: number;
  alcoholDays: number;
  processedFoodDays: number;
}

function calculateBioAge(chronologicalAge: number, factors: BioAgeFactors): number {
  // Each factor contributes to bio-age offset
  // Perfect adherence = up to 10 years younger
  // Poor adherence = chronological age or older
}
```

**Screens:**
- `/bio-age` - Main bio-age dashboard with trend
- `/connect` - Wearable connection screen
- `/photos` - Progress photo timeline
- `/biomarkers` - Manual biomarker entry (blood tests)

---

### Pillar 3: Social Blueprint Challenges
**Target User:** People who need accountability and competition

**Features:**
- [ ] Weekly Challenges (rotating themes)
  - "7-Day Sleep Challenge" - Sleep by 9pm every night
  - "Supplement Streak" - Don't miss a day
  - "Step Master" - 10k steps daily
  - "Fast & Furious" - Complete 19hr fast 5 days
- [ ] Challenge Leaderboards (opt-in)
- [ ] Blueprint Clubs (create/join groups)
- [ ] Accountability Partners (1:1 matching)
- [ ] Kudos system (like Strava)
- [ ] Achievement sharing to social media
- [ ] Team challenges (club vs club)
- [ ] Friend streaks (both maintain streak = bonus XP)

**Data Model:**
```typescript
interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: number; // days
  taskIds: string[]; // which tasks count
  requirement: 'all' | 'percentage' | 'streak';
  threshold: number; // e.g., 80% completion
  xpReward: number;
  badgeId?: string;
}

interface Club {
  id: string;
  name: string;
  description: string;
  memberIds: string[];
  adminIds: string[];
  weeklyXP: number;
  rank: number;
  isPublic: boolean;
}

interface AccountabilityPair {
  id: string;
  userIds: [string, string];
  sharedStreak: number;
  startedAt: string;
}
```

**Screens:**
- `/challenges` - Active & upcoming challenges
- `/clubs` - Browse/create clubs
- `/club/[id]` - Club detail with leaderboard
- `/friends` - Friend list, accountability partners
- `/social` - Activity feed with kudos

---

## Updated App Structure

```
/app
├── (tabs)/
│   ├── index.tsx          # Today's tasks (existing)
│   ├── progress.tsx       # Stats & streaks (existing)
│   ├── bio-age.tsx        # NEW: Bio-age dashboard
│   ├── social.tsx         # NEW: Challenges & clubs
│   └── profile.tsx        # Profile & settings (existing)
├── budget/
│   ├── index.tsx          # Cost overview
│   ├── supplements.tsx    # Supplement tiers
│   └── meals.tsx          # Meal prep guides
├── challenges/
│   ├── index.tsx          # Challenge list
│   └── [id].tsx           # Challenge detail
├── clubs/
│   ├── index.tsx          # Club browser
│   ├── create.tsx         # Create club
│   └── [id].tsx           # Club detail
├── connect/
│   └── index.tsx          # Wearable connections
└── onboarding/
    ├── index.tsx          # Welcome
    ├── goals.tsx          # What matters to you
    ├── budget.tsx         # What's your budget
    └── wearables.tsx      # Connect devices
```

---

## New Data Files Needed

```
/data
├── blueprintProtocol.ts   # (existing) Tasks
├── supplements.ts         # NEW: Supplement tiers & prices
├── challenges.ts          # NEW: Challenge definitions
├── bioAgeAlgorithm.ts     # NEW: Bio-age calculation
└── budgetAlternatives.ts  # NEW: Budget meal/supplement swaps
```

---

## Backend Requirements (Supabase)

### Tables:
```sql
-- Users (extends local store)
users (id, email, display_name, avatar_url, created_at)

-- Social
clubs (id, name, description, is_public, created_at)
club_members (club_id, user_id, role, joined_at)
friendships (user_id, friend_id, status, created_at)
accountability_pairs (id, user1_id, user2_id, shared_streak, created_at)

-- Challenges
challenges (id, title, description, start_date, end_date, config)
challenge_participants (challenge_id, user_id, progress, completed_at)

-- Activity Feed
activities (id, user_id, type, data, created_at)
kudos (activity_id, user_id, created_at)

-- Bio-Age
biomarker_logs (id, user_id, type, value, logged_at)
wearable_connections (user_id, provider, access_token, refresh_token)
```

---

## Monetization (Updated)

### Free Tier:
- Basic task tracking
- 7-day streak history
- View budget alternatives (no affiliate clicks)
- Join 1 club
- 1 active challenge at a time

### Unlimited ($10 one-time):
- Unlimited history
- Streak freezes (99 included)
- Bio-age tracking with wearables
- Create clubs
- Unlimited challenges
- Affiliate links enabled
- Photo progress tracking
- Export data

### Consumables:
- Streak Freeze: $0.99
- Challenge Boost (2x XP): $1.99
- Custom Club Badge: $2.99

### Affiliate Revenue:
- Amazon Associates for supplements (~4% commission)
- iHerb affiliate program (~5-10%)
- Direct brand partnerships (negotiate)
- Estimated: $5-15 per converting user

---

## Implementation Phases

### Phase 1: Core App (DONE)
- [x] Basic task tracking
- [x] XP & levels
- [x] Streak system
- [x] Clean UI with Lucide icons
- [x] Local persistence

### Phase 2: Budget Blueprint ✅ COMPLETE
- [x] Supplement data with tiers (12 supplements, 3 tiers each)
- [x] Budget screen with cost calculator
- [x] Meal prep section (3 Blueprint meals)
- [x] Affiliate link integration
- [x] "Your monthly cost" widget on home screen
- [x] Healthcare ROI calculations
- [x] Risk reduction visualizations (5 conditions)
- [x] Longevity facts with sources (CDC, DPP, Fidelity, etc.)
- [x] Value proposition card with ROI %

### Phase 3: Bio-Age System
- [ ] Bio-age algorithm
- [ ] Apple Health integration (expo-health)
- [ ] Bio-age dashboard screen
- [ ] "Years saved" counter replacing raw XP
- [ ] Weekly trend charts
- [ ] Photo progress feature

### Phase 4: Social & Challenges
- [ ] Supabase backend setup
- [ ] Authentication (email + Apple/Google)
- [ ] Challenge system
- [ ] Clubs
- [ ] Activity feed
- [ ] Kudos
- [ ] Accountability partners

### Phase 5: Polish & Launch
- [ ] Onboarding flow
- [ ] Push notifications
- [ ] App Store assets
- [ ] Landing page
- [ ] Beta testing

---

## Success Metrics

| Metric | Target |
|--------|--------|
| D1 Retention | >60% |
| D7 Retention | >40% |
| D30 Retention | >25% |
| Conversion to Unlimited | 5-8% |
| Avg. Streak Length | 14+ days |
| Club Participation | 30% of users |
| Affiliate Revenue/User | $2-5 |

---

## Competitive Moat

1. **Budget focus** - No one else is making Blueprint accessible
2. **Bio-age gamification** - Meaningful XP, not arbitrary points
3. **Social layer** - Strava-style accountability for longevity
4. **All three combined** - No competitor has this intersection

---

## Next Steps (Immediate)

1. Create supplement tier data
2. Build budget calculator screen
3. Implement Apple Health connection
4. Design bio-age dashboard
5. Set up Supabase for social features
