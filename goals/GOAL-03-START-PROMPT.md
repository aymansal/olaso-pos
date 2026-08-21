# Goal 03 Start Prompt

Use this only after the user explicitly chooses to activate Goal 03 and the
physical Galaxy Tab A9 and WDLink WD8260 are available for card-level testing.

```text
/goal Complete Goal 03 — Production Checkout and Android LAN ESC/POS Printing
as defined in goals/GOAL-03-PRINTING-INTEGRATION.md.

Before changing code:
1. Read the complete applicable AGENTS.md/DOX chain.
2. Read WORK_LEDGER.md, PLAN.md, PRODUCT.md, ARCHITECTURE.md, DESIGN.md, and BRAND.md.
3. Query graphify-out/graph.json before manual inspection.
4. Inspect the accepted standalone D:\Olaso-escpos-lab source without modifying it.
5. Mark Goal 03 active and PRINT-01 in progress in WORK_LEDGER.md.
6. Create and push codex/goal-03-printing-integration without modifying main.

Execute PRINT-01 through PRINT-08 sequentially. Keep only one card in progress.
After every completed card, update its status, completion evidence, current
checkpoint, exact next action, and journal entry. Commit and push every card,
then record its full SHA and remote branch before marking it done.

Preserve and version the accepted receipt baseline first: 80 mm WD8260, 72 mm
/ 576 dots, Font A at 48 columns, CP858 page 19, four normal full-width
separators, one MAD column heading, French/English footer, no QR/example URL,
partial cut, and the 300-dot printer-resident OLASO logo that survives power
cycling. Keep the standalone USB lab as reference; the production APK path is
Ethernet/LAN through the router using a configurable address and a verified raw
TCP port.

Implement one minimal Capacitor/Kotlin LAN socket transport, validated printer
settings with a Test printer action, a transport-independent saved receipt
model, deterministic WD8260 ESC/POS encoding, one-time resident-logo setup,
post-commit first printing, persisted print state, and safe Orders reprint and
restart/disconnect recovery. React components must contain no printer bytes or
socket code.

Printing begins only after the local sale transaction commits. A printer error
must preserve the sale and expose reprint; retry and reprint must never create a
second sale, receipt number, stock movement, outbox item, or cost effect. Report
only hardware states that the verified printer protocol actually exposes.

Preserve local-first checkout, integer-centime money, immutable sale snapshots,
idempotent Convex synchronization, ordered SQLite migrations, the 1340 by 800
approved interface, existing React/Astryx/Phosphor/CSS Module boundaries, and
the current dependency set unless measured evidence proves another dependency
necessary.

Do not implement Android USB or Bluetooth transport, HTML printing, a receipt
redesign, new receipt fonts, per-sale logo rasterization, QR/example URLs,
Arabic output, permanent hardcoded network addresses, costs, authentication,
production signing, startup optimization, a state library, or speculative
printer abstractions.

Every implementation card must pass focused checks, npm run build when
applicable, the appropriate Android build/sync, physical APK installation and
card-specific Galaxy Tab testing, clean browser console and Android logcat, and
real paper inspection for printer behavior. Documentation-only work does not
require reinstalling an unchanged APK.

Finish only after every PRINT card is done and pushed, the accepted receipt
prints over LAN from the real tablet, checkout/reprint/restart/disconnect and
endurance tests prove exactly-once sale and stock behavior, all relevant checks
and npm run build pass, browser/tablet/printer QA are clean, Graphify is refreshed
after structural changes, documentation is current, and the worktree is
synchronized and clean.
```
