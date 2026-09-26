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
| `owl-loop.mp4` | Mascot animation (5s seamless loop) | Generated with Magnific (Seedance 2.5) from `owl.png` on green, keyed with `scripts/make-alpha-video.mjs` | "Stacked alpha" video: colour on top, transparency mask below, 720×1440. See [Mascot video](#mascot-video) |
| `owl.png` | Mascot still: shown during the drop-in, while the video loads, and when video can't play or Reduce Motion is on | Owl from Figma, 697×724 | Must be the video's first frame, at the same size and position, so the swap is invisible |
| `cloud-1.png` | Back cloud layer | From Figma, 2048×1138 | Shown at 889×494pt |
| `cloud-2.png` | Front cloud layer | From Figma (same image) | Shown at 889×494pt |
| `cloud-3.png` | Far, faint cloud layer (adds depth) | Same image | Shown at 600×333pt, 45% opacity |
| `light-ray-wide.svg`, `light-ray-core.svg`, `light-glow.svg` | Light beams | From Figma | |
| `icon-lock.png` | Timeline, Today | From Figma | White icon on transparent |
| `icon-bell.png`, `icon-hourglass.png` | Timeline, Day 2 and Day 3 | From Figma, 24×24 | Used as alpha masks, so only the shape matters; color comes from code |
| `icon-bureaus.svg`, `icon-letters.svg`, `icon-support.svg` | Perk icons | From Figma, 16×16 | |

Drawn in code, not files: the sparkle stars on the Annual card (the 4-point star from the Figma
"spark" component, `components/Sparkles.tsx`) and the flowing gold of the "HOW YOUR FREE TRIAL
WORKS" heading (the `gold-mesh` gradient in `tailwind.config.ts`).

## Mascot video

The owl is `src/assets/owl-loop.mp4`, played by `components/AlphaVideo.tsx`. iPhones can't show
transparent video in a web view (only Apple's HEVC-with-alpha, which Chrome can't play), so the
file is a plain H.264 MP4 with the colour in the top half and the transparency mask in the bottom
half. A small WebGL canvas combines them into a transparent owl, using hardware video decoding on
every device.

To make a new loop:

1. Put the still owl on a pure green (#00FF00) square, centred at about 60% of the width.
2. Generate a 5s silent 1:1 video with that image as both the start and end frame, a locked
   static camera, and a prompt that keeps the background flat green.
3. Key it and encode it (needs ffmpeg: `brew install ffmpeg`):

   ```bash
   node scripts/make-alpha-video.mjs path/to/green-screen.mov src/assets/owl-loop.mp4
   ```

4. If the owl's framing changed, update the canvas size and position in `components/OwlMascot.tsx`
   so the video's first frame sits exactly over `owl.png`.

## Motion

Every animation runs on the GPU compositor, so it stays smooth on iOS even while JavaScript is busy:

- **Intro** (Framer Motion): the storyboard and its timings are in `STORY` in `src/paywall/motion.ts`.
  It only animates whole `transform`, `opacity` and `filter` values, which Framer hands to the browser.
  Avoid `x`/`y`/`scale` shorthands, `height` and similar, because those run in JavaScript on every frame.
- **Loops and one-offs** (clouds, rays, halo, timeline fill, shine, sparkles, gold): CSS
  animations defined under `keyframes` / `animation` in `tailwind.config.ts`.

With the system's Reduce Motion setting on, everything appears in place, nothing loops, and the
timeline shows its end state.
