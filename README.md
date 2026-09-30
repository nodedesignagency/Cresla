# Cresla

Animated iOS screens built from the Figma designs: the
[paywall](https://www.figma.com/design/E7N7ZtobRh5wfepPAKR7vh/Untitled?node-id=1-385) and the
[Home (chat) screen](https://www.figma.com/design/E7N7ZtobRh5wfepPAKR7vh/Untitled?node-id=13-52).

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
cd ~/Cresla && git fetch origin && git stash && git checkout main && git pull && ./scripts/run.sh
```

`git stash` sets aside files the last build touched (such as `package-lock.json`), so they can't block
the update. They're kept, not deleted, and `run.sh` regenerates them anyway.

### Which screen opens

The app opens on the Home screen. To see something else:

| | Browser (`npm run dev`) | Simulator |
|---|---|---|
| Paywall | add `?screen=paywall` to the URL | `VITE_SCREEN=paywall ./scripts/run.sh` |
| Home, returning state | add `?connected=1` | `VITE_CONNECTED=1 ./scripts/run.sh` |

Tapping **Connect credit report** on Home opens the connect flow: a demo Connect page, then a demo
Success page, then back to Home in its returning state. To flip Home between its first-time and
returning states directly, **hold the logo for about half a second** (in the browser: press and
hold with the mouse).

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
  App.tsx                 Picks the screen; Home ↔ connect flow navigation; logs callbacks
  launch.ts               Hides the native launch screen; status bar text colour
  navigation/Stack.tsx    iOS-style screen stack (slide in from the right, back slides out)
  connect/                Demo connect flow: ConnectReport.tsx, ConnectSuccess.tsx, FlowScreen.tsx
  assets/                 All images (swap files here; see below); Home's are in assets/home/
  home/                   Home (chat) screen
    Home.tsx              The screen, its two states and the connect animation
    motion.ts             Load-in storyboard and connect timings
    useScrollFade.ts      Soft fade on scrolling edges (chips row, short screens)
    components/
      ModeToggle.tsx      Chat / Support with the sliding pill
      HomeLogo.tsx        Logo, its rings and the load-in glow
      ConnectCard.tsx     First-time card: gauge, owl, Connect button
      ScoreGauge.tsx      Five-segment gauge: shimmer while locked, fills on connect
      GaugeMascot.tsx     The owl + lock bubble (swap in the animated version here)
      SuggestionChips.tsx Chips row (scrolls sideways when it doesn't fit)
      Composer.tsx        Text field and the + / mic / voice buttons
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
      OwlMascot.tsx       Mascot: still image for the drop-in, then the animated loop
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

Copy `src/paywall/`, `src/assets/`, the `theme.extend` tokens from `tailwind.config.ts` and the
`@custom-variant` screen-size tiers from `src/index.css`. The host app needs Tailwind v4,
`framer-motion`, the Inter font (`@fontsource/inter` 400 and 500) and `viewport-fit=cover` in its
viewport meta tag.

Safe areas come from `env(safe-area-inset-*)`. To override them, set
`--paywall-safe-top` / `--paywall-safe-bottom` on a parent element.

## Home screen

```tsx
import { Home } from './home'

<Home
  hasConnectedReport={connected} // false: first-time state with the Connect card; true: returning
  onConnect={startConnectFlow}    // Connect credit report tapped
  onSignIn={openSignIn}
  onMenu={openMenu}
  onModeChange={(mode) => {}}     // 'chat' | 'support'
  onProfile={openProfile}         // the profile picture that replaces Sign In once connected
  onAttach={...} onDictate={...} onVoice={...} // composer's + / mic / voice buttons
  onSend={(text) => {}}           // the send arrow, shown instead of voice while there's text
/>
```

- **Two states, one component.** First time: the Connect card, with "Let's start with your credit
  report." Returning: just the logo, headline and "Ask about your report, disputes or next steps."
  (both lines in `SUBTITLE` in `Home.tsx`).
- **Connect flow.** Connect credit report calls `onConnect`; the app opens the Connect page (a
  demo: the gauge fills while it "connects"), then the Success page, and Continue returns to Home.
  The state turns on while Home is covered (`active={false}`), so Home is simply in its returning
  state when it comes back. If the state changes while Home is showing (holding the logo), it
  animates: the gauge fills, the card sinks away and the logo and headline glide to the centre.
- **Opening like an app.** The native launch screen shows the logo at twice its size, centred
  (`ios/App/App/Base.lproj/LaunchScreen.storyboard`). Home starts from exactly that picture, hides
  the launch screen (`@capacitor/splash-screen`, see `src/launch.ts`), then shrinks the logo into
  place while the rest rises in. iOS caches launch screens: if the Simulator still shows the old
  plain one, delete the app from the Simulator (hold its icon → Remove App) and run again.
- **Pulse around the logo:** faint thin rings in the logo's shape leave its edge and drift outwards
  at an even pace, fading as they go; one leaves every 1.1s (`ring-ripple` in `tailwind.config.ts`).
  The success badge uses the same pulse. With Reduce Motion the design's three still rings show.
- **Gauge colours:** on Home's white card the segments use Figma's colours; straight on the page
  background (the Connect page, `tone="page"`) the two palest segments are a few shades deeper
  (`gauge-1-page.svg`, `gauge-2-page.svg`) so they stay visible.
- **Top right:** Sign In before the report is connected; after, the profile picture
  (`assets/home/avatar.png`, 41pt, calls `onProfile`).
- **Composer:** while there's text, the blue voice button shows a send arrow instead (`onSend`,
  then the field clears).
- **Suggestion chips** fill the composer with their text and focus it. They're listed in
  `SUGGESTIONS` in `Home.tsx`. The row scrolls sideways under a soft fade when it doesn't fit.
- **Mascot:** `components/GaugeMascot.tsx` is the only place that knows about the owl image. To
  animate it, change what that component renders and keep its 73×73pt frame.
- **Colours** are the logo blues (`#2882FA` to `#0C32AB`, plus `brand` `#3576FF`) and neutrals.
- **Motion** follows the paywall: load-in with Framer Motion variants (the logo shrinking into place
  with its glow, then the headline, card, chips and composer rising in turn), loops as CSS
  animations (gauge shimmer, ring pulse), the connect sequence as transform/opacity animations. Timings are in `src/home/motion.ts`. With Reduce Motion
  on, everything appears in place and the states switch instantly.
- **Short screens:** spacing tightens on the `tiny:` tier (iPhone SE). If it still doesn't fit
  (Display Zoom on an SE), the middle scrolls with a soft fade, and the chips and composer stay put.

## Swapping assets

Replace a file in `src/assets/` with one of the same name. Nothing else needs to change.

| File | Used for | Current file | Notes |
|---|---|---|---|
| `owl-loop.webp` | Mascot animation (5s seamless loop) | Generated with Magnific (Seedance 2.5) from `owl.png` on green, keyed with `scripts/make-owl-loop.mjs` | Animated WebP with transparency, 456×456 (cropped to the owl), 24fps. See [Mascot animation](#mascot-animation) |
| `owl.png` | Mascot still: shown during the drop-in, and when Reduce Motion is on or the loop can't load | Owl from Figma, 697×724 | Must be the loop's first frame, at the same size and position, so the swap is invisible |
| `cloud-1.png` | Back cloud layer | From Figma, 2048×1138 | Shown at 889×494pt |
| `cloud-2.png` | Front cloud layer | From Figma (same image) | Shown at 889×494pt |
| `cloud-3.png` | Far, faint cloud layer (adds depth) | Same image | Shown at 600×333pt, 45% opacity |
| `light-ray-wide.svg`, `light-ray-core.svg`, `light-glow.svg` | Light beams | From Figma | |
| `icon-lock.png` | Timeline, Today (lit) | HD, 48×48 (4×) | White; shown at 12×12pt |
| `icon-bell.png`, `icon-hourglass.png` | Timeline, Day 2 and Day 3 once lit | HD, 48×48 (4×) | White versions, on the blue fill |
| `icon-bell-blue.png`, `icon-hourglass-blue.png` | Timeline, Day 2 and Day 3 before they're lit | HD, 48×48 (4×) | Blue versions, on the pale track |
| `icon-lock-blue.png` | Not used yet | HD, 48×48 (4×) | Blue lock, kept for completeness |
| `icon-bureaus.png`, `icon-letters.png`, `icon-support.png` | Perk icons | HD, 64×64 (4×) | Shown at 16×16pt |

Drawn in code, not files: the sparkle stars on the Annual card (the 4-point star from the Figma
"spark" component, `components/Sparkles.tsx`) and the flowing gold of the "HOW YOUR FREE TRIAL
WORKS" heading (the `gold-mesh` gradient in `tailwind.config.ts`).

## Screen sizes

The layout is designed at 390×844 and adapts to every iPhone and iPad through tiers defined in
`src/index.css` (`@custom-variant`) and used as Tailwind prefixes:

| Tier | When | What changes |
|---|---|---|
| `compact:` | height ≤ 830pt (iPhone mini, X/XS/11 Pro) | Slightly smaller owl, tighter gaps |
| `tiny:` | height ≤ 760pt (iPhone SE, 8, 8 Plus, iPad mini landscape) | Smaller owl and headline, tighter cards |
| `narrow:` | width ≤ 359pt (Display Zoom, iPad Slide Over) | Smaller headline and small text |
| `tablet-wide:` / `tablet:` / `tablet-lg:` | Large iPads | The whole layout is zoomed ×1.15 / ×1.3 / ×1.45 to fill the screen |

The owl's size follows the `--owl` variable set by these tiers. If a screen is still too short
(for example Display Zoom on an iPhone SE), the plans, button and footer stay pinned to the bottom
and the content above scrolls under them, so the button is always visible.

The app needs iOS 16.4 or newer (Tailwind CSS v4 relies on it), which covers iPhone 8/X and later.

## Mascot animation

The owl's loop is `src/assets/owl-loop.webp`, an animated WebP with transparency, shown by
`components/OwlMascot.tsx`. During the drop-in the owl is the still `owl.png`; when it lands, the
loop is swapped in over it, starting on the same first frame.

It's deliberately an image, not a video. Every time a `<video>` starts or resumes in an iOS web
view, the system media player takes over briefly and can freeze the whole page (about a second in
the Simulator, right in the middle of the intro). An animated image never involves it.

To make a new loop:

1. Put the still owl on a pure green (#00FF00) square, centred at about 60% of the width.
2. Generate a 5s silent 1:1 video with that image as both the start and end frame, a locked
   static camera, and a prompt that keeps the background flat green.
3. Key it, crop it to the owl and encode it (needs ffmpeg: `brew install ffmpeg`):

   ```bash
   node scripts/make-owl-loop.mjs path/to/green-screen.mov src/assets/owl-loop.webp
   ```

4. The script prints the loop's position (`top-…`, `left-…`, `size-…`). Copy those into the loop's
   `<img>` in `components/OwlMascot.tsx`, so its first frame sits exactly over `owl.png`. (The
   numbers assume the owl is framed as in step 1.)

## Motion

Every animation runs on the GPU compositor, so it stays smooth on iOS even while JavaScript is busy:

- **Intro** (Framer Motion): the storyboard and its timings are in `STORY` in `src/paywall/motion.ts`.
  It only animates whole `transform`, `opacity` and `filter` values, which Framer hands to the browser.
  Avoid `x`/`y`/`scale` shorthands, `height` and similar, because those run in JavaScript on every frame.
- **Loops and one-offs** (clouds, rays, halo, timeline fill, shine, sparkles, gold): CSS
  animations defined under `keyframes` / `animation` in `tailwind.config.ts`.

With the system's Reduce Motion setting on, everything appears in place, nothing loops, and the
timeline shows its end state.
