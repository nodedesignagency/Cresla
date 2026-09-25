#!/usr/bin/env bash
# See the latest build in one command: installs dependencies, builds the web app,
# syncs it into the iOS project, then builds and launches it in the iOS Simulator.
#
#   ./scripts/run.sh                  iPhone simulator (the one already open, or the newest iPhone Pro)
#   ./scripts/run.sh "iPhone 16"      a specific simulator by name
#   ./scripts/run.sh web              browser preview at http://localhost:5173 instead
set -euo pipefail
cd "$(dirname "$0")/.."

step() { printf '\n\033[1;34m›\033[0m \033[1m%s\033[0m\n' "$1"; }
fail() { printf '\n\033[1;31m✗ %s\033[0m\n' "$1" >&2; exit 1; }

command -v node >/dev/null || fail "Node.js is not installed. Get Node 22 or newer from https://nodejs.org"

step "Installing dependencies"
npm install --no-audit --no-fund --loglevel=error

if [[ "${1:-}" == "web" ]]; then
  step "Starting browser preview"
  exec npm run dev
fi

command -v xcrun >/dev/null || fail "The iOS Simulator needs macOS with Xcode. Use: ./scripts/run.sh web"
xcrun xcodebuild -version >/dev/null 2>&1 ||
  fail "Xcode command line tools aren't pointing at Xcode. Run: sudo xcode-select -s /Applications/Xcode.app/Contents/Developer"

step "Building web app"
npm run build

step "Syncing into the iOS project"
npx cap sync ios

step "Choosing a simulator"
udid=$(xcrun simctl list devices available --json | node -e '
  const wanted = (process.argv[1] || "").toLowerCase()
  const { devices } = JSON.parse(require("fs").readFileSync(0, "utf8"))
  const version = (runtime) => (runtime.match(/iOS-(\d+)-(\d+)/) || [0, 0, 0]).slice(1).map(Number)
  const iphones = Object.entries(devices)
    .filter(([runtime]) => runtime.includes("SimRuntime.iOS-"))
    .sort(([a], [b]) => version(b)[0] - version(a)[0] || version(b)[1] - version(a)[1]) // newest iOS first
    .flatMap(([runtime, list]) => list.map((d) => ({ ...d, ios: version(runtime).join(".") })))
    .filter((d) => d.isAvailable !== false && d.name.startsWith("iPhone"))
  const pick = wanted
    ? iphones.find((d) => d.name.toLowerCase() === wanted)
    : iphones.find((d) => d.state === "Booted") || iphones.find((d) => /^iPhone \d+ Pro$/.test(d.name)) || iphones[0]
  if (!pick) {
    const names = [...new Set(iphones.map((d) => d.name))].join(", ")
    console.error(
      wanted
        ? `No simulator named "${process.argv[1]}". Available: ${names || "none"}`
        : "No iPhone simulators installed. Open Xcode → Settings → Components and add an iOS simulator.",
    )
    process.exit(1)
  }
  console.error(`Using ${pick.name} (iOS ${pick.ios})`)
  console.log(pick.udid)
' "${1:-}")

# Build, install and launch directly with Xcode's tools. (`cap run ios` looks for Simulator.app
# at a fixed path inside Xcode, which newer Xcode versions no longer use.)
step "Building the iOS app (the first build takes a few minutes)"
derived="ios/DerivedData/$udid"
xcrun xcodebuild -quiet \
  -project ios/App/App.xcodeproj -scheme App -configuration Debug \
  -destination "id=$udid" -derivedDataPath "$derived"
app="$derived/Build/Products/Debug-iphonesimulator/App.app"
bundle_id=$(plutil -extract CFBundleIdentifier raw -o - "$app/Info.plist")

step "Launching in the Simulator"
open -a Simulator --args -CurrentDeviceUDID "$udid"
xcrun simctl bootstatus "$udid" -b >/dev/null
xcrun simctl install "$udid" "$app"
xcrun simctl terminate "$udid" "$bundle_id" >/dev/null 2>&1 || true
xcrun simctl launch "$udid" "$bundle_id" >/dev/null
printf '\n\033[1;32m✓ Cresla is running in the Simulator\033[0m\n'
