# DailyStack

<p align="center">
  <img src="readme_image/DailyStack_Screenshots.jpg" alt="DailyStack Screenshots" width="100%" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white" alt="Zustand" />
  <img src="https://img.shields.io/badge/Made_with_Claude_Code-CC5500?style=for-the-badge&logo=anthropic&logoColor=white" alt="Made with Claude Code" />
</p>

---

A gamified daily habit tracker inspired by the Blueprint protocol. Build streaks, earn XP, and track your biological age through consistent healthy habits.

## Features

- **Daily Protocol** - 13 science-backed tasks covering morning routines, nutrition, exercise, and sleep
- **XP and Leveling** - Earn experience points for completed tasks and level up over time
- **Streak Tracking** - Maintain daily streaks with optional streak freeze protection
- **Bio-Age Calculator** - Estimate your biological age based on lifestyle factors and protocol adherence
- **Budget Tracker** - Compare supplement and meal costs across budget tiers
- **Healthcare ROI** - Visualize potential long-term health savings from preventive habits

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on web
npx expo start --web
```

## Project Structure

```
├── app/                 # Expo Router screens
│   └── (tabs)/          # Tab navigation screens
├── components/          # Reusable UI components
├── data/                # Static data and calculations
├── lib/                 # Theme and utilities
└── stores/              # Zustand state management
```

## License

MIT
