# Cresla

Animated paywall screen built from the Figma design
[Cresla Paywall Final](https://www.figma.com/design/E7N7ZtobRh5wfepPAKR7vh/Untitled?node-id=1-385).

React 19 + TypeScript + Vite · Tailwind CSS v4 · Framer Motion · Capacitor 8 (iOS)

## Run it

Requires Node 22.12 or newer, and Xcode for the Simulator.

### One command

```bash
./scripts/run.sh                 # install, build, sync, then build and launch in the iOS Simulator
./scripts/run.sh "iPhone 16"     # same, on a specific simulator
./scripts/run.sh web             # browser preview instead
```

Without a name it uses the simulator that's already open, or the newest iPhone Pro.
The first Simulator build takes a few minutes; later runs are much faster.

To pull the latest changes and run them:

```bash
cd ~/Cresla && git fetch origin && git checkout claude/charming-hawking-ilb5hy && git pull && ./scripts/run.sh
```

The sections below do the same steps by hand.

```bash
npm install
```

### In the browser

```bash
npm run dev
```

Open the printed URL, then switch to a 390×844 device in your browser's dev tools
(Chrome: ⌘⌥I → device toolbar → "iPhone 12 Pro"). The dev harness fakes an iPhone's
status bar and home indicator insets, because desktop browsers don't have them.

### In the iOS Simulator (macOS + Xcode)

```bash
npm run build        # build the web app into dist/
npx cap sync ios     # copy dist/ into the Xcode project and update native plugins
npx cap open ios     # open ios/App/App.xcodeproj in Xcode
```

In Xcode, pick an iPhone simulator in the toolbar and press **Run** (⌘R). The first
open takes a minute while Xcode downloads the Capacitor Swift packages. No signing
team is needed for the Simulator.

`npm run ios` runs all three commands in one go. Re-run `npm run build && npx cap sync ios`
after every web change, then Run again in Xcode.

Optional, for live reload on the Simulator while you edit:

```bash
npm run dev                                          # terminal 1
npx cap run ios -l --host localhost --port 5173      # terminal 2: choose a simulator; reloads on save
```

Run `npx cap sync ios` afterwards so the Xcode project points back at the bundled build.

## Project layout

```
src/
  App.tsx                 Dev harness: renders <Paywall> and logs its callbacks
  assets/                 All images (swap files here; see below)
  paywall/                Self-contained paywall, ready to copy into another app
    Paywall.tsx           The screen and its props
    plans.ts              Plan labels, prices and CTA copy
    motion.ts             Intro timings and easing curves
    ui.ts                 44pt tap-area and focus-ring helpers
    components/
      PlanCard.tsx        Selectable plan (native radio), sliding ring, sparkles
      TrialTimeline.tsx   "How your free trial works" with the progress fill
      PerkItem.tsx        Icon + label perk, and the divider between perks
      PrimaryButton.tsx   CTA with shine sweep and press scale
      OwlMascot.tsx       Mascot image with drop-in and float
      SkyBackground.tsx   Sky gradient and drifting clouds
      LightRays.tsx       Pulsing light beams
      GlossBadge.tsx, Radio.tsx, Sparkles.tsx
tailwind.config.ts        Design tokens (colors, type, spacing, radii, shadows)
capacitor.config.ts       App id/name, status bar style
ios/                      Native Xcode project (managed by Capacitor)
```

## Using the paywall in another app

```tsx
import { Paywall } from './paywall'

<Paywall
  onSubscribe={(plan) => purchase(plan.id)} // 'monthly' | 'annual'; plan also has label and prices
  onSignIn={openSignIn}
  onRestore={restorePurchases}
  onOpenTerms={() => openUrl(TERMS_URL)}
  onOpenPrivacy={() => openUrl(PRIVACY_URL)}
  defaultPlan="annual" // optional
/>
```

Copy `src/paywall/`, `src/assets/` and the `theme.extend` tokens from `tailwind.config.ts`.
The host app needs Tailwind v4, `framer-motion`, the Inter font (`@fontsource/inter` 400 and 500)
and `viewport-fit=cover` in its viewport meta tag.

Safe areas come from `env(safe-area-inset-*)`. To override them, set
`--paywall-safe-top` / `--paywall-safe-bottom` on a parent element.

## Swapping assets

Replace a file in `src/assets/` with one of the same name. Nothing else needs to change.

| File | Used for | Current file | Notes |
|---|---|---|---|
| `owl.png` | Mascot | Draft owl from Figma, 697×724 | **Swap for the final owl.** Transparent PNG at about a 154:160 aspect ratio; it's shown at 154×160pt. The drop-in and float animations are already applied. |
| `cloud-1.png` | Back cloud layer | From Figma, 2048×1138 | Shown at 889×494pt |
| `cloud-2.png` | Front cloud layer | From Figma (same image) | Shown at 889×494pt |
| `light-ray-wide.svg`, `light-ray-core.svg`, `light-glow.svg` | Light beams | From Figma | |
| `gold-foil.jpg` | Fill of the "HOW YOUR FREE TRIAL WORKS" heading | From Figma | |
| `icon-lock.png` | Timeline, Today | From Figma | White icon on transparent |
| `icon-bell.png`, `icon-hourglass.png` | Timeline, Day 2 and Day 3 | From Figma, 24×24 | Used as alpha masks, so only the shape matters; color comes from code |
| `icon-bureaus.svg`, `icon-letters.svg`, `icon-support.svg` | Perk icons | From Figma, 16×16 | |

The sparkle stars on the Annual card use the 4-point star from the Figma "spark" component
and are drawn in code (`components/Sparkles.tsx`) so they take the brand color.

## Motion

All timings live in `src/paywall/motion.ts`. With the system's Reduce Motion setting on,
entrances become plain fades, nothing loops, and the timeline shows its end state.
