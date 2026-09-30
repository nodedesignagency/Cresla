# Cresla: notes for Claude (read this first)

This file is the project's memory between chats. The user works across many short Claude chats
and always resumes from the last one, so read this before doing anything. At the end of every
session, update **Current state** and add one line to **Session log**. Keep it short.

## One branch: `main`

All work lives on `main`, and nothing else. The user asked for this so nothing gets scattered.

- Ignore the per-session `claude/...` branch the harness names: don't push it and don't open PRs
  unless the user asks. The user has authorised pushing straight to `main`.
- Start of session: `git fetch origin main && git checkout -B main origin/main`
- End of session: commit, then `git push -u origin main`
- On their Mac the user runs
  `cd ~/Cresla && git fetch origin && git stash && git checkout main && git pull && ./scripts/run.sh`
  (iOS Simulator), or runs on a wired iPhone from Xcode. No `git stash pop`: the stashed files
  are build leftovers, and popping them onto newer code can leave conflict markers.

## Project

Animated screens for a client's iOS app (credit dispute letters), headed for the App Store:
a paywall and a Home (chat) screen so far. React 19 + TypeScript + Vite 8 + Tailwind v4 + Framer
Motion, wrapped with Capacitor 8 (`com.cresla.app`, iOS 16.4+, iPhone and iPad). README.md has the
file layout, how to open each screen, asset list, screen size tiers and motion notes; read the
relevant section rather than re-exploring.

- Figma file `E7N7ZtobRh5wfepPAKR7vh`: paywall node `1:385`, Home node `13:52`. The Figma MCP is
  on the Starter plan and hits its call limit quickly: make one `get_design_context` call per
  node, download its assets straight away, and fall back to images the user attaches.
- `src/App.tsx`: Home by default, `?screen=paywall` or `VITE_SCREEN=paywall` for the paywall,
  `?connected=1` / `VITE_CONNECTED=1` for Home's returning state; holding the Home logo 0.6s
  toggles the state. Home → Connect (demo) → Success (demo) → Home runs on a small iOS-style
  stack (`src/navigation/Stack.tsx`); the demo pages are in `src/connect/`.
- Launch: the native launch screen is the logo at 2x (106.67pt), centred
  (`LaunchScreen.storyboard`, `LaunchLogo` image set). `@capacitor/splash-screen` holds it until
  Home has drawn the same logo in the same place (`src/launch.ts`), then Home shrinks it into place.
- Status bar text is set per screen (`setStatusBarText` in `src/launch.ts`): dark on Home and the
  connect flow, light on the paywall.
- Paywall: `src/paywall/Paywall.tsx`, intro timings `STORY` in `src/paywall/motion.ts`.
- Home: `src/home/Home.tsx`, timings in `src/home/motion.ts`. It reuses the paywall's
  `PrimaryButton`, `ui.ts` and motion variants.
- Tokens and CSS loop animations for both: `tailwind.config.ts`. Only logo blues
  (`#2882FA`→`#0C32AB`, brand `#3576FF`) and neutrals; nothing else coloured.
- Tailwind here uses the JS config via `@config`, which does not emit `--color-*` CSS variables.
  Use utilities (`text-brand`) or `currentColor`, never `var(--color-…)`.
- Mascot: `owl.png` still during the drop-in, then `owl-loop.webp` (animated WebP with
  transparency, made by `scripts/make-owl-loop.mjs`) swapped in when it lands
  (`components/OwlMascot.tsx`).
- Home's sleeping owl (`home/components/GaugeMascot.tsx`, 73×73pt, on the card and the Connect
  page): still `home/owl-sleeping.png` (owl only), then `home/owl-sleeping-loop.webp` once the
  screen has settled (`playing`). The thought bubble and its two dots are separate PNGs floating in
  CSS (`thought-float`). Made with `make-owl-loop.mjs ... home` from a Magnific Seedance 2.5 video
  (5s, 1:1, 1080p, no audio, start = end frame, 3,950 credits); the green start frame is the owl at
  2.4x centred in 1080px (README, Mascot animation).
- Check changes with `npm run build` (runs tsc + vite). There is no test suite.

## Rules

- Animate only whole `transform` / `opacity` / `filter` values in Framer; loops are CSS keyframes
  in `tailwind.config.ts`. Everything must respect Reduce Motion.
- No `<video>` in the paywall. Every time a video starts or resumes in an iOS web view the
  system media player takes over and can freeze the page for about a second (proven in the
  Simulator, session 2). Use animated images instead.
- Don't preload the owl loop: Chrome starts an animated image's clock on decode, so the loop
  would no longer begin on its first frame (the one matching `owl.png`).
- Never start heavy work in the middle of the intro.

## Cloud container tips

- Linux, no Xcode, no Simulator, no GPU: you cannot measure iOS performance here. You can build,
  and use headless Chromium for functional checks and screenshots. Playwright is installed
  globally, so load it with `createRequire('<output of npm root -g>/')('playwright')`, and serve
  the build with `npx vite preview` first.
- Stopping the preview server: never `pkill -f`/`pgrep -f` a pattern like "vite preview" in the
  same command that mentions it; it matches your own shell and kills it (exit 144). Use
  `ps -eo pid,comm,args | awk '$2=="node" && /vite/ {print $1}'` and `kill` that PID.
- ffmpeg: `pip3 install imageio-ffmpeg`, then use the binary at
  `python3 -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())"` (it has
  libwebp_anim; no drawtext). `pip3 install pillow numpy` reads animated WebP frames.
- Screen recordings the user uploads: per-frame differences plus `tile` contact sheets show
  freezes (runs of ~0 difference) and jumps (one huge difference) well. Always ask the user
  for a recording before guessing at a Simulator problem.
- The user is not a developer: give exact commands to paste and click-by-click steps.

## Current state

- Done: paywall (built from Figma, full motion, animated owl as an animated WebP, responsive,
  HD icons; the user confirmed it runs smoothly in the Simulator). Home screen: both states, all
  interactions, app-launch logo intro, soft ripple pulse round the logo, returning body text, profile
  picture instead of Sign In once connected, send arrow in the composer. Demo connect flow (the
  Connect page shows the gauge 1.55x bigger, no card). Home's sleeping owl is animated (breathes and
  snuggles into its wing, 5s loop; the lock bubble floats in code).
- Waiting on the user:
  - Set the GitHub default branch to `main` (repo Settings → General → Default branch), then
    delete the old `claude/charming-hawking-ilb5hy` branch.
  - Check Home on the Simulator and the iPhone, including the keyboard (the composer has only
    been tested in a desktop browser) and the launch handoff (storyboard and splash plugin were
    written without Xcode; if the build complains about LaunchScreen.storyboard, look there first).
  - Approve the placeholder copy: returning body text "Ask about your report, disputes or next
    steps.", and the demo Connect / Success page texts.
  - Check the sleeping owl on the Simulator and the iPhone.
- Idea offered to the user, not built: the lock in the bubble could pop open when the report connects.
- Open question: Home's third Figma chip ("How Can Cresla Help", no "?", Geist font, document
  icon) looked like a leftover duplicate and was left out.
- Not built yet: real purchases (StoreKit), Sign In, Restore, Terms and Privacy links. The
  callbacks only log to the console (`src/App.tsx`).

## Session log (newest first)

- **6** (2026-09-30): animated Home's sleeping owl. Asked the user first (they chose: breathe +
  snuggle, bubble animated in code, no Zzz, gentle). Split owl-sleeping.png into owl / bubble / two
  dots (separate shapes in the PNG). One Seedance 2.5 generation; its frame 0 is the upload itself
  and the last frame repeats it, so the script now drops the last frame, crops to a rectangle and
  takes a `home` preset. Loop's first frame sits on the still within 0.1pt; no green fringe.
  Checked in headless Chromium: loads only after the intro, Reduce Motion stays still, no errors.
  Then, per the user's screenshot: Connect page lost "Your reports are locked" (and its
  "Checking all 3 bureaus…" state; the button already says Connecting…); heading is now "Connect
  your credit report to unlock" (user's words), closer to the gauge, 24px on `narrow:`.

- **5** (2026-09-30): the pulse was too harsh; matched the user's reference video (measured it:
  thin faint rings drifting out at ~constant speed, one per ~1s, fading). Now `ring-ripple` is
  linear, 3.3s, 3 rings, no fill, 30% brand-ring hairline from the logo's own size. Connect page:
  palest gauge segments were invisible on the page background, added a `tone="page"` with deeper
  versions of segments 1 and 2.

- **4** (2026-09-30): user feedback. Logo rings: no static rings any more, a smooth ripple pulse
  instead (also on the success badge; static rings only with Reduce Motion). Connect page: card
  removed, gauge 1.55x via CSS zoom (owl image now 360px so it stays sharp). Sign In becomes the
  profile picture (user's image) once connected. Composer: send arrow replaces the voice icon
  while there's text.

- **3** (2026-09-30): user feedback on Home. Logo now opens like an app (native launch screen with
  the logo at 2x, Home takes over and shrinks it into place; exact centring checked on iPhones
  and iPads); logo rings pulse; Connect now opens a demo Connect page → Success page → Home in the
  returning state, with iOS slide transitions; returning state has body text. Fixed the status bar
  text (was white on Home's light page).

- **2, part 2** (2026-09-29): the user confirmed the paywall is smooth. Built the Home screen
  from Figma node 13:52 (hit the Figma MCP limit after downloading everything; used the user's
  image for detail). Verified in headless Chromium: all regions line up with the Figma render
  within 1px at 393×852, all interactions work, iPhone SE to iPad layouts, Reduce Motion.

- **2** (2026-09-27 to 29): Created `main` and this file. The user's Simulator recording showed
  the page freezing for about 1s exactly when the owl video started playing (1.45s into the
  intro), then everything jumping to its end state; a wired iPhone 18 Pro was fine. A first fix
  (warm the video up before the intro) made it worse: a second recording showed a 1.7s blank
  screen at launch and the same freeze, so every video start/resume freezes the Simulator.
  Final fix: the owl loop is now an animated WebP (`owl-loop.webp`, 456px, 2.9 MB), with no
  video and no WebGL; `AlphaVideo.tsx` and `owl-loop.mp4` were removed and
  `make-alpha-video.mjs` became `make-owl-loop.mjs`.
- **1** (2026-09-25 to 27, branch `claude/charming-hawking-ilb5hy`): project setup, paywall from
  Figma, motion, `scripts/run.sh`, animated owl, responsive layout, HD icons.
