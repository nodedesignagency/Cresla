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

Single-screen animated paywall for a client's iOS app (credit dispute letters), headed for the App
Store. React 19 + TypeScript + Vite 8 + Tailwind v4 + Framer Motion, wrapped with Capacitor 8
(`com.cresla.app`, iOS 16.4+, iPhone and iPad). README.md has the file layout, asset list, screen
size tiers and motion notes; read the relevant section rather than re-exploring.

- Screen: `src/paywall/Paywall.tsx`. Intro timings: `STORY` in `src/paywall/motion.ts`.
  Tokens and CSS loop animations: `tailwind.config.ts`.
- Mascot: `owl.png` still during the drop-in, then `owl-loop.webp` (animated WebP with
  transparency, made by `scripts/make-owl-loop.mjs`) swapped in when it lands
  (`components/OwlMascot.tsx`).
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
- ffmpeg: `pip3 install imageio-ffmpeg`, then use the binary at
  `python3 -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())"` (it has
  libwebp_anim; no drawtext). `pip3 install pillow numpy` reads animated WebP frames.
- Screen recordings the user uploads: per-frame differences plus `tile` contact sheets show
  freezes (runs of ~0 difference) and jumps (one huge difference) well. Always ask the user
  for a recording before guessing at a Simulator problem.
- The user is not a developer: give exact commands to paste and click-by-click steps.

## Current state

- Done: paywall built from Figma, full intro and ambient motion, animated owl (now an animated
  WebP, no video), responsive layout for every iPhone and iPad, HD icons.
- Waiting on the user:
  - Set the GitHub default branch to `main` (repo Settings → General → Default branch), then
    delete the old `claude/charming-hawking-ilb5hy` branch.
  - Confirm on the Simulator that the intro no longer freezes (a new screen recording is the
    best check), then try the wired iPhone, and an older iPhone or Low Power Mode, before launch.
- Not built yet: real purchases (StoreKit), Sign In, Restore, Terms and Privacy links. The
  callbacks only log to the console (`src/App.tsx`).

## Session log (newest first)

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
