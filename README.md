# Cresla

The Cresla iOS app's front end: the paywall, the Home (chat) screen and the credit report connect
flow, fully animated and built from the Figma designs
([paywall](https://www.figma.com/design/E7N7ZtobRh5wfepPAKR7vh/Untitled?node-id=1-385),
[Home](https://www.figma.com/design/E7N7ZtobRh5wfepPAKR7vh/Untitled?node-id=13-52)).

React 19 + TypeScript + Vite · Tailwind CSS v4 · Framer Motion · Capacitor 8 (iOS 16.4+, iPhone
and iPad)

## What's included

- **Paywall:** cinematic intro (sky, clouds, light rays, the owl dropping in, then looping), the
  animated free-trial timeline, Monthly / Annual plans and the trial button.
- **Home (chat) screen** in both states: first time (the Connect credit report card, with the
  sleeping owl) and returning. Chat / Support switch, suggestion chips, message field with the
  + / mic / voice buttons and a send arrow while there's text.
- **Connect flow:** Home → Connect page → Success page → back to Home in its returning state, with
  iOS-style slide transitions. The connection itself is a demo (see below).
- **App launch:** the launch screen shows the logo, and Home takes it over and shrinks it into place,
  so the app opens without a visible cut.
- **App icon** (`ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png`).
- Every iPhone from the SE to the Pro Max and every iPad, and the system's Reduce Motion setting.

## What your developer still needs to connect

The screens are finished; the services behind them aren't part of this delivery. Every button
already calls a function, which for now only logs to the console, in `src/App.tsx`:

| Feature | Where | To do |
|---|---|---|
| Purchases | `onSubscribe(plan)` on `<Paywall>` | Start the StoreKit (or RevenueCat) purchase for `plan.id` (`'monthly'` or `'annual'`). The prices shown are in `src/paywall/plans.ts`; keep them in line with the App Store Connect products. |
| Restore purchases | `onRestore` on `<Paywall>` | Restore through StoreKit. |
| Terms of use, Privacy Policy | `onOpenTerms`, `onOpenPrivacy` on `<Paywall>` | Open the two pages. |
| Sign In and profile | `onSignIn` (Paywall and Home), `onProfile` (Home) | Sign-in flow and profile. The profile picture is a placeholder: `src/assets/home/avatar.png`. |
| Credit report connection | `src/connect/ConnectReport.tsx`, `src/connect/ConnectSuccess.tsx` | Both pages are stand-ins (marked "Demo screen" at the bottom): Connect waits a few seconds, then reports success. Replace with the real bureau connection, then set Home's `hasConnectedReport` from real data. |
| Chat | `onSend(text)`, `onModeChange`, `onAttach`, `onDictate`, `onVoice`, `onMenu` on `<Home>` | The chat itself, Support mode, attachments, dictation, voice mode and the menu. |
| When the paywall shows | `src/App.tsx` | The app opens on Home; the paywall is reached with a preview switch (below). Decide where it appears in the real app. |
| Signing and release | Xcode | Choose your team under Signing & Capabilities. Bundle ID `com.cresla.app`, version 1.0 (1). |

## Run it

Requires a Mac with Xcode, and Node 22.12 or newer.

```bash
npm install
./scripts/run.sh                 # build, then launch in the iOS Simulator
./scripts/run.sh "iPhone 16"     # same, on a specific simulator
./scripts/run.sh iphone          # a connected iPhone: build, then open Xcode (pick the phone, press ▶)
./scripts/run.sh web             # browser preview
```

Without a name, `run.sh` uses the simulator that's already open, or the newest iPhone Pro. The
first Simulator build takes a few minutes; later runs are much faster. On a real iPhone, choose your
team under Signing & Capabilities the first time.

**Xcode doesn't build the screens itself.** It packages whatever `npx cap sync ios` last copied into
the iOS project. After every change, run `./scripts/run.sh` (or `npm run build && npx cap sync ios`)
before pressing Run, or Xcode installs the previous build.

### Which screen opens

The app opens on Home. To preview something else:

| | Browser (`npm run dev`) | Simulator |
|---|---|---|
| Paywall | add `?screen=paywall` to the URL | `VITE_SCREEN=paywall ./scripts/run.sh` |
| Home, returning state | add `?connected=1` | `VITE_CONNECTED=1 ./scripts/run.sh` |

To flip Home between its first-time and returning states, **hold the logo for about half a second**
(in the browser: press and hold with the mouse). This is a testing shortcut; remove
`onLogoLongPress` in `src/App.tsx` for release.

### Step by step

In the browser: `npm run dev`, open the printed URL and switch to an iPhone in the browser's dev
tools (Chrome: ⌘⌥I → device toolbar). The preview fakes an iPhone's status bar and home indicator
space, because desktop browsers don't have them.

In the Simulator:

```bash
npm run build        # build the web app into dist/
npx cap sync ios     # copy dist/ into the Xcode project and update native plugins
npx cap open ios     # open ios/App/App.xcodeproj in Xcode, pick a simulator, press Run (⌘R)
```

`npm run ios` runs all three. The first open takes a minute while Xcode downloads the Capacitor
Swift packages. For live reload on the Simulator while editing, run `npm run dev` in one terminal
and `npx cap run ios -l --host localhost --port 5173` in another; run `npx cap sync ios` afterwards
so the Xcode project points back at the bundled build.

## Project layout

```
src/
  App.tsx                 Picks the screen; Home ↔ connect flow navigation; the placeholder callbacks
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
      HomeLogo.tsx        Logo, its ripple pulse and the load-in glow
      ConnectCard.tsx     First-time card: gauge, owl, Connect button
      ScoreGauge.tsx      Five-segment gauge: shimmer while locked, fills on connect
      GaugeMascot.tsx     The sleeping owl (animated loop) and its floating lock bubble
      SuggestionChips.tsx Chips row (scrolls sideways when it doesn't fit)
      Composer.tsx        Message field and the + / mic / voice / send buttons
  paywall/                Self-contained paywall, ready to copy into another app
    Paywall.tsx           The screen and its props
    plans.ts              Plan labels, prices and button copy
    motion.ts             Intro timings and easing curves
    ui.ts                 44pt tap-area and focus-ring helpers
    components/
      PlanCard.tsx        Selectable plan (native radio), sliding ring, sparkles
      TrialTimeline.tsx   "How your free trial works" with the progress fill
      PerkItem.tsx        Icon + label perk, and the divider between perks
      PrimaryButton.tsx   Main button with shine sweep and press scale
      OwlMascot.tsx       Mascot: still image for the drop-in, then the animated loop
      SkyBackground.tsx   Sky gradient and drifting clouds
      LightRays.tsx       Pulsing light beams
      GlossBadge.tsx, Radio.tsx, Sparkles.tsx
scripts/
  run.sh                  Build and run (above)
  make-owl-loop.mjs       Turns a green-screen video into a mascot loop (see Mascot animation)
tailwind.config.ts        Design tokens (colours, type, spacing, radii, shadows) and CSS loop animations
capacitor.config.ts       App id and name, status bar, launch screen
ios/                      Native Xcode project (managed by Capacitor)
```

## Paywall

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

To use it in another app, copy `src/paywall/`, `src/assets/`, the `theme.extend` tokens from
`tailwind.config.ts` and the `@custom-variant` screen-size tiers from `src/index.css`. The host app
needs Tailwind v4, `framer-motion`, the Inter font (`@fontsource/inter` 400 and 500) and
`viewport-fit=cover` in its viewport meta tag. Safe areas come from `env(safe-area-inset-*)`; to
override them, set `--paywall-safe-top` / `--paywall-safe-bottom` on a parent element.

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
  onAttach={...} onDictate={...} onVoice={...} // message field's + / mic / voice buttons
  onSend={(text) => {}}           // the send arrow, shown instead of voice while there's text
/>
```

- **Two states, one component.** First time: the Connect card, with "Let's start with your credit
  report." Returning: the logo, headline and "Ask about your report, disputes or next steps."
  (both lines are in `SUBTITLE` in `Home.tsx`).
- **Connect flow.** Connect credit report calls `onConnect`; the app opens the Connect page, then
  the Success page, and Continue returns to Home. The state turns on while Home is covered
  (`active={false}`), so Home is simply in its returning state when it comes back. If the state
  changes while Home is showing, it animates: the gauge fills, the card sinks away and the logo and
  headline glide to the centre.
- **Opening like an app.** The native launch screen shows the logo at twice its size, centred
  (`ios/App/App/Base.lproj/LaunchScreen.storyboard`). Home starts from exactly that picture, hides
  the launch screen (`@capacitor/splash-screen`, see `src/launch.ts`), then shrinks the logo into
  place while the rest rises in. iOS caches launch screens: if a device still shows an older one,
  delete the app (hold its icon → Remove App) and run again.
- **Pulse around the logo:** faint thin rings in the logo's shape drift outwards and fade; one
  leaves every 1.1s (`ring-ripple` in `tailwind.config.ts`). The success badge uses the same pulse.
- **Gauge colours:** on Home's white card the segments use the design's colours; straight on the
  page background (the Connect page, `tone="page"`) the two palest segments are a few shades deeper
  (`gauge-1-page.svg`, `gauge-2-page.svg`) so they stay visible.
- **Top right:** Sign In before the report is connected; after, the profile picture
  (`assets/home/avatar.png`, 41pt, calls `onProfile`).
- **Message field:** sized like a native chat field (18pt text, 36pt buttons). It grows with its
  text up to five lines. While there's text, the blue voice button turns into a send arrow
  (`onSend`, then the field clears).
- **Suggestion chips** fill the message field with their text and focus it. They're listed in
  `SUGGESTIONS` in `Home.tsx`. The row scrolls sideways under a soft fade when it doesn't fit.
- **Sleeping owl:** `components/GaugeMascot.tsx`, a 73×73pt frame inside the gauge (on Home's card
  and, bigger, on the Connect page). Once the screen has settled, the owl breathes and snuggles into
  its wing in a 5s loop, swapped in over the still image. The thought bubble and its two dots are
  separate images that bob gently in code, so the lock stays sharp and could react later (for
  example, open when the report connects).
- **Colours** are the logo blues (`#2882FA` to `#0C32AB`, plus `brand` `#3576FF`) and neutrals.
- **Short screens:** spacing tightens on the `tiny:` tier (iPhone SE). If it still doesn't fit
  (Display Zoom on an SE), the middle scrolls with a soft fade, and the chips and message field stay
  put.

## Swapping assets

Replace a file with one of the same name. Nothing else needs to change.

| File (in `src/assets/` unless noted) | Used for | Notes |
|---|---|---|
| `ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png` | App icon | 1024×1024 PNG with no transparency; iOS rounds the corners |
| `ios/App/App/Assets.xcassets/LaunchLogo.imageset/` | Logo on the launch screen | 107 / 214 / 320px; must match `home/logo.png` so the handoff to Home is invisible |
| `home/logo.png` | Home logo | 400×400, shown at 53pt |
| `owl-loop.webp` | Paywall mascot animation (5s seamless loop) | Animated WebP with transparency, 456×456, 24fps. See [Mascot animation](#mascot-animation) |
| `owl.png` | Paywall mascot still: during the drop-in, with Reduce Motion, or if the loop can't load | 697×724. Must be the loop's first frame, at the same size and position, so the swap is invisible |
| `home/owl-sleeping-loop.webp` | Home's sleeping owl (5s seamless loop) | Animated WebP with transparency, 328×214, 24fps |
| `home/owl-sleeping.png` | Home's sleeping owl, still | 360×360, fills the 73×73pt frame; must be the loop's first frame |
| `home/thought-bubble.png`, `home/thought-dot-large.png`, `home/thought-dot-small.png` | The owl's thought bubble with the lock, and its two dots | Positions are in `THOUGHT` in `GaugeMascot.tsx` |
| `home/avatar.png` | Profile picture placeholder | Shown at 41pt |
| `cloud-1.png`, `cloud-2.png`, `cloud-3.png` | Paywall cloud layers (back, front, far) | 2048×1138, shown at 889×494pt (far layer 600×333pt, 45% opacity) |
| `light-ray-wide.svg`, `light-ray-core.svg`, `light-glow.svg` | Paywall light beams | |
| `icon-lock.png`, `icon-bell.png`, `icon-hourglass.png` | Timeline icons once lit | White, 48×48 (4×), shown at 12×12pt |
| `icon-bell-blue.png`, `icon-hourglass-blue.png` | Timeline icons before they're lit | Blue versions, on the pale track |
| `icon-lock-blue.png` | Not used | A spare blue lock, kept with the set |
| `icon-bureaus.png`, `icon-letters.png`, `icon-support.png` | Paywall perk icons | 64×64 (4×), shown at 16×16pt |
| `home/icon-*.svg`, `home/gauge-*.svg`, `connect/icon-*.svg` | Home and connect flow icons, gauge segments | Vector, from the design |

Drawn in code, not files: the sparkle stars on the Annual card (`paywall/components/Sparkles.tsx`)
and the flowing gold of the "HOW YOUR FREE TRIAL WORKS" heading (the `gold-mesh` gradient in
`tailwind.config.ts`).

## Screen sizes

The layout is designed at 390×844 and adapts to every iPhone and iPad through tiers defined in
`src/index.css` (`@custom-variant`) and used as Tailwind prefixes:

| Tier | When | What changes |
|---|---|---|
| `compact:` | height ≤ 830pt (iPhone mini, X/XS/11 Pro) | Slightly smaller owl, tighter gaps |
| `tiny:` | height ≤ 760pt (iPhone SE, 8, 8 Plus, iPad mini landscape) | Smaller owl and headline, tighter cards |
| `narrow:` | width ≤ 359pt (Display Zoom, iPad Slide Over) | Smaller headlines and small text |
| `tablet-wide:` / `tablet:` / `tablet-lg:` | Large iPads | The whole layout is zoomed ×1.15 / ×1.3 / ×1.45 to fill the screen |

On the paywall the owl's size follows the `--owl` variable set by these tiers. If a screen is still
too short (for example Display Zoom on an iPhone SE), the plans, button and footer stay pinned to
the bottom and the content above scrolls under them, so the button is always visible.

The app needs iOS 16.4 or newer (Tailwind CSS v4 relies on it), which covers iPhone 8/X and later.

## Mascot animation

Both owls are animated WebP images with transparency. The paywall owl's loop (`owl-loop.webp`,
shown by `paywall/components/OwlMascot.tsx`) is swapped in over the still `owl.png` when it lands;
Home's sleeping owl (`home/owl-sleeping-loop.webp`, in `home/components/GaugeMascot.tsx`) is swapped
in over `home/owl-sleeping.png` once the screen has settled. Each loop starts on its still's exact
pose, so the swap can't be seen.

They're deliberately images, not videos. Every time a `<video>` starts or resumes in an iOS web
view, the system media player takes over briefly and can freeze the whole page. An animated image
never involves it.

To make a new loop:

1. Put the still owl on a pure green (#00FF00) square. Paywall: centred at about 60% of the width.
   Home: the owl from `home/owl-sleeping.png` (without the bubble) at 2.4×, centred in a 1080px
   square.
2. Generate a 5s silent 1:1 video with that image as both the start and end frame, a locked static
   camera, and a flat green background throughout.
3. Key it, crop it to the owl and encode it (needs ffmpeg: `brew install ffmpeg`). The video's last
   frame repeats its first, so the script leaves it out:

   ```bash
   node scripts/make-owl-loop.mjs path/to/green-screen.mov src/assets/owl-loop.webp                     # paywall
   node scripts/make-owl-loop.mjs path/to/green-screen.mov src/assets/home/owl-sleeping-loop.webp home  # Home
   ```

4. The script prints the loop's position (`top-…`, `left-…`, `w-…`, `h-…`). Copy those into the
   loop's `<img>` in the component it names, so its first frame sits exactly over the still. (The
   numbers assume the owl is framed as in step 1.)

## Motion

Every animation runs on the GPU compositor, so it stays smooth on iOS even while JavaScript is busy:

- **Intros** (Framer Motion): the paywall's storyboard is `STORY` in `src/paywall/motion.ts`, Home's
  is `HOME_STORY` in `src/home/motion.ts`. They only animate whole `transform`, `opacity` and
  `filter` values, which Framer hands to the browser. Avoid `x`/`y`/`scale` shorthands, `height`
  and similar, because those run in JavaScript on every frame.
- **Loops and one-offs** (clouds, rays, halo, timeline fill, shine, sparkles, gold, logo pulse,
  gauge shimmer, thought bubble): CSS animations defined under `keyframes` / `animation` in
  `tailwind.config.ts`.

With the system's Reduce Motion setting on, everything appears in place, nothing loops, and the
timeline shows its end state.
