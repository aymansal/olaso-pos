# Goal 02 Start Prompt

Paste the following into a new Codex conversation opened at `D:\Olaso`:

```text
/goal

Complete Goal 02 — Functional Full Application Beta for Olaso POS.

Before changing anything:

1. Read the complete applicable AGENTS.md instruction chain.
2. Read PRODUCT.md, ARCHITECTURE.md, DESIGN.md, BRAND.md, and WORK_LEDGER.md.
3. Query graphify-out/graph.json first, following the repository's Graphify
   rules.
4. Treat WORK_LEDGER.md as the durable source of execution state. Re-read it
   after compaction or handoff and update its checkpoint and journal after every
   meaningful completed step.

Execute APP-00 through APP-12 in dependency order, one card at a time. Start
with APP-00 only. Do not redesign the plan or silently broaden the scope.

For every card:

- Keep at most one card in progress.
- Follow its contract and completion evidence in WORK_LEDGER.md.
- Run the required checks and refresh Graphify after structural changes.
- Update WORK_LEDGER.md in the same commit.
- Use a commit subject beginning with the card ID, for example
  `APP-03: connect product management`.
- Push `codex/goal-02-functional-app` immediately after the card commit.
- Do not mark the card done until the push succeeds and its commit SHA and
  remote branch are recorded in the ledger.
- Never commit `.env.local`, credentials, deployment secrets, signing keys, or
  printer secrets.

Use the Convex CLI and a dedicated development deployment for the backend.
Create deterministic, repeatable development mock data through a protected
internal seed/reset function. Keep reads bounded and mutations deliberate so
the application remains efficient on the Convex free plan.

Preserve the approved Pencil-derived design and existing component/CSS
boundaries. Keep checkout local-first using the documented SQLite/outbox
architecture, then synchronize idempotently with Convex.

Receipt-printer integration is not part of this goal. Do not implement
ESC/POS, Bluetooth/USB printer transport, printer permissions, or physical
printer testing. Save receipt snapshots and support on-screen receipt preview
only. Printer work will be a later goal after I provide the workflow and
hardware.

Begin by reporting the ledger checkpoint, marking APP-00 in progress, and
completing APP-00 exactly as written.
```
