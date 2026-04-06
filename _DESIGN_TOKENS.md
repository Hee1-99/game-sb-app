# _DESIGN_TOKENS.md: Midnight Energy Design System

## 1. Color Palette (Tailwind Config)
- **Background**: `bg-[#0B0E14]` (Deep Slate / Charcoal)
- **Surface**: `bg-[#161B22]` (Card/Layer Background)
- **Primary**: `text-rose-500`, `bg-rose-600` (Energy/Point Emphasis)
- **Secondary**: `text-violet-500`, `bg-violet-600` (Round/Info Emphasis)
- **Accent**: `text-amber-400` (1st Place Highlight)
- **Text**: 
    - Heading: `text-slate-50`
    - Body: `text-slate-400`

## 2. Typography
- **Headings**: `Outfit`, Sans-serif (Modern, Wide)
- **Body/System**: `Inter`, Sans-serif (Clean, Functional)
- **Numbers**: `JetBrains Mono` (Point/Ranking clarity)

## 3. Motion & Transitions (Framer Motion)
- **Ranking Swap**: `type: "spring", stiffness: 300, damping: 30` (Natural, Fast)
- **Score Increment**: `ease: "easeOut", duration: 0.5` (Pop effect)
- **Round Transition**: `x: [-20, 0], opacity: [0, 1]` (Slide in)

## 4. Components Style
- **Card**: Glassmorphism (Border opacity 10%, Blur 8px)
- **Buttons**: Subtle Glow on hover (Shadow-rose-500/20)
- **Inputs**: Bottom border only with focus transition.
