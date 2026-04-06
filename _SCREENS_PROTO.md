# _SCREENS_PROTO.md: ScoreFlow UI Prototype

## 1. Admin Dashboard (`/admin`)
- **Header**: Session Status (Active/Paused), Reset Button (Dangerous Action, Red).
- **Setup Panel**: 
    - Team Roster Management (Add/Remove, Real-time Rename).
    - Round Weight Config (Input fields per round, Power sync).
- **Gameplay Controller**:
    - Round Navigator (Current Round highlight, Previous/Next).
    - Multi-Winner Selector (Selectable cards for each team, Select All/None).
    - Points Award Button (Large Highlighted button, Awards Current Round points).
    - Bonus/Penalty Adjustment (+/- small buttons per team).

## 2. Viewer Scoreboard (`/viewer`)
- **Main Ranking Area**:
    - Large Score Cards with Animated Position Swapping.
    - 1st Place Glow / Border Animation.
    - Last Round Scorer Highlight (Who just got points?).
- **Footer/Side Info**:
    - Current Round / Total Rounds Progress Bar.
    - Round Points (Next Round Value).

## 3. Interaction Design
- **Score Update**: Number rolling animation.
- **Ranking Change**: Smooth transition of y-axis position of cards.
- **Empty State**: "Ready to Start!" message with setup guidance.
