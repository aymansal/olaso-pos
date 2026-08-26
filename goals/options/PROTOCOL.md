# OPTIONS working protocol

Every OPTIONS card uses this protocol verbatim. An agent that skips a step has
not finished the card.

## 1. Before writing any code

- Read the full instruction chain: `AGENTS.md`, every nested `AGENTS.md` between
  the repository root and the files you will change, `PLAN.md`,
  `WORK_LEDGER.md`, `PRODUCT.md`, `ARCHITECTURE.md`, `DESIGN.md`, this protocol,
  and this card's spec.
- Run `graphify query` before any Read, Grep, or Glob exploration.
- Research the current official Android and Capacitor guidance for this specific
  card, the way a senior Android developer would, and record in the ledger:
  which platform options exist, what belongs in native Android versus the React
  and data layer, what was rejected and why, the target-device implications, and
  the source URLs. This is a gate, not paperwork.
- Treat the technical instructions as a starting design, not gospel. If current
  official Android or Capacitor guidance contradicts a step, follow the official
  guidance and record the deviation in the ledger. Do not add Kotlin or a native
  dependency when the existing Capacitor SQLite boundary already provides the
  correct behaviour.

## 2. While implementing

- Any bug found stops the card immediately. Diagnose the root cause and fix it.
  Never work around it by changing test data, picking a different record, using
  a clean database, restarting until the symptom hides, weakening validation, or
  calling it someone else's card.
- Add the smallest regression check that would have failed on the original bug,
  then reproduce the original conditions and prove the fix.
- Resume the card only after the bug is genuinely fixed.
- One card at a time. Keep unrelated changes out of the card commit.
- Never trust a price or quantity supplied by the UI; always re-read trusted
  data inside the SQLite transaction and again on Convex.
- Money is integer centimes. Ingredients are integer base units. Never floats.
- Migrations are append-only. Never edit a released migration.
- Test PINs come from `OLASO_OWNER_PIN` and `OLASO_CASHIER_PIN`. They never
  reach source, git, logs, SQLite, or the ledger.

## 3. Automated verification

Run the card's focused checks, then `npx tsc -b`, `npm run build`, and
`npx convex dev --once` when schema or deployed functions changed. Refresh
Graphify with `graphify update .` after structural changes.

## 4. Physical tablet testing

Follow [TABLET-TESTING.md](TABLET-TESTING.md).

- Build and install the debug beta over the existing app:
  `npm run android:sync`, `npm run android:beta`, then install on the connected
  Galaxy Tab A9. Install over the existing app; never a clean install.
- Drive the app through ADB plus `scripts/tablet-session.mjs`. Locate elements
  by selector. Blind coordinate taps are not acceptable evidence.
- Unlock both the owner and cashier profiles from the environment variables.
  Prove the cashier cannot reach owner-only surfaces.
- Test deeply: offline with flight mode, force close and restart, reconnect and
  ordered sync, retry after failure, role permissions, and the exact
  1340 by 800 layout with no clipping or overflow.
- Collect the WebView console and filtered logcat. Zero new warnings or errors
  introduced by the card.
- Anything found here is a bug and returns you to step 2.

## 5. Closing the card

- Update `WORK_LEDGER.md` with the research decision, verified facts, files
  changed, checks run, device evidence, and the exact next action. Update
  `PLAN.md` if the next action changed.
- Commit with the card ID as prefix, for example
  `OPTIONS-01: add product-owned size and choice storage`. Push directly to
  `origin/main` and record the full SHA in the ledger.

## 6. Stop and report

After pushing, stop. Do not start the next card. Report to the owner in plain
English:

- what the card actually changed, in terms he can picture;
- what you discovered along the way, including anything surprising;
- every bug you hit and how you fixed it;
- what you tested on the tablet and what the result was;
- anything still open or that he needs to decide.

Then ask whether to begin the next card, and wait.
