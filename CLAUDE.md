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
- Mascot: stacked-alpha H.264 video drawn by WebGL (`components/AlphaVideo.tsx`), `owl.png`
  as its first frame and fallback.
- Check changes with `npm run build` (runs tsc + vite). There is no test suite.

## Rules

- Animate only whole `transform` / `opacity` / `filter` values in Framer; loops are CSS keyframes
  in `tailwind.config.ts`. Everything must respect Reduce Motion.
- Never start heavy work (video playback, big image decodes) in the middle of the intro. It
  stalls the page on slower devices and in the Simulator (see session 2).

## Cloud container tips

- Linux, no Xcode, no Simulator, no GPU: you cannot measure iOS performance here. You can build,
  and use headless Chromium for functional checks and screenshots. Playwright is installed
  globally, so load it with `createRequire('<output of npm root -g>/')('playwright')`, and serve
  the build with `npx vite preview` first.
- Playwright's Chromium can't play H.264. For tests, transcode `owl-loop.mp4` to VP9 WebM and
  serve it with `page.route('**/owl-loop-*.mp4', ...)`. Don't commit the WebM.
- ffmpeg: `pip3 install imageio-ffmpeg`, then use the binary at
  `python3 -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())"` (no drawtext).
  For screen recordings the user uploads, per-frame differences plus `tile` contact sheets
  show freezes and jumps well.

## Current state

- Done: paywall built from Figma, full intro and ambient motion, animated owl, responsive layout
  for every iPhone and iPad, HD icons, owl video warm-up (session 2).
- Waiting on the user:
  - Set the GitHub default branch to `main` (repo Settings → General → Default branch), then
    delete the old `claude/charming-hawking-ilb5hy` branch.
  - Confirm on the Simulator that the intro no longer freezes, and try an older iPhone or
    Low Power Mode before launch.
- Not built yet: real purchases (StoreKit), Sign In, Restore, Terms and Privacy links. The
  callbacks only log to the console (`src/App.tsx`).

## Session log (newest first)

- **2** (2026-09-27): Created `main` and this file. The user's Simulator recording showed the web
  view freezing for about 1.1s exactly when the owl video started playing (1.45s into the
  intro), then everything jumping to its end state. A wired iPhone 18 Pro was fine. Fix: the video
  is warmed up (one frame played, then rewound) before the intro, and the intro waits for it.
- **1** (2026-09-25 to 27, branch `claude/charming-hawking-ilb5hy`): project setup, paywall from
  Figma, motion, `scripts/run.sh`, animated owl, responsive layout, HD icons.
