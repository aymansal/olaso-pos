# Olaso Work Ledger

This file records the active implementation goal or the most recently completed
goal between activations. Project rules and durable product decisions remain in
AGENTS.md, PRODUCT.md, ARCHITECTURE.md, DESIGN.md, and BRAND.md. PLAN.md owns the
remaining goal and card sequence.

## Active Goal

### Current checkpoint — 2026-09-05 Lemonade menu (POLISH-01)

- Owner follow-up confirmed Excel amounts for Standard; leave Plus without
  ingredients temporarily. Approved explicit zero Plus quantity overrides
  prevent resolver fallback to Standard; they represent no configured deduction,
  not a claim that Plus has no real ingredient cost. Apply eight Standard
  recipes through existing authenticated callback; Iced Tea remains unlinked.
- Completed follow-up: eight new immutable recipes via authenticated local-first
  onSaveRecipe,31source ingredient rows,62explicit size quantities (Standard
  exact Excel; Plus zero). No app changes/build needed. Existing researched
  native SQLite/reconnect boundary unchanged. Backup tmp/lemonade-before-recipes.json.
- Exact tablet/cloud verification2026-09-05T17:46:24Z passed, and shared actual
  resolver returns expected Standard amounts/price and empty Plus deductions
  at +15MAD. Iced Tea unlinked. Evidence tmp/lemonade-recipe-verification.json.
- Physical18cart/size checks passed again with recipes active: correct totals,
  images loaded, no dialog overflow or console warnings/errors; cart emptied,
  no sale placed. Plus costs/profitability remain provisional until its recipe
  is supplied; zero deduction is an owner-approved temporary configuration.
- Supersedes the pending recipe checkpoint below. Next: await owner next page;
  later obtain Plus quantities, Iced Tea recipe and ingredient purchase costs.

- Owner authorized existing nine Lemonades/Iced Tea, correct Standard/Plus
  sizes, photos and supplied recipes. Preserve IDs, no duplicate products.
- Menu prices32/32/30/30/30/30/25/30/34 MAD; Plus adds15 MAD. Homemade
  syrups are informational, not options. Existing nine Regular sizes and
  prices match; no photos, recipes or ingredients; outbox empty. Read-only
  backup tmp/lemonade-before.json; no production writes yet.
- WhatsApp Excel Lemonades A1:D32 contains eight recipes/31 ingredient rows,
  no Iced Tea recipe and no size-specific quantities. Asked owner whether
  these are Standard amounts and what Plus quantities to use; never derive
  recipe ratios from selling prices. Ingredient prices remain unknown.
- Native research: https://developer.android.com/topic/architecture/data-layer/offline-first
  and https://capacitorjs.com/docs support the existing local-first data layer
  through native SQLite and authenticated reconnect. Data-only catalog work;
  no new native code, app changes or APK rebuild needed.
- Completed photos through shared compressor/authenticated onSave: all nine
  480px,145442binary bytes, original transparent assets preserved. Saved Plus
  before renaming/defaulting existing Regular to Standard, retaining its ID.
  Exact Standard/Plus totals32/47,32/47,30/45,30/45,30/45,30/45,25/40,30/45,
  34/49 MAD. No extras. Evidence tmp/lemonade-webp.json and sizes-applied.jsonl.
- Created17 distinct source-named ingredients through authenticated Stock
  callback/local-first outbox; empty inventory confirmed beforehand. Base units
  gram/millilitre/piece (one Lipton sachet=one piece), zero opening quantity,
  unknown cost, no purchase/stock quantities invented. Source Nestlé and Lait
  concentré kept separate. tmp/lemonade-recipes.json records exact31source rows.
- Production CLI empty-table output is blank with a diagnostic, not JSON [];
  corrected temporary read-only preflight parser before any ingredient write.
  Cloud costStatus omission maps to incomplete in convex/sync.ts; exact check
  follows that existing contract rather than requiring a missing optional field.
- Physical18size/cart checks passed, all images loaded480px with146x100 contain,
  original320px dialog no horizontal overflow. No captured console warnings/
  errors; temporary cart lines removed, empty cart restored, no sale placed.
  Auto-lock interrupted the initial check before actions; reauthenticated and
  reran successfully. Inspected tmp/lemonade-installed.png. No APK required.
- Exact cloud/tablet verification2026-09-05T17:13:23Z:9products,18sizes,
  17ingredients,92totalproducts, prices/images/unknown costs match, pending0.
  Evidence tmp/lemonade-verification.json and lemonade-pos-verification.json.
- NOT COMPLETE: recipe linking awaits owner size-quantity answer. Existing
  resolver defaults missing size quantities to the base recipe, so saving only
  Standard would incorrectly assume Plus has identical deductions. No recipes
  activated. Exact next action: confirm workbook size and Plus amounts, then
  use existing onSaveRecipe with fresh IDs/revisions and explicit per-size
  quantities for eight products; verify immutable recipes/local/cloud and
  resolved stock amounts without placing a production sale. Iced Tea still
  needs its recipe. No app code or unrelated menu page changed.
- Photo/size/ingredient delivery and pending-recipe record pushed as
  `44c4cd8b68ba63f08e0e0cd45002457922f85cf3` on origin/main.

### Current checkpoint — 2026-09-05 Brioche menu (POLISH-01)

- Owner requested the three brioche products and recipes if provided in Excel.
  Menu: Spicy Tuna34, Shrimps Parm Brioche49, Morning Version32 MAD; no extras.
- Read-only supplied WhatsApp Excel recheck: no brioche/tuna/shrimps/morning
  products among all workbook products. Menu descriptions list ingredients but
  no quantities, so do not create invented recipes, stock amounts or prices.
- Existing three exact product keys/prices matched; no photos saved. Backup
  tmp/brioche-before.json. Prepared existing output/brioche-transparent-images
  with the same approved shared compressor:384px, total65906 binary bytes,
  <=32768 characters each. Originals untouched. Contact sheet inspected against
  source menu. Shared native/WebView boundary unchanged; data-only, no APK build.
- Completed photo-only save through authenticated existing callback/local-first
  outbox. Exact production/tablet check at2026-09-05T16:58:00Z: three photos,
  prices and active Regular sizes match, no extras/recipes invented,92 products
  total, zero pending operations. Evidence tmp/brioche-verification.json.
- Physical POS: all three whole photos load in approved146x100 contain boxes;
  each adds directly at34/49/32 MAD, no options dialog. Removed each temporary
  cart line, empty cart restored, no sale placed. No captured console errors/
  warnings. Inspected tmp/brioche-installed.png; no clipping or overlap.
- Delivery record pushed as `27b4722b9a172e1a0f1672a043b7c42e5efa66dc`
  on origin/main. Next: await owner review/next menu page.

### Current checkpoint — 2026-09-05 Croissant menu (POLISH-01)

- Owner requested existing nine croissants, both menu extras, approved WebP
  compression, tablet/cloud persistence, and recipes only if supplied in Excel.
- Read-only tablet inspection: nine existing exact croissant keys, all menu
  prices correct (32/32/22/25/30/22/25/18/20 MAD in menu order), active Regular
  sizes match, no saved photos. Backup: tmp/croissant-before.json. No writes yet.
- Read the supplied WhatsApp OLASO_Fiche_Technique_Boissons.xlsx with bundled
  openpyxl read-only: Ice Drinks, Hot Coffee, Frappé, Lemonades, Matcha, Toutes les
  boissons; no croissant or Magnum recipe rows. Do not invent ingredient amounts.
- Owner confirmed at most one extra, neither selected by default. Added one
  optional single-choice Extras section to each existing croissant: Soft Ice
  Cream +20 MAD, Magnum +25 MAD. No recipe/effect quantities fabricated.
- Owner identified the transparent set. Initial raw previews misleadingly showed
  hidden RGB background colours; alpha-composited contact sheets confirmed
  output/transparent-product-images as the distinct menu-matching set. Visually
  inspected all nine against the menu; no regeneration or original overwrite.
- Reused the installed shared WebP compressor and authenticated local-first
  callback/outbox for all nine photos. 384–480px, 206706 total binary bytes
  (~202 KiB), each data URL <=32768 characters. No app code/layout/native changes
  or rebuild; same previously researched and physically accepted WebView path.
- Exact tablet/cloud check 2026-09-05T16:27:39Z: all nine photos, menu prices,
  optional single selections and 18 extra values match; 92 products total,
  zero pending operations. Evidence: tmp/croissant-verification.json.
- Physical POS checked every croissant: none -> Soft Ice Cream -> Magnum ->
  none; each price correct, never two selected, popup remains 320px without
  horizontal overflow. All nine photos loaded, no captured console warnings/
  errors, no sale placed. Screenshot tmp/croissant-installed.png. Owner visual
  acceptance of this page remains pending.
- Data-delivery journal/menu decision pushed as
  `f4118faa426cafd1893943ede3d2a5d6097eed4f` on origin/main.
- Visual closeout caught a display defect: ProductCard uses object-fit: cover
  in a 72x92 portrait box, cropping wide croissant photos. OrderItemCard shares
  the same problem. Pause closeout to change only cover -> contain in both;
  preserve every image box/card/text/button coordinate. Small check:pos guard.
- Native research before display fix: Android WebView guidance
  https://developer.android.com/develop/ui/views/layout/webapps/webview and
  Capacitor https://capacitorjs.com/docs retain rendering in WebView CSS; MDN
  https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/object-fit
  documents contain vs cover. No Kotlin/plugin needed. Frontend-design skill
  used narrowly to preserve the approved geometry; no redesign.
- Display-fix checks passed: check:pos, check:css-scope, production TypeScript/
  web build, Android checks/JVM tests/package and deployment. Installed via
  adb install -r. No structural code change; Graphify refresh not required.
- Physical recheck after install: all nine images loaded with contain and
  unchanged 72x92 boxes, all nine extras none/soft/magnum/none pass again.
  Cart photograph contains the whole croissant in unchanged 60x76 box; temporary
  Pistachio Kunefe + Magnum total57 verified and removed, empty cart restored.
  No sale placed. Local/cloud verification repeated 2026-09-05T16:32:54Z, zero
  pending operations; screenshot tmp/croissant-installed.png inspected.
- Complete-photo fix pushed as `00c4aed8270897aecc8eff714632f4d779e2de60`
  on origin/main. Owner reviewed and requested larger photos for ALL products.
- Current follow-up: enlarge only ProductCard photo box to146x100 at14,6;
  retain contain, 174x162 card, text and add-button positions. Original image
  files/compression/cloud data unchanged. Same native/CSS research applies.
- Completed: check:pos and production build/Android checks/JVM tests/package
  passed; installed via adb install -r. Physical all-four-category check covers
  92 products: loaded images, contain, 146x100 photo box, unchanged174x162 card,
  image bottom above text/add button, no overlap or console warnings/errors.
  Client-rectangle assertions allow0.1px for WebView transition rounding.
- Rechecked all nine croissant options/prices after install; screenshot
  tmp/croissant-installed.png visibly confirms large full croissants and ice
  creams. No image recompression or database changes for this size follow-up.
- Enlarged image framing pushed as
  `45102fffd1779b9befedaddc2a88192cbaf354fd` on origin/main. Await owner review.
  Recipes remain pending owner ingredient quantities.

### Current checkpoint — 2026-09-05 WebP photo refinement (POLISH-01)

- Owner approved WebP with less compression for the 11 ice-cream photos and
  the normal upload compressor. Preserve existing products, layout and extras.
- Pre-implementation research: Android image-size guidance
  https://developer.android.com/develop/ui/views/graphics/reduce-image-sizes
  and WebP https://developers.google.com/speed/webp/docs/compression confirm
  lossy WebP supports transparency and quality/size tradeoffs; compare originals,
  not already compressed photos. Capacitor https://capacitorjs.com/docs keeps
  the existing canvas work in the Android WebView. No native plugin change.
- Use existing shared compressor (Ponytail), 480px maximum without upscaling,
  quality 0.94/0.90, bounded smaller dimensions, 32768-character data URL ceiling.
  Accept legacy JPEG in both validators and retain field names.
- Original-source measurement found alpha detail forced some WebPs back to
  320px under the proposed cap. Retain the existing white compositing (no visual
  background change) instead: measured 384–480px at 0.94/0.90 below the cap.
- Compressor/local-catalog checks passed. Legacy check:management stopped at its
  missing test PIN gate before any reseed; do not supply it on the production
  workspace. Added isolated checks of the actual bundled cloud validator instead,
  with no database changes; these passed.
- Completed: compressor/local-catalog/isolated actual cloud-validator checks;
  production web build, Android checks/JVM tests/assembly and Convex deployment
  to befitting-fox-181 passed. Installed with adb install -r (data preserved).
- Rebuilt all 11 photos from originals with the shared compressor; 384–480px,
  229492 total binary bytes (~224 KiB), largest data URL 31615 characters.
  Original and JPEG backups remain in ignored tmp; no original asset overwritten.
- Saved only photos via authenticated ProductEditor callback/local-first outbox;
  synchronized through the existing worker. At 2026-09-05T16:18:26Z exact local/
  cloud images and unchanged prices/extras verified for all 11, 92 total products,
  zero pending operations. Evidence: tmp/icecream-webp-verification.json.
- Physical installed manual file-input checks matched batch output exactly for
  Vanille Madagascar / Yogurt and Espresso; restored draft, never saved a test
  change or placed an order. POS displays all 11 WebPs at expected dimensions,
  no captured console errors/warnings. Screenshot: tmp/icecream-webp-installed.png.
- Owner physically accepted: "they look crisp ... very, very good, I like them."
  No UI/layout changes or structural code changes (Graphify refresh not needed).
- Completed and pushed as `745ace62ca7038965ed2ec6c8c02314e9f12d3dc`
  (`POLISH-01: improve product photos with high-quality WebP`) on `origin/main`.
  Next: await the owner's next menu page/instruction.

### Goal 06 — Production Hardening, Release, and Acceptance

**Status:** active

**Branch:** `main`

| Card | Status |
| --- | --- |
| LOCAL-01 — Shared local-first management identity/outbox/sync foundation | done — `0c7da7d63c293c4d96b5c28d8425210c6f9cc8b8` on `origin/main` |
| LOCAL-02 — Local-first catalog and recipes | done — `1cfbf92fe6df3c8d6a8ee2065f60dafdad041d29` on `origin/main` |
| LOCAL-03 — Local-first inventory, expenses, and compensation | done — `1105de62d8133448b7202dd67971ee83c56ced12` on `origin/main` |
| STAFF-01 — Offline staff creation and protected initial PIN | done — `9754897f4be65ffca1b572140e44fc229cad948f` on `origin/main` |
| CATALOG-01 — Offline category artwork | done — `43c9e4a3ed169ae7a07344f9587a51f65051e203` on `origin/main` |
| LOCK-01 — Role-safe Lock / Switch staff | done — `4486a8921d893e3e5edce098b8a17a500cf0a537` on `origin/main` |
| LOCAL-04 — Offline management closeout | done — `7f240210c2a591649f7fabd3c3fe51fb9db72df3` on `origin/main` |
| DELETE-01 — Safe permanent category/product/ingredient/staff deletion | done — `dc86855798041f1e772a7ca3d8729841549faa9d` on `origin/main` |
| HARD-01 — Physical startup/navigation baseline | done — `0e0042aeb2da5f9df534fa0f5184d176965d3f8d` on `origin/main` |
| NAV-01 — Retained smooth navigation | done — `4890e9f6055cbb1b52a2ab1402576bf4f14adf05` on `origin/main`; owner-reported category-image root fix physically verified |
| HARD-02 — Branded Android launch and approved-artwork app icon | done — `632dc101258ac3226eb24f1041afe7faed2aa78c` on `origin/main` |
| HARD-03 — Safe startup gating and lifecycle readiness | done — `590c9cecfe485cd7debb28abd08d3310cd0079aa` on `origin/main` |
| HARD-04 — Measured performance (assets, modules, sync scheduling) | done — `cce0ebf73143b6feff72bcd33534a96804fb8512` on `origin/main` |
| HARD-05 — Backup and recovery | done — `625ed2bc115b82c6606f318e3b7400a94b22d7d6` on `origin/main` (export removed + sync queue fix; original export SHA `7698fa52cc6dbfc8df608b70c36a4d9dec9a39a7`) |
| HARD-06 — Signed release and upgrade | done — follow-up `f1f3168c927fae74c47d4d9353e556b7f8fe4870` on `origin/main` (base `87bc12f7480084b6703e16f59f317c63d32249fa`) |
| HARD-07 — Readiness review | done — `bb9279350c95779b1503964bb8dd80d4322c2a3c` on `origin/main` |
| OPTIONS-01 — Product-owned size, choice, and exact-recipe foundation | done — `ebd3ac0a349ad69c8242f5f8718d3bae63652318` on `origin/main` |
| OPTIONS-02 — Custom product choices and independent copying | done — `6f072c64074b85ad958e4a1227fd14854e5afcc9` on `origin/main` |
| OPTIONS-03 — Exact cashier selection, stock, and sale snapshots | done — `3587c3c2c419fe01a9c27bbb3e60ec4cc095e962` on `origin/main` |
| OPTIONS-04 — Ingredient-cost reconciliation and offline closeout | done — `ca7c9540dc29f7778f63d3f73bd19ffc7d6c5f00` on `origin/main` |
| SYNC-01 — Convex sale snapshot schema so POS tickets insert | done — `ecf8500465db6e4c434a60dc991b4a78dd5224db` on `origin/main`; owner Manual Sync 29 Aug landed 0826-0001…0017 plus category delete; 0826-0018 auto-synced; [goals/GOAL-06-SALE-SYNC.md](goals/GOAL-06-SALE-SYNC.md) |
| SYNC-02 — Failed management must not hide later sales | done — `d5c87b0e31f7be4c6933390568683f3d15179330` on `origin/main` |
| SYNC-03 — Reconnect must not skip sales after management processed | done — `31eb5fce8d7897b3525c5657b60f222a8d033fe8` on `origin/main` |
| SYNC-04 — Sale failure classification / automatic retry | done — `8c656caeac92918404082975194d2196063e332e` on `origin/main` |
| SYNC-05 — Permanent abandon only for true conflicts | done — `b5a0577c348e89be82125a2ce63a29f2b0ca4bff` on `origin/main` |
| SYNC-06 — Orders retry vs management parent | done — `79b10d6555fb5e529d806e575677e7af4cbf1ced` on `origin/main` |
| SYNC-07 — Settings waiting count/copy | done — `91a71642629fe36f39750955a92cb53543f80377` on `origin/main` |
| SYNC-08 — Manual Sync silent no-op when worker gated | done — `0379d0c1011a8a820d71a9ac173e0e85bd7d4942` on `origin/main` |
| SYNC-09 — Online Dashboard/Reports vs unsynced then synced sales | done — `590696ebe2ebd6776fec144bc4950808621242e0` on `origin/main` |
| POLISH-01 / POLISH-02 — Final owner-led UI review and polish | in progress — PR-01 through PR-04, AUDIT-01, AUDIT-02, and RECEIPT-01 done on `origin/main`; AUDIT-03 remains deferred for the owner-directed bug audit |
| HARD-08 — Final endurance and acceptance | pending |

### 2026-09-05 — POLISH-01 Soft Ice Cream batch checkpoint

- Image-quality follow-up verified: owner explicitly approved replacing blurred
  photos from originals and using the same improved internal upload compressor.
  Shared helper now tries 320px at JPEG 0.86/0.78, reducing dimensions only to
  satisfy the unchanged 16384-character local/cloud limit. White alpha
  compositing is now shared, high-quality downsampling, no upscaling, bitmap
  cleanup in finally. No UI/layout or price/recipe/extra changes.
- Native research before implementation: Android WebView guidance
  https://developer.android.com/develop/ui/views/layout/webapps/webview and
  https://capacitorjs.com/docs support keeping this existing canvas/image work
  in the WebView; native file picker, SQLite, and network boundaries unchanged.
  Ponytail: reuse the shared helper and native canvas; no packages or new native
  layer.
- All 11 originals retain a 320px longest edge at higher quality within the
  existing cap; total binary JPEG bytes 121616 (~119 KiB), maximum data URL
  15843 characters. Comparison `tmp/icecream-hq-comparison.jpg` visually checked,
  including corrected Mango/Espresso file pairing. Regenerated using the exact
  shared source helper, with no extra preprocessing implementation.
- Photo-only batch saved via authenticated normal product callbacks, preserving
  IDs, prices, sizes, extras, recipes and stock. Post-install exact local/cloud
  assertion at 2026-09-05T15:42:15Z: 11 matching photos/extras, 92 total products,
  empty outbox. Evidence `tmp/icecream-hq-verification.json`; guarded before/new
  data in `tmp/icecream-hq.json` and save journal in `tmp/icecream-hq-applied.jsonl`.
- `check:product-image` covers dimension/quality preference, bounded fallback,
  no upscale, white alpha compositing, rejection and bitmap cleanup.
  `check:local-catalog`, production TypeScript/Vite/JVM/build pass; installed
  production APK with `adb install -r` Success. Physical upload-input change
  test ran the installed app's actual compressor for two originals and matched
  batch bytes exactly. Restored original draft photo; never pressed Save during
  that test. No captured console errors/warnings.
- Physical POS shows all 11 photos at natural longest-edge 320px; screenshot
  `tmp/icecream-hq-installed.png` visually checked. Narrow 320px popup and
  optional extra 20 -> 40 -> 20 behavior unchanged; no test sale created.
  No runtime modules added/moved; existing Graphify query used for the shared
  compressor path. Next: owner visual acceptance, then next menu page.
- Image-quality implementation and verification pushed to `origin/main` as
  `b155032913cee6e3aa63d528666ed858bd1f1608`.

- Owner correction (latest): rejected the broader popup restyling. Restore all
  original CSS from before `78e48f0`, changing only width from 560 to a
  viewport-bounded 320px. Keep the independent optional-deselection logic fix.
  This supersedes the 420px/content-sized-row presentation below. CSS-only
  WebView change; prior Android/Capacitor boundary research remains applicable,
  original 44px targets retained per DESIGN.md. `git diff f4015cb` confirms the
  stylesheet differs from the original by its width declaration only.
- Width correction verified: production build/JVM checks, `check:css-scope`,
  and `check:pos` pass. Installed with `adb install -r` Success and verified on
  Galaxy Tab A9 at 1340x800: 320px dialog, original full-width ~270px option,
  original ~44px row, wrapped title, visible footer, no horizontal overflow or
  captured console errors. Screenshot `tmp/icecream-popup-original-320.png`.
  Select/unselect remains 20 -> 40 -> 20 MAD; no order or catalog writes.
- Width-only correction committed and pushed:
  `dbc476e3f0babc529e3910123597439e37b0f283` on `origin/main`.

- **Latest verified state:** all 11 exact existing Soft Ice Cream products now
  have their compressed photos and optional Croissant +20 MAD in both tablet
  SQLite and production `befitting-fox-181`. Exact image equality, prices,
  one extra per product, default=false, min=0/max=1 verified after APK update
  at 2026-09-05T15:16:30Z. Outbox empty; total catalog remains 92 products.
  No recipes, ingredient prices, stock, sales, or other menu pages changed.
- Popup fix built with `npm run android:production` (production endpoint
  verified), JVM checks/build successful, and installed using `adb install -r`
  with Success. Physical Galaxy Tab A9: 1340x800 screenshot
  `tmp/icecream-popup-installed.png`; dialog width ~420px, Croissant row ~189px
  wide/~48px tall, no horizontal overflow. Optional checkbox select/unselect
  verifies 20 -> 40 -> 20 MAD, no sale created; attached CDP console warnings/
  errors empty. POS category has 23 products, 11 loaded JPEG photos as intended.
- Checks: `check:pos` (added real-handler optional toggle regression),
  `check:css-scope`, `check:product-configuration`, production TypeScript/Vite
  build, Android JVM/build, and post-install exact local/cloud data assertions
  pass. Existing build-tool warnings remain (jeep-sqlite crypto externalization,
  Gradle flatDir/SDK metadata); no new browser errors observed. No structural
  application files added/moved, so no graph regeneration needed.
- Scoped follow-up complete: implementation and evidence committed as
  `78e48f0adc9497b1711cc40454446115623aa474`, pushed to `origin/main`.
  Next owner review: compact popup and soft ice cream
  images, then select the next menu page. Other Bakery & Desserts products
  intentionally still use their existing images/fallbacks.

- Owner now authorizes agent unlock after automatic locking. Batch resumed:
  all 11 local image/extra saves complete. Explicit existing sync runs are
  draining the ordered dependency chain before final cloud verification.
- Popup follow-up research: Android accessibility guidance recommends retaining
  large touch targets (https://developer.android.com/guide/topics/ui/accessibility/views/apps-views);
  Capacitor remains the existing WebView boundary (https://capacitorjs.com/docs).
  This is React/CSS presentation and selection state only: no native plugin,
  storage, lifecycle, or backend changes. Frontend design and React guidance
  used to preserve existing tokens and event-owned state, with no new dependencies.
- Narrow popup from fixed 560px to viewport-bounded 420px; content-sized option
  pills, 48px minimum row height, wrapping names and non-wrapping prices. Also
  correct optional max-one selection so it can be unticked; required choices
  remain radio selections. Verification/install still pending.

- Follow-up with owner-unlocked Products: prepared all 11 images using the
  actual app compressor, preceded by a white background matching POS cards
  because direct JPEG conversion makes these transparent PNGs black. Total
  compressed JPEG bytes: 23011; largest data URL: 3095 characters. Contact-sheet
  inspection caught reversed source filenames: `mango.png` is espresso brown,
  `espresso.png` is mango yellow. Corrected the prepared pairing without changing
  original files. Prepared inputs/backups: `tmp/icecream-prepared.json`.
- Batch called existing authenticated editor save callbacks, no clicks and no
  direct SQLite writes. Tablet locked again mid-batch. Read-only verification:
  Vanille Madagascar / Yogurt, Dulce de Leche and Kunefe Pistachio have image
  plus optional Croissant locally; Oreo Hazelnut has image only. Other seven
  untouched. Cloud verified Vanille image and extra only at this checkpoint;
  five operations remain safely pending, none failed. Do not claim full sync.
- Resume script `tmp/icecream-apply.mjs` skips exact completed image/choice
  saves and completes partial records under current revision guards. Next:
  owner unlocks Products again; reinitialize editor access with preflight,
  resume batch, then verify all 11 local/cloud records, option values, and
  empty pending outbox. Compression does not need repeating.

- Owner approved editing the 11 existing Soft Ice Cream products, preserving
  their menu prices and the combined Vanille Madagascar / Yogurt listing,
  adding optional Croissant +2000 centimes (not selected by default), and using
  compressed existing images. No recipes are supplied for this page.
- Owner explicitly requested a batch, not tablet clicks. No catalog data or
  application source was changed in this checkpoint. Read-only production
  inspection of `befitting-fox-181` confirms all 11 exact
  `bakery-desserts-soft-ice-*` keys exist at the expected prices, revision 1,
  with no saved imageJpeg. Do not match Espresso by name alone.
- Existing save path is `useProductManagement` to `saveLocalProduct` /
  `saveLocalChoiceSection`, then the ordinary management outbox. Preserve its
  transaction, revision, permission, and synchronization checks; never write
  SQLite directly or introduce a deployment authorization bypass.
- Batch preflight found the tablet locked and document hidden; no authenticated
  product-management save callbacks were mounted. A subsequent read-only
  connection timed out. Do not unlock, wake, navigate, or rewrite the locked
  local database behind the owner's no-click request.
- Temporary diagnostic scripts: `tmp/icecream-batch.mjs` (preflight only) and
  `tmp/icecream-compression-check.mjs` (compression preview only). Neither has
  applied updates. The compression preview did not complete. Current compressor
  uses max 96 pixels, JPEG qualities 0.62/0.45/0.32 and max 16384 characters.
  Source pistachio image was visually inspected; check transparency/background
  in an actual compressed preview before uploading any of the 11 images.
- Next: owner opens/unlocks the existing Products screen and keeps it awake;
  re-read current local targets/pending operations and production revisions,
  finish image preview, then batch normal authenticated saves and verify each
  local/cloud image and optional extra. No product recreation, no recipes,
  no stock/cost invention, and no APK install needed for this data-only work.

### 2026-09-04 — POLISH-01 catalog sellability repair

- Production review found 92 active products but just two active size records:
  V60 alone had Hot/Cold, so the other 91 visible products could not be placed
  in the POS cart. Checkout requires a real selected size; it was not a mock
  product issue.
- Created the missing active `Regular` size in production at each product's
  existing price, leaving V60 unchanged. The temporary maintenance endpoint was
  removed and production redeployed immediately after the one-time repair.
- `c14b303` now makes every newly saved product create that same active default
  size in its single local transaction and synchronizes the size after its
  product. Focused catalog/POS/product-configuration checks and the Android
  beta build pass. The beta was installed over the existing tablet data. A
  read-only tablet database copy now confirms 92 active products, 93 active
  sizes, and zero products without an active size.
- Four category-art assets were replaced with bolder, compact offline artwork
  under their existing artwork keys. The application remains locked, so the
  visual card and add-to-cart proof is pending owner unlock; no PIN, sale, or
  test product was used.

### 2026-09-04 — POLISH-01 production client recovery

- Root cause was not missing production data: production has 92 real-menu
  products, while the installed tablet APK was bundled with the development
  Convex endpoint, whose old catalog has 15 products. The normal authenticated
  refresh correctly replaced the local cache with that wrong source, which also
  made a retained production product invalid at checkout.
- Added the explicit `android:production` command. It has Convex provide the
  production URL during deployment, builds/syncs the Android web assets with
  that URL, verifies the resulting bundle contains it, then packages the APK.
  `android:beta` remains development-only and must never be installed as a
  client update.
- Before reset, verified the tablet outbox was empty and saved a recoverable
  copy of its wrong local database under ignored `tmp/`. Installed the protected
  production APK with `adb install -r`, then cleared only `com.olaso.pos` local
  data. Production cloud data was not changed. Fresh launch showed Yassine;
  authenticated refresh restored 4 categories, 92 products, and 93 active
  sizes. Espresso added to the cart at 10 MAD and was removed without an order.

## Most Recently Completed Goal

### Goal 05 — Business Policy, Identity, and Permissions

**Status:** complete

**Goal branch:** `codex/goal-05-policy-identity-permissions`

| Card | Status |
| --- | --- |
| POLICY-01 — Confirm and record the owner decision matrix | done — `eafe2d3e6603cbf5957c548b5e83473da05465df` on `origin/codex/goal-05-policy-identity-permissions` |
| ID-01 — Define the production identity, offline session, lock, recovery, and threat model | done — `682f64d16f51a0276700eb16f2e6a4b9a07e3cc9` on `origin/codex/goal-05-policy-identity-permissions` |
| ID-02 — Add production identity/session persistence and remove production authorization override | done — `f7f3aea090101e30ad09dba3d556a1aa3c58eadc` on `origin/codex/goal-05-policy-identity-permissions` |
| PERM-01 — Enforce role permissions and sensitive-data return boundaries | done — `2ec1a0a4cbb5c6f0632347355e2c6bcb6a07aa7a` on `origin/codex/goal-05-policy-identity-permissions` |
| POLICY-02 — Implement confirmed tax, payment, receipt, customer/table, and language policy | done — `2bab5512e5d7e9ccb6cfb54a13f79a0ed58654f8` on `origin/codex/goal-05-policy-identity-permissions` |
| ORDER-01 — Implement authorized cancellation/refund corrections and reversals | done — `eedbcc04d5e8cad91e3bac92e0acc7419a1d0f59` on `origin/codex/goal-05-policy-identity-permissions` |
| ID-03 — Verify offline session, lock, restart, recovery, and failed-access behavior | done — `fa132a8c4a5b82f2114f430b25718bcada5593de` on `origin/codex/goal-05-policy-identity-permissions` |
| POLICY-03 — Run policy, security, regression, tablet, documentation, and push closeout | done — `6f4c6a28d4015f43f22f4f9691147ecfa761ea95` on `origin/codex/goal-05-policy-identity-permissions` |

## Earlier Completed Goal

### Goal 04 — Costs and Profitability

**Status:** complete

**Goal branch:** `codex/goal-04-costs-profitability`

| Card | Status |
| --- | --- |
| COST-01 — Add exact cost primitives, schema/migration plan, indexes, and deterministic cost fixtures | done — `9750fbc299f9b9b1770fd021352a3708b29dd7ba` on `origin/codex/goal-04-costs-profitability` |
| COST-02 — Add retry-safe ingredient purchases and weighted-average inventory valuation | done — `6b2a0208254f03327cbb84aa6f5f9e36b4cdf018` on `origin/codex/goal-04-costs-profitability` |
| COST-03 — Connect package-based receiving, valuation, and purchase history to Stock | done — `bfe73a67062e95de0127fe0ea42b0a981bb15314` on `origin/codex/goal-04-costs-profitability` |
| COST-04 — Show complete/incomplete recipe and product costs, gross profit, and margin | done — `551856a3c3e35c057ca70d91e23667831a33c2a5` on `origin/codex/goal-04-costs-profitability` |
| COST-05 — Save and synchronize immutable offline sale-cost snapshots and correction reversals | done — `1e7b225ad57b4a69b8776b7f39f08c549115b73e` on `origin/codex/goal-04-costs-profitability` |
| COST-06 — Add staff profiles and owner-only effective compensation periods | done — `1c6e5e465e427ec8f3728dec73f257533ba00388` on `origin/codex/goal-04-costs-profitability` |
| COST-07 — Add validated one-time and recurring operating expenses | done — `850070d87a42e39a40ebc2e1b5b76ab61058c9df` on `origin/codex/goal-04-costs-profitability` |
| COST-08 — Add the bounded monthly Costs and Profitability report | done — `84307050515d65bc9d710f771dafdd734003d4ff` on `origin/codex/goal-04-costs-profitability` |
| COST-09 — Run full regression, security/quota review, tablet QA, documentation closeout, and final push | done — `0095c37a3916759388189897bdca132654198604` on `origin/codex/goal-04-costs-profitability` |

## Earlier Completed Goal

### Goal 03 — Production Checkout and Android LAN ESC/POS Printing

**Status:** complete

**Goal branch:** `codex/goal-03-printing-integration`

| Card | Status |
| --- | --- |
| PRINT-01 — Preserve and lock the accepted receipt laboratory baseline | done |
| PRINT-02 — Prove and document the physical LAN endpoint and failure behavior | done |
| PRINT-03 — Add minimal Android LAN transport, settings, and test print | done |
| PRINT-04 — Add the saved receipt model and deterministic WD8260 encoder | done |
| PRINT-05 — Add and verify one-time printer-resident logo provisioning | done |
| PRINT-06 — Connect post-commit first print and persisted print state | done |
| PRINT-07 — Add Orders reprint and restart/disconnect recovery | done |
| PRINT-08 — Run endurance, regression, hardware, documentation, and push closeout | done |

## Planned Goals

- [Production delivery plan](PLAN.md) — canonical remaining goal order, all
  card IDs, dependencies, and universal automated/browser/Android/physical
  tablet/printer completion gates.
- [Goal 06 — Production Hardening, Release, and Acceptance](goals/GOAL-06-PRODUCTION-HARDENING.md)
  — final normal-conversation phase containing complete local-first management,
  retained smooth navigation, category/staff/lock completion, measured startup,
  recovery, signing, upgrade, security/quota, then the owner's final manual
  screen review, approved simplification, endurance, and acceptance.
- [Goal 06 — Sale-sync ledger](goals/GOAL-06-SALE-SYNC.md) — SYNC-01 through
  SYNC-09 done; tablet POS sales insert into Convex; online Dashboard/Reports
  stay Convex-only. Exact next action is POLISH-01.
- [Goal 06 — POLISH Reliability Ledger](goals/GOAL-06-POLISH-RELIABILITY.md)
  — permanent PR-01 through PR-04, AUDIT-01, AUDIT-02, and PR-05 repair
  authority. Its complete Recovery Protocol, State Pointer, active card, and
  newest checkpoint must be reread after every context compaction, handoff,
  pause, or resumed session.
- [Goal 06 — Product Configuration Blueprint](goals/GOAL-06-PRODUCT-CONFIGURATION.md)
  — approved product-owned sizes, freely named choices, exact ingredient
  effects, mandatory independent copying, honest ingredient-only costing,
  offline migration safeguards, and OPTIONS-01 through OPTIONS-04 contracts.
- [Olaso Real Menu Extraction](goals/OLASO-REAL-MENU-EXTRACTION.md) — factual
  transcription of all seven owner-supplied menu images: 92 priced listings,
  source categories, sizes, milk types, syrups, extras, badges, stated brioche
  ingredients, proposed app mapping, and confirmations required before import.

## Current Checkpoint

- Profile-performance attribution repair (5 Sep 2026): the owner found that
  pre-feature sales printed under their saved local profile but appeared as
  `Unattributed` on the online Reports card. The cloud daily metric predates
  profile IDs, while the matching local immutable sale retains the actor ID.
  The report now keeps cloud aggregate finance data and uses the local profile
  breakdown only when orders, units, and net sales agree exactly. The focused
  offline regression, TypeScript, and production web build pass; no cloud data,
  tablet, sale, profile, or PIN was touched. Committed and pushed as
  `ff2c5fa86fced248cd032c21630212c5e4b81aa8`
  (`POLISH-01: preserve historical profile attribution`) on `origin/main`.
  The production-connected APK is packaged and ready; exact next action:
  install only with owner approval.

- Profile performance accounting (4 Sep 2026): owner approved a proper
  staff-sales report, not a score. A completed sale counts once for its
  authenticated profile regardless of Cash/Card tender splits; cancellations
  reverse the same profile, and older records with no profile ID are explicitly
  `Unattributed`. The Sales profit card now uses its reserved gap for an
  internally scrolling profile list while Operating Profit remains fixed. The
  printed owner daily report now groups product sales under each profile and
  preserves an overall total. Development and production Convex functions are
  deployed; focused offline/local/printing/TypeScript/CSS/build and production
  package checks pass. Protected cloud sales/report checks stopped before their
  seed/reset at the intentionally absent disposable test PIN. No tablet, sale,
  profile, or PIN was touched. Committed and pushed as
  `30e655728d3b85abd03393fa2477379ca1118ba9`
  (`POLISH-01: add profile sales reporting`) on `origin/main`. Exact next
  action: owner-led install and visual/printed acceptance.

- Owner-directed profile/PIN reliability audit (4 Sep 2026): traced creation,
  pending provisioning, online/offline unlock, retry, lockout, PIN replacement,
  protected storage, reconciliation, deletion, restart, and update survival.
  Found four shared defects: separate asynchronous protected writes could leave
  mixed credential state; a corrupt protected copy blocked online recovery; a
  PIN replacement retained cloud lockout attempts; and a creation retry after
  changing a waiting profile's PIN retained the first cloud credential. The
  repair uses one checked encrypted native commit per profile, permits online
  re-provisioning of a corrupt cloud profile while pending/offline profiles
  fail closed, clears cloud/offline attempts and other sessions on PIN change,
  and makes creation retry adopt the latest protected credential. Add-staff and
  Change-PIN dialogs also block close/double-submit while saving. Production
  identities and PIN values were not modified. Focused identity/local staff/
  Settings/Android checks, Convex codegen/typecheck, TypeScript, web build, and the full
  140-task Android beta passed. The destructive development cloud regression
  stopped before reset because its required disposable owner PIN is absent and
  was not bypassed. The first Android build caught nullable native bundle input;
  that boundary was corrected and the complete rebuild passed. Normal Graphify
  refresh stopped without changing the graph because 144 non-code files require
  an unavailable semantic key; the supported code-only refresh passed at 3,087
  nodes / 6,132 edges. Committed and pushed the repair as
  `3172e9b3f42a782794113e340e76aa1a0a0c974c` (`POLISH-01: harden staff
  credential lifecycle`) on `origin/main`, then deployed the matching backend
  to production `befitting-fox-181`. Installed version 1.1 over the connected
  tablet with `adb install -r`, preserving production data. Physical 1340 by
  800 evidence confirmed Yassine remained listed, the existing PIN unlocked
  online, all four categories and 92 products remained, and the same saved
  profile unlocked after a full app restart with Wi-Fi disabled. Wi-Fi was
  restored and validated; focused logcat contained no fatal, secure-session,
  database-lock, or Chromium crash error. Exact next action: run the complete
  two-profile create/sync/restart/offline/PIN-change matrix only when a
  disposable test profile and safe test credential are explicitly authorized.

- First production setup and POS catalog follow-up (4 Sep 2026): deployed the
  current Convex schema/functions to production `befitting-fox-181`, created
  exactly one active owner named Yassine, established the owner-supplied
  credential through a temporary recovery gate, and immediately removed that
  gate. Production now has four editable categories and all 92 products:
  Coffee 23, Matcha 27, Cold Drinks 19, and Bakery & Desserts 23. V60 alone
  received its explicit Hot 45 MAD / Cold 55 MAD sizes; unconfirmed milk,
  syrup, extra, badge, and recipe details were not invented.
- Built and installed a production-connected debug beta on SM-X115
  `R8YX91AKWXJ`. Only `com.olaso.pos` app data was cleared after the owner said
  the development data was disposable; that old local test data is not
  recoverable from the app. The clean tablet showed only Yassine, authenticated,
  synchronized all four categories/92 products, and rendered with empty focused
  console/logcat output. Settings showed the new Change PIN row/dialog without
  clipping; no PIN change was executed during QA. This is a testing beta, not
  the final signed client release.
- Owner then reported faint/colliding category artwork and unreachable lower
  product rows. Root causes were the inactive artwork's hardcoded 0.16 opacity,
  shared artwork/title space, and a fixed 502-pixel grid with no vertical
  overflow. The minimal repair raises inactive art to 0.46, reserves a narrow
  left text column so Bakery & Desserts wraps away from the right-side art, and
  makes the uniform five-column grid vertically scrollable without moving the
  cart or page. `check:pos`, TypeScript, build, and `git diff --check` pass;
  Graphify refreshed code-only to 3,080 nodes / 6,116 edges. The repair was
  committed and pushed as `31e57f2e09d335bf06cd4096288590770455fe1c`.
  Production was redeployed, the beta was rebuilt and installed over the app
  without clearing data, and direct 1340 by 800 tablet inspection confirmed
  stronger category art, a two-line Bakery & Desserts title clear of its art,
  and a working product-grid swipe that reaches the final Coffee row including
  V60. The order panel stayed fixed and focused logcat remained empty. Exact
  next action: owner visually accepts the installed result or gives the next
  POLISH-01 adjustment.

- Owner-directed staff PIN management (4 Sep 2026): added an owner-only
  `Change PIN` action to every Staff & access row, including the active owner
  and a locally waiting profile. Provisioned profiles send only a PBKDF2
  salt/hash to Convex, update the profile-scoped protected offline verifier,
  clear failed attempts, revoke the target's other cloud sessions, and retain
  the current owner's authenticated tablet session when changing their own
  PIN. Waiting profiles replace only their protected pending credential. No
  raw PIN enters SQLite, the ordinary outbox, source, or Git. Android Keystore
  and the existing Capacitor protected-storage plugin remain the correct native
  boundary; no Kotlin, plugin, dependency, or schema change is needed.
  `check:local-staff`, `check:settings`, TypeScript, the production build, and
  `git diff --check` pass. The protected development permission check stopped
  at its deliberately absent test PIN and was not bypassed. Graphify refreshed
  in code-only incremental mode to 3,078 nodes / 6,114 edges because no
  semantic-extraction key is configured. Exact next action: review, commit,
  push, deploy the functions to the empty production deployment, create the
  owner-specified first profile without storing its raw PIN, then build and
  install the production-connected application.

- Real-menu categories and artwork approved (4 Sep 2026): the owner reduced the
  seven source menu sections to four visible application categories — Coffee
  (23), Matcha (27), Cold Drinks (19), and Bakery & Desserts (23) — while
  retaining all 92 products. Replaced the four existing gallery assets in
  place with the approved coordinated Operational Green editorial artwork;
  each remains a true-alpha 320 by 320 lossless WebP and reuses the existing
  coffee, tea, cold-drinks, and bakery keys. The production catalog and tablet
  data were not changed. Committed and pushed as
  `2113043d82eb37133a9a3127dd36289007e0f406` on `origin/main`. Exact next
  action is owner review in the application before any production menu import.

- Owner beverage technical sheet extracted (4 Sep 2026): the five category
  tabs reconcile exactly to the combined `Toutes les boissons` tab: 181
  populated, non-duplicate ingredient rows covering 50 products and 47 source
  ingredient names. Added
  `goals/OLASO-BEVERAGE-RECIPE-EXTRACTION.md` with every grouped recipe,
  quantity, menu crosswalk, all 42 still-missing menu recipes, and the exact
  names/units requiring owner confirmation. No workbook, application code,
  live menu, stock, recipe, tablet, or cloud data was changed. The existing
  owner-directed audit remains the exact next action.

- RECEIPT-01 report cleanup (3 Sep 2026): owner asked to remove the daily
  report's Terminal text. The whole row is removed. Added exact report-total
  checks for Card + Cash + Cash and Cash + Card + Card: repeated tenders of the
  same method combine by their saved due amounts, while each method counts the
  order once. Passed `check:printing`, `check:offline`, `tsc -b`, `build`, and
  Graphify (3,067 nodes / 6,064 edges). Exact next action: commit/push, rebuild
  and install the corrected beta, then owner prints and checks it.

  Committed/pushed `1a84a3a054d4d6202bea56e75ddbeddd590d5f03` and installed
  the rebuilt beta over SM-X115 with `adb install -r` (`Success`), preserving
  data. Owner tests the report with no Terminal row and both three-tender mixes.

- RECEIPT-01 calculation-layout follow-up (3 Sep 2026): owner approved a
  grouped receipt calculation: Cash received `+`, Change given `-`, and
  `= Cash payment`, with a distinct Card payment and recorded-order headings
  for split tenders. Source and focused scenarios are updated; the first
  printing run correctly required a new golden byte hash. Passed
  `check:printing` (1,013 bytes), `check:pos`, `tsc -b`, and `npm run build`;
  Graphify refreshed to 3,065 nodes / 6,062 edges. Exact next action: review,
  commit/push, then rebuild the beta for the owner to inspect on real paper.
  No app, tablet, printer, PIN, seed, reset, or business data has been touched
  in this follow-up.

  Committed/pushed `c941dbcb55047e67ce65afacd5c9a66682585a09`
  (`RECEIPT-01: clarify tender calculations`) to `origin/main`. `npm run
  android:beta` passed and the resulting debug APK installed over connected
  SM-X115 `R8YX91AKWXJ` with `adb install -r` (`Success`), preserving app data;
  the app was not launched. Owner paper check is now the exact next action:
  cash-with-change, card-only, and mixed Card/Cash receipts.

- RECEIPT-01 direct-card receipt bug (3 Sep 2026): owner reported that the
  installed paper still used the old payment wording. Root cause: direct Card
  checkout bypassed the payment dialog and saved no tender, so the encoder
  used its old no-tender payment row. Every new non-zero direct checkout now
  saves one exact tender; old snapshots now show Cash paid or Card paid plus
  Total paid without inventing unrecorded cash received/change. No data
  migration or Android/printer-transport change. `check:printing`,
  `check:pos`, `tsc -b`, `npm run build`, and `git diff --check` pass; rebuild,
  install-over-update, and owner paper verification remain next. Committed and
  pushed as `4321e0ba8f078ac176e992f2644c0a1d6f2ce803`
  (`RECEIPT-01: save direct payment details`); rebuilt beta installed over
  SM-X115 `R8YX91AKWXJ` with `adb install -r` (`Success`) preserving data.
  No app launch, PIN, reset, seed, printer action, or live-data change
  occurred. Owner paper verification is the exact next action.

- Receipt beta installed for owner testing (3 Sep 2026): rebuilt synchronized
  `main` at `33373fdaea61c29f291d652f9a74ae1f9f05231f` with
  `npm run android:beta` (Android identity,
  Capacitor sync, web build, and APK build passed; only the existing
  jeep-sqlite browser-compatibility warning appeared). Installed
  `android/app/build/outputs/apk/debug/app-debug.apk` over connected Samsung
  SM-X115 `R8YX91AKWXJ` with `adb install -r` (`Success`), preserving the
  existing app data. No uninstall, clear, reset, seed, PIN, launch, app
  interaction, printer action, or live-data change occurred. Owner physical
  test pending: make a mixed Card/Cash receipt and report any finding; keep
  AUDIT-03 deferred and PR-05 pending.

- RECEIPT-01 complete (3 Sep 2026): owner explicitly deferred the SplitRequired test
  task and authorized clear receipt payment wording. The receipt now prints
  TOTAL before a separate payment summary: Card paid; Cash paid; Cash received;
  Change returned; and Total paid (with equivalent French labels). Split
  payments are numbered, so each cash/change pair stays with its own payment.
  It preserves the exact saved tender amounts and the existing raw-ESC/POS
  transport; legacy saved receipts retain their payment-method row when no
  historical amount was recorded. Official Android/Capacitor research confirms
  this belongs entirely in the existing TypeScript receipt encoder, not a
  native printing change.
  `check:printing`, `check:pos`, `tsc -b`, `npm run build`, and
  `git diff --check` pass; the new deterministic receipt is 941 bytes with SHA
  `D8D3CA33889F1101F8624420F539F2BAC54A94008F39E67B025CD383870FD689`.
  No app, tablet, printer, ADB, PIN, seed, reset, or business data was touched.
  Committed and pushed `5e76a9961f904b62c1f9fbc2e8020217c8183fc5`
  (`RECEIPT-01: clarify payment summary`) directly to `origin/main`.
  Exact next action: conduct the owner-directed whole-application bug audit;
  keep AUDIT-03 deferred and PR-05 pending.

- Whole-application safe code audit (3 Sep 2026): follow-up
  `a70c462f8e77162a8875d8c5c0e4d615decfde35`
  (`RECEIPT-01: number split payment rows`) is pushed on `origin/main`; split
  receipt rows are numbered without changing payment data. Graphify-guided
  review plus checkout/printing, local/offline, inventory/costs, staff/lock,
  reconnect, Settings, Android/release, TypeScript, build, and whitespace
  checks found no new confirmed defect. This is not an assertion that physical
  operation is bug-free: protected cloud checks remain PIN/reset-gated and the
  owner performs tablet/printer acceptance. No live data or physical device was
  touched. Exact next action: collect owner physical findings or a reproducible
  failure, then repair only that confirmed issue; AUDIT-03 remains deferred and
  PR-05 pending.

- POLISH-01 mandatory bug repair (3 Sep 2026): owner reported three card
  split-question defects after the compact rework — empty split lists on
  "Yes, split it" (split-fade state never reached `'run'` on that entry path,
  so `.shares` stayed at `opacity: 0`), "No, one payment" reopening the
  single-tender dialog instead of processing immediately, and the in-dialog
  Split button appearing inside the question-entered split popup. Root-fixed
  in `PaymentDialog.tsx` (initial `splitFade='run'` when `startSplit`, Split
  button only when `startSplit !== true`) and `PosScreen.tsx` (`onSingle`
  calls `confirmPayment()` directly); `scripts/check-pos.mjs` gained three
  pinning assertions. `check:pos`, `check:css-scope`, `tsc -b`,
  `npm run build`, `git diff --check` all pass. Pushed as `4615580` on
  `origin/main`; the debug beta was rebuilt with the verified Java 21
  toolchain (Gradle unit tests passed) and installed over connected SM-X115
  `R8YX91AKWXJ` with `adb install -r` (`Success`), preserving data. Owner
  tablet acceptance of the three behaviors is pending. Exact next action:
  complete AUDIT-03 only, push it to `origin/main`, and leave PR-05 pending.

- AUDIT-03 planned from final read-only review (3 Sep 2026): the AUDIT-02
  runtime implementation matches Convex's ordered split contract, but its
  `SplitRequired` fake ignores every received pagination option and returns
  hard-coded responses. The test therefore does not prove the exact cursors,
  `endCursor` bounds, half order, or all totals required by the card. Added a
  test-only AUDIT-03 contract to
  `goals/GOAL-06-POLISH-RELIABILITY.md`; no application code, app, tablet,
  printer, PIN, or business data was touched. Exact next action: complete
  AUDIT-03 only, push it to `origin/main`, and leave PR-05 pending.

- AUDIT-02 + split-question build installed (3 Sep 2026): rebuilt the debug
  beta from synchronized `main` (AUDIT-02 pagination safeguards and the
  compact Card-only split question included) and installed it over connected
  SM-X115 `R8YX91AKWXJ` with `adb install -r` (`Success`), preserving data —
  owner-requested post-card install (the AUDIT-02 card itself forbade ADB).
  Exact next action: owner physically tests the Card split question
  (compact dialog, Yes/No), Cash going straight to the payment popup, and
  Reports All loading without the crash; PR-05 remains pending.

- Split question reworked (3 Sep 2026): owner feedback — the split question
  must only appear for Card, and it was far too big inside the payment card.
  Card with 2+ units now opens a compact 360px question dialog
  (`SplitOrderQuestion`, app-styled) whose Yes opens the payment dialog
  directly in split mode and No continues to the ordinary single-tender
  dialog; Cash of any size goes straight to the normal payment popup with
  its existing Split button; Card with one unit still places directly. The
  question view was removed from `PaymentDialog` (replaced by a `startSplit`
  prop), the unused question CSS was deleted, and the French strings remain.
  Passed `tsc -b`, `check:css-scope`, `check:pos`, `npm run build`, and
  `git diff --check`. Exact next action: commit this feedback fix, then
  implement AUDIT-02 only; PR-05 remains pending.

- AUDIT-02 planned (3 Sep 2026): read-only review found four gaps after
  AUDIT-01: the All collector ignores Convex `SplitRequired`, cleanup cannot
  stop later page/stock requests, a fixed 60-page ceiling contradicts true
  All, and the claimed 40-row three-page test actually makes one 60-row
  request. The five AUDIT-01 business repairs and Reports All crash guard
  otherwise reviewed correctly; all safe focused checks and the build passed.
  Added the exact split, cancellation, 61-page, repeated-cursor, real-three-
  page, and stale-pointer repair contract to
  `goals/GOAL-06-POLISH-RELIABILITY.md`. No application code, app, ADB,
  printer, PIN, or live data was touched. Exact next action: implement
  AUDIT-02 only; PR-05 remains pending.

- AUDIT-01 build installed (3 Sep 2026): rebuilt the debug beta from
  synchronized `main` (AUDIT-01 included) and installed it over connected
  SM-X115 `R8YX91AKWXJ` with `adb install -r` (`Success`), preserving data —
  owner-requested post-card install (the AUDIT-01 card itself forbade ADB).
  Exact next action: owner physically verifies Reports All (no crash),
  offline All counts/payments, legacy month-only correction rejection,
  Orders Offert option removal, plus the earlier split-report, report-print,
  and product-image fixes; PR-05 remains pending owner authorization.

- AUDIT-01 complete (2–3 Sep 2026): implemented the five audit repairs plus
  the mandatory Reports All crash guard root-fixed during the
  owner-authorized tablet diagnosis. Cloud All now uses legal page-by-page
  pagination (`getAllSummaryPage` + `getAllSummaryStock`, client-collected
  cursors via the new `src/data/cloudAllReport.ts`); offline All counts all
  units by independent SQL and splits mixed tenders by exact saved dues;
  legacy month-only expenses get the first-day fallback in the local
  correction guard; Orders no longer lists Offert as a product option while
  the Payment summary keeps its amount. Official Convex pagination guidance
  verified and recorded. All safe checks pass (`check:offline`,
  `check:local-inventory-costs`, `check:printing` golden unchanged,
  `check:pos`, `check:costs`, `check:navigation`, `check:css-scope`,
  `tsc -b`, `npm run build`, `git diff --check`); protected PIN-gated cloud
  checks remain unavailable and are recorded honestly. Convex functions
  deployed (`npx convex dev --once`, code only). Graphify refreshed to
  3,061 nodes, 6,050 edges. DOX updated (`convex/AGENTS.md`,
  `data/AGENTS.md`). Committed and pushed to `origin/main` as
  `bca6d773eaa89147ce556cca09d61aa10414609c`
  (`AUDIT-01: repair report and order audit findings`); `main` matches
  `origin/main`. PR-05 remains pending
  for the owner's physical acceptance and final closeout.

- Reports All crash diagnosed (2 Sep 2026, owner-authorized ADB/CDP): the
  blank-screen crash was reproduced on SM-X115 and captured via the WebView
  DevTools protocol with a breakpoint on `buildPeriodProfit`. Evidence: the
  function was called with `snapshot === undefined` and All's empty-string
  dates, so `operatingCostsForRange([], [], '', '')` →
  `monthsInDateRange('', '')` → `daysInCalendarMonth('')` threw
  `Error: Months must use YYYY-MM.` during render and unmounted the app.
  Any All render without a loaded snapshot crashes (fresh Reports mount
  while the All request is in flight, after a failed load, or a range
  change on pre-stale builds). The tablet's local expense/compensation rows
  are well-formed; the cloud All path not delivering data matches AUDIT-01's
  illegal-pagination finding. No fix applied — AUDIT-01 owns the repair.
  Exact next action: implement AUDIT-01 per its durable contract.

- AUDIT-01 planning and real-menu extraction (2 Sep 2026): a read-only audit of
  current `main` confirmed five remaining correctness problems: cloud All calls
  Convex pagination repeatedly in one query; offline All undercounts units when
  more than 20 products sold; legacy month-only recurring expenses lack the
  local first-day fallback; offline All misclassifies mixed Cash/Card tenders;
  and Orders still shows Offert as a product option. Added an exact repair card
  before PR-05 in the POLISH Reliability Ledger. Safe repository audit checks
  had passed; protected PIN/reset/seed checks were not run. Separately captured
  every visible item, price, category, size, milk type, syrup, extra, badge, and
  stated ingredient from the seven menu images in
  `goals/OLASO-REAL-MENU-EXTRACTION.md`. No application code, app, tablet, ADB,
  printer, PIN, or live data was touched. Exact next action: implement
  AUDIT-01 only from its durable contract; menu creation remains unstarted.

- POLISH-01 dimmed stale Reports totals (2 Sep 2026): owner rejected the
  whole-content fade (loading state still flashed) and asked for
  fade-on-data-only. Implemented stale-while-reload: changing the period
  keeps previous totals visible but dimmed (opacity 0.5, 420 ms) while the
  new range loads, then swaps to the new values; chrome never moves;
  failures still clear to the honest error state. `useReportsData` exposes
  `isRefreshing` and no longer clears the snapshot on range change; DOX
  contracts updated to the owner-approved behavior. Passed `tsc -b`,
  `check:css-scope`, `check:navigation`, `check:offline`, `npm run build`,
  debug beta, Graphify (3,041 nodes, 6,013 edges). APK installed over
  SM-X115 `R8YX91AKWXJ` with `adb install -r` (`Success`), data preserved.
  Exact next action: owner verifies the dimmed reload; then discuss
  profile performance; PR-05 pending owner authorization.

- POLISH-01 Reports reload fade (2 Sep 2026): owner deferred the
  performance-by-profile request (per-profile amounts in the printed daily
  report and on the Reports page) for a layout-safe design discussion after
  today's work; not implemented. The Reports period/tab reload flash is
  fixed: the screen content sits in a keyed wrapper that replays the exact
  420 ms screen-crossfade motion on range, tab, and load/ready changes
  (reduced-motion respected, geometry untouched). Passed `tsc -b`,
  `check:css-scope`, `check:navigation`, `check:offline`, `npm run build`,
  debug beta, Graphify (3,041 nodes, 6,013 edges). APK installed over
  SM-X115 `R8YX91AKWXJ` with `adb install -r` (`Success`), data preserved.
  Exact next action: owner verifies the fade plus the earlier
  split-payment/reports-print fixes; then discuss profile performance;
  PR-05 pending owner authorization.

- POLISH-01 split-payment repair (2 Sep 2026): owner reported split receipts
  printing every payment as Card and asked for an explicit bilingual split
  question before payment. Root cause: `receiptModel.ts` coerced each
  tender's method through the sale-level `paymentMethod` fallback, so a Cash
  tender inside a Card-level sale printed Card with no Given/Change. Each
  tender now keeps its own method; `check:printing` gained the previously
  missing Card-level snapshot case (golden 800-byte receipt unchanged). Card
  with a single payable unit now places the order directly from the POS
  button; 2+ units open the payment dialog on the bilingual question
  `Does this order need to be split?` with `No, one payment` /
  `Yes, split it` (French translations added). The question reuses the
  PaymentDialog chrome. Checks: `check:printing`, `check:pos`, `tsc -b`,
  `check:css-scope`, `npm run build`, debug beta, Graphify (3,041 nodes,
  6,013 edges). APK installed over SM-X115 `R8YX91AKWXJ` with
  `adb install -r` (`Success`), data preserved. Exact next action: owner
  physically verifies direct Card checkout, the split question in EN/FR, and
  per-method receipt paper; commit/push this repair; PR-05 pending owner
  authorization.

- POLISH-01 sync repair + polish batch (2 Sep 2026): pulled a read-only copy
  of the tablet database and found today's six sales (`0926-0015`–`0020`)
  failed with `Cloud rejected this saved order.` — their snapshots carry the
  new `tenders` array that the deployed Convex validator (never republished
  since `bb5a499`/`fc79d1e`) rejects; `check:convex` does not deploy. Root
  cause fixed by `npx convex dev --once` (functions ready on
  colorful-newt-937, no data change) and by recording the deploy contract in
  `convex/AGENTS.md`; the six rows stay failed until the owner's Manual Sync.
  Also removed the `Daily report sent; confirm paper.` success popup
  (failure alert kept), and Products rows plus the Edit Product identity card
  now show the real product image through the shared `productImage` resolver
  (asset artwork or compressed custom JPEG; compression verified at pick and
  at the persistence boundary). Checks: `tsc -b`, `check:offline`,
  `check:navigation`, `check:css-scope`, `npm run build`, `check:android`,
  debug beta, Graphify (3,040 nodes, 6,013 edges). Rebuilt APK installed over
  SM-X115 `R8YX91AKWXJ` with `adb install -r` (`Success`), data preserved; no
  PIN, seed, reset, or data write. Exact next action: owner presses Manual
  Sync and verifies report print + product images; then commit/push and
  await owner authorization for PR-05.

- POLISH-01 daily-report print repair (2 Sep 2026): owner-reported bug — the
  Header Reports button showed `Printer action failed. Check the settings and
  try again.` while sale receipts printed fine. Root cause:
  `dailyOwnerReport.ts` selected the nonexistent `sales.discount_centimes`
  column (discount lives only in `receipt_snapshot_json`), so the composition
  query threw an unclassified SQLite error before the printer transport ran.
  Fixed by removing that column and deriving Offert exactly as completed
  `subtotal_centimes − netCentimes`; the queries moved into exported
  `loadDailySalesOverview` for regression coverage
  (`check:local-inventory-costs` daily-overview fixture; `check:offline`
  source guards). Focused checks, `tsc -b`, `npm run build`, `check:android`,
  `android:sync`, and the debug beta all pass. Graphify refreshed to 3,040
  nodes, 6,017 edges, 186 communities. The 26,479,611-byte debug APK was
  installed over connected SM-X115 `R8YX91AKWXJ` with `adb install -r`
  (`Success`), preserving app data. No PIN was requested or used; no data was
  seeded or wiped. Exact next action: owner taps the Reports header button and
  confirms the bilingual daily summary prints on the WD8260; then commit/push
  this repair and PR-05 remains pending owner authorization.

- PR-04 checkpoint (2 Sep 2026): began only after PR-03's pushed completion
  and the owner's explicit authorization. Removed both `.slice(0, 8)` Costs
  list caps in `CostsPanel.tsx` with internal row scrolling
  (`min-height: 0`, `overflow-y: auto`) and no page-layout change. Online
  Dashboard now requests cloud and saved-tablet snapshots concurrently and
  shows the tablet snapshot only when completed current-day sales strictly
  exceed the cloud count; offline stays local-only; totals are never added.
  Focused offline-view guards cover the selection rule and caps. Passed
  `check:offline`, `tsc -b`, `check:css-scope`, `npm run build`, and
  `git diff --check`; protected `check:reports`/`check:dashboard` stopped at
  the absent owner PIN before seeding. Graphify refreshed to 3,035 nodes,
  6,009 edges, 177 communities; `dashboard`/`data`/`reports` DOX updated.
  No app, tablet, browser, ADB, PIN, seed, or live data touched. Exact next
  action: commit/push PR-04, record its SHA, then wait for owner before PR-05.

- PR-03 recovery checkpoint (2 Sep 2026): began only after PR-02's pushed
  completion. Graphify traced the existing date helper, report chart, calendar,
  and Dashboard/Orders/Stock date views. Official Android internationalization
  and Capacitor guidance select the existing React formatting/query boundary;
  no native change, app, tablet, browser, ADB, PIN, seed, or live data action
  occurred. Exact next action: implement PR-03's shared date locale and chart
  month selection helpers, then focused checks.

- PR-03 implementation checkpoint (2 Sep 2026): shared date/time formatting
  now uses the active English/French language across the required Reports,
  Dashboard, Orders, and Stock views. The reports chart selects its current,
  historical, dominant, or later-tied month by the approved rule. Focused
  date/month checks, TypeScript, saved offline checks, and diff check pass.
  Exact next action: remaining safe checks, Graphify, review, commit/push.

- PR-03 verification checkpoint (2 Sep 2026): Settings, navigation, CSS scope,
  TypeScript, production build, and diff checks passed; Graphify refreshed to
  3,032 nodes, 6,006 edges, and 186 communities. The protected reports check
  stopped before any reset because its owner test PIN is unavailable. Exact next
  action: review, commit, and push PR-03 only.

- PR-03 complete (2 Sep 2026): committed and pushed
  `e9cc667e94505237ba04cab56d4e84468cdbe8f4`
  (`PR-03: localize report dates`) to `origin/main`. Exact next action: wait
  for owner authorization, then follow Recovery Protocol and begin PR-04 only.

- PR-02 implementation checkpoint (2 Sep 2026): Reports now separates the full
  ingredient-type count from its 20 visible rows. The All preset has a bounded
  cloud daily-summary pager and SQLite aggregate path that does not load the
  existing 1,000 saved receipts. All shows the localized All-dates label and
  suppresses prior comparison; normal ranges keep their 31-day guard. Passed
  TypeScript, the safe offline view check, and diff check. No app, tablet,
  browser, ADB, printer, PIN, seed, or live data was touched. Exact next
  action: remaining safe PR-02 checks, Graphify refresh, review, commit/push.

- PR-02 verification checkpoint (2 Sep 2026): costs, saved local costs,
  Convex type/code checks, TypeScript, saved offline reports, production build,
  and diff checks passed; Graphify refreshed to 3,027 nodes, 5,965 edges, and
  186 communities. Protected reports/monthly-cost checks stopped before their
  reset action because the required owner test PIN is unavailable. No app,
  tablet, browser, ADB, printer, PIN, seed, or live data was touched. Exact
  next action: commit and push the reviewed PR-02-only diff, record its SHA,
  and wait for the owner before PR-03.

- PR-02 complete (2 Sep 2026): committed and pushed
  `dc398efe4fb4c5c66ae03e47d33734d74cf6d02e`
  (`PR-02: make reports all-time`) to `origin/main`. It records complete
  ingredient-type headlines despite the 20-row detail cap, a bounded paged
  cloud All summary, and a saved-tablet SQL All summary that avoids the raw
  receipt cap. Owner physical acceptance and protected reset/PIN checks were
  not attempted. Exact next action: wait for owner authorization, then use the
  reliability ledger Recovery Protocol and begin PR-03 only.

- POLISH-01 durable reliability handoff (2 Sep 2026): created
  `goals/GOAL-06-POLISH-RELIABILITY.md` as the permanent, context-safe plan and
  journal for the owner's approved Reports, Costs, Dashboard, calendar, and
  date-reliability repairs. The ledger records every settled decision, the two
  intentional non-fixes, PR-01 through PR-05, exact acceptance rules, a State
  Pointer, and a mandatory Recovery Protocol that requires a complete reread
  after every context summary or handoff. No application code changed and the
  app, tablet, ADB, browser, printer, PINs, and live data were not touched.
  Documentation checkpoint `c5afe1edb8686ea60f3b3fe3f6fb6527896a9b6a`
  is on `origin/main`.
  Exact next action: begin PR-01 only from the linked ledger after its complete
  Recovery Protocol and mandatory official Android/Capacitor boundary check.

- PR-01 recovery checkpoint (2 Sep 2026): completed the linked ledger's
  mandatory recovery reread, verified clean `main` at
  `6f261da3891fd5b3cb0569692b9f85a81a4fbe67`, and queried Graphify for the
  compensation replacement and local/cloud expense-correction paths. Official
  Android SQLite and Capacitor guidance confirms this is an existing
  React/SQLite/Convex boundary: local paired correction rows stay atomic in the
  current SQLite transaction and cloud validation stays in Convex; no native,
  plugin, dependency, Kotlin, app, tablet, browser, ADB, PIN, seed, or live
  data action occurred. Exact next action: inspect those callers and implement
  PR-01 only, with its required focused checks and ledger evidence.

- PR-01 implementation checkpoint (2 Sep 2026): `listAllCompensation` now
  returns exact optional compensation dates through the existing reconnect
  replacement path. Local and Convex recurring-expense correction now reject a
  date before the original exact (or month-start fallback) date before either
  append-only paired correction row is inserted; the existing translated error
  display has the approved French sentence. Added focused local SQLite coverage
  for exact-date replacement, month-only compatibility, early rejection with
  no rows, and a valid same-date correction. Checks are pending. No app,
  tablet, browser, ADB, PIN, seed, or live data was touched. Exact next action:
  run PR-01 focused checks and repair only any failure.

- PR-01 initial check result (2 Sep 2026): `check:reconnect` and `check:costs`
  passed. The focused local SQLite regression reached the new fixture but an
  earlier expected compensation count was still one rather than the new two;
  TypeScript also found the new optional replacement test seam missing its
  local transaction type. `git diff --check` passed apart from ordinary Windows
  line-ending notices. These are test-wiring issues only; no application,
  tablet, browser, ADB, PIN, seed, or live data action occurred. Exact next
  action: correct those two small issues and rerun the focused checks.

- PR-01 second check result (2 Sep 2026): after correcting the transaction type
  and fixture counts, TypeScript, reconnect, exact-cost, and diff checks pass.
  The local check then correctly refused a pre-existing July fixture because
  the new legacy month-only compensation fixture was open-ended. The fixture
  will use its legacy end-month field while leaving optional exact dates absent.
  No application, tablet, browser, ADB, PIN, seed, or live data action
  occurred. Exact next action: correct that fixture and rerun PR-01 checks.

- PR-01 third check result (2 Sep 2026): closing the legacy fixture exposed its
  remaining overlap with a pre-existing July 2026 test fixture; the local guard
  correctly rejected it. The fixture will move to July 2025, retaining its
  month-only compatibility purpose. Reconnect, exact-cost, TypeScript, and
  diff checks still pass. No application, tablet, browser, ADB, PIN, seed, or
  live data action occurred. Exact next action: move that fixture and rerun
  PR-01 focused checks.

- PR-01 checks passed (2 Sep 2026): focused local replacement and correction
  regression, reconnect, exact-cost, TypeScript, Convex typecheck/codegen, and
  production build all passed. The protected cloud tests were not run because
  they require a PIN and reset development data; no tablet or application was
  launched. Exact next action: stage only PR-01, commit/push to `origin/main`,
  record the full SHA, then activate PR-02 only.

- PR-01 complete (2 Sep 2026): committed and pushed
  `0bea66ae496e3ecc24efea13aa195903d3358aa6`
  (`PR-01: preserve exact cost dates`) to `origin/main`. This includes exact
  compensation-date refresh preservation, early recurring-correction rejection
  before paired writes, its French message, focused no-PIN regression, and all
  recorded automated checks. `main` matched `origin/main` after the push; no
  application, tablet, browser, ADB, PIN, seed, or live data action occurred.
  PR-02 is next but not started.

- POLISH-01 release handoff (2 Sep 2026): the owner authorized committing and
  pushing the complete pending polish set to `main`, then installing it over
  the existing Galaxy Tab A9 app for hands-on testing. Official Android ADB
  guidance and the repository tablet handoff both confirm `adb install -r` as
  the data-preserving update path; no uninstall or data reset is allowed.
  Pre-commit evidence: identity, local staff, local inventory/costs, exact
  costs, local database, local catalog, product configuration, receipt
  printing, POS, navigation, offline views, reconnect, Settings, CSS scope,
  TypeScript, production build, and Convex codegen/typecheck all pass. Reports
  also passes its local section and stops only at the intentionally unavailable
  `OLASO_OWNER_PIN` cloud gate. Graphify code refresh completed at 3,025 nodes
  and 5,956 edges, followed by clustering at 184 communities. Commit
  `fc79d1e72e0bd35449efe1bf23c1dd2a61d48ee7` is on `origin/main`. The first
  Android gate exposed only a stale assertion for deleted demo drink images;
  the obsolete assertion was removed because runtime photos now come from the
  saved product record. `check:android`, the production web build, Capacitor
  sync, Android unit tasks, and the 140-task debug APK build then passed; check
  correction `1786a213084ac86d989ef2e43d822e23c953a095` is on `origin/main`.
  Installed the 26,478,777-byte debug APK over connected SM-X115
  `R8YX91AKWXJ` with `adb install -r` (`Success`), preserving app data. After
  restart and the normal three-second initialization, the tablet showed the
  Owner lock screen at exactly 1,340 by 800, online, with no browser-console or
  focused Android startup error. Exact next action: owner unlocks and performs
  the requested hands-on POLISH-01 feature review; HARD-08 remains pending.

- POLISH-01 mandatory identity/data/payment/report repair (2 Sep 2026): traced
  the lost staff PIN to `seed:resetAndSeed` deleting `staffProfiles` while
  leaving `staffIdentities`, which orphaned the credential from the visible
  profile ID. Development reset now requires the explicit disposable-deployment
  acknowledgement, preserves staff IDs, reuses matching staff, and hides any
  identity-less cloud profile from sign-in/sync. The same shared reset was the
  credible catalog/photo loss path; product photos remain bounded 96×96 JPEG
  data URLs in SQLite + Convex, save-without-photo preserves the cloud image,
  and snapshot-without-photo preserves the tablet image. Split checkout now
  lets each assigned payer choose Cash or Card; card is exact, cash alone shows
  Given/Change, and receipts/Orders/daily metrics retain each method and due.
  Orders decorates saved lines with the current saved product photo and uses a
  Take-away bag icon. French Header/calendar abbreviations, larger Dashboard
  axes, clear recipe-deduction wording, global Reports period for Costs, exact-
  date salary/recurring-expense history, and the 48px Staff role field/12px
  footer controls are implemented. The owner-only Header Report button now
  prints a bounded bilingual current-day accounting summary through the shared
  WD8260 transport. Focused passes: `tsc -b`, `check:convex` (functions
  published; seed not run), `check:identity`, `check:local-staff`,
  `check:local-inventory-costs`, `check:costs`, `check:local`,
  `check:local-catalog`, `check:product-configuration`, `check:printing`,
  `check:pos`, `check:navigation`, `check:offline`, `check:reconnect`,
  `check:settings`, and production `build`. Local sections of `check:sales` and
  `check:orders` pass before their protected cloud gate; `check:permissions`,
  `check:sales`, `check:orders`, `check:dashboard`, `check:reports`,
  `check:staff`, `check:expenses`, and `check:monthly-costs` cannot run their
  cloud sections because `OLASO_OWNER_PIN` is absent. Per owner instruction,
  no tablet/app launch, install, restart, browser QA, or physical print was
  performed after resuming. Uncommitted. Exact next action: refresh Graphify,
  review the diff, then hand the build to the owner for hands-on acceptance.

- POLISH-01 mandatory bug repair (1 Sep 2026): professional receipt item
  formatting now keeps product + size together, consolidates choices without
  repeated `+`, never renders Offert as an option, and translates French
  service as `Sur place` / `À emporter`. Profile language is local-first,
  pushed before cloud directory refresh, and preserved through offline staff
  provisioning. The physical reconnect failure was an ambiguous
  `local_record_id` in compensation-delete reconciliation; it is qualified and
  the installed beta now restarts with no console/logcat error. Protected
  offline verification may recover an active profile whose cloud identity is
  temporarily unavailable. Focused printing/identity/local-staff/local-cost/
  reconnect/settings/lock/offline checks, TypeScript, Convex deployment,
  production build, Android checks, 140-task beta, install-over, exact
  1340 × 800 Lock, and clean startup pass. `check:sales` / `check:orders`
  remain unrun because no protected `OLASO_OWNER_PIN` is present. Uncommitted.
  Exact next action: owner unlocks once, verifies FR survives lock/restart and
  the affected staff profile; then print one Offert receipt with size plus
  several choices and inspect the real WD8260 paper.

- POLISH-01 (1 Sep 2026): Settings no longer shows a leftover
  `Synchronization failed` banner when waiting sales is 0. Application
  language is per staff profile (SQLite schema 23 + Convex
  `preferredLanguage`); receipt language stays tablet-wide. Header EN|FR
  matches Settings Application. Lock keeps the last UI language. Professional
  French café chrome via `src/lib/fr.ts`. Checks: `tsc -b`, `check:css-scope`,
  `check:settings`, `check:identity`, `check:local-staff`, `check:lock-switch`,
  `check:navigation`, `check:reconnect`, `check:staff`, `npm run build`,
  Convex `dev --once`, graphify update (2993 nodes), `android:beta`.
  Install-over SM-X115 `R8YX91AKWXJ` and relaunched. Uncommitted. Exact next
  action: owner unlocks, confirms Settings has no false sync failure when
  waiting is 0, switches FR from the profile EN|FR control and Settings,
  locks (Unlock stays French), then signs in an English profile.

- POLISH-01 (1 Sep 2026): Stock used-today keeps `max(local, cloud + unsynced)`
  so Reports Today 3 L is not replaced by a smaller cloud 1 L. On-hand folds
  mapped local-duplicate `local_stock_delta` into the visible row. Category ⋮
  is Rename/Delete only. Edit Product has no PRODUCT DETAILS; title aligns
  with Active/Delete; category menu is 40px like price. Checks: `tsc -b`,
  `check:css-scope`, `check:offline`, `check:navigation`, `android:beta`,
  graphify update (2975 nodes). Install-over SM-X115 `R8YX91AKWXJ` and
  relaunched. Uncommitted. Exact next action: owner unlocks, checks Stock
  whole milk used-today vs Reports Today, on-hand, category ⋮, and Edit
  Product title/category height.

- POLISH-01 (1 Sep 2026): Stock used-today is today’s usage by ingredient
  name/unit, plus today’s cloud summary so it survives reinstall; unsynced
  local sales still add. Used-ingredient rows are mid-size (~52px). Needs
  attention uses View all → Stock on Low stock; title-row Active/Low/Used/
  Corrections counts are gone. Checks: `tsc -b`, `check:css-scope`,
  `check:offline`, `check:navigation`, `android:beta`. Install-over SM-X115
  `R8YX91AKWXJ` and relaunched. Uncommitted. Exact next action: owner unlocks,
  checks Stock used-today for today’s milk/beans (including earlier sales),
  Reports used-row size, Dashboard View all → Low stock, and the empty
  Stock title row.

- POLISH-01 (1 Sep 2026): Stock used-today matches local/cloud ingredient IDs
  and reloads after a local sale or cancellation. Reports used-ingredient bars
  use `used / (used + on-hand)` with on-hand by name+unit (tablet overlay when
  present); the used list scrolls and rows are compact (~32px). Receipts and
  Orders payment match POS: Total only, Subtotal+Offert only when Offert,
  never a tax line. Checks: `tsc -b`, `check:css-scope`, `check:printing`
  (SHA `4562E870…CD6237`), `check:offline`, `check:reconnect`, `check:reports`,
  `check:orders`, Convex `dev --once`, graphify update, `android:beta`.
  Install-over SM-X115 `R8YX91AKWXJ` and relaunched. Uncommitted. Exact next
  action: owner unlocks, checks Stock used-today for milk/caramel/beans, Stock
  usage bars (not full for 2 L of 33.48 L), compact used rows, and a receipt
  without Offert showing Total only. Say if the tighter used rows should revert.

- POLISH-01 (1 Sep 2026): Reports peak white dot removed. Products/Stock Y-axis
  uses distinct integer ticks; stock-usage daily events fill the month chart;
  used-ingredient bars compare usage to that ingredient’s on-hand stock.
  Catalog snapshot COALESCE keeps tablet product JPEGs. Dashboard 12-day chart
  already ends on today (left day drops tomorrow). Checks: `tsc -b`,
  `check:css-scope`, `check:offline`, `check:reports`, Convex codegen,
  graphify update, `android:beta`. Install-over SM-X115 `R8YX91AKWXJ` and
  relaunched. Uncommitted. Exact next action: owner unlocks, checks Reports
  Products/Stock graphs and used bars, then re-saves a product photo.

- POLISH-01 (1 Sep 2026): Reports graph uses 8px bars, plot inset so day 1
  does not cover Y labels, 1-2-5-10 ticks, blank zero days, and daily average
  ÷ elapsed days this month. Profit card adds Stock value. Stock usage merges
  the same ingredient. Staff delete ends open wage this month. Orders defaults
  to Today with week/month/all presets, no header Cancel, tenders then TOTAL.
  Checks: `tsc -b`, `check:css-scope`, `check:printing`, `check:orders`,
  `check:offline`, `check:reports`, `check:local-inventory-costs`,
  `check:local-staff`, Convex codegen (staff.remove compensationEndMonth),
  graphify update, `android:beta`. Install-over SM-X115 `R8YX91AKWXJ` and
  relaunched. Uncommitted. Exact next action: owner unlocks, opens Reports,
  and checks the September graph (thin bar, 10/20/30/40 ticks, average ≈
  peak on day 1), Stock value, merged stock-usage rows, Orders Today, and
  receipt total last.

- POLISH-01 (1 Sep 2026): Add expense / Add monthly pay calendars drop the
  quick-period column (248px month grid). Calendar opener toggles closed on
  the second tap (overlay closes on click, not pointerdown, so the click
  cannot reopen it). Reports default is This week. Checks: `tsc -b`,
  `check:css-scope`, graphify update, `android:beta`. Install-over SM-X115
  `R8YX91AKWXJ` and relaunched. Uncommitted. Exact next action: owner opens
  Reports (This week highlighted), taps the date button twice, then Add
  expense / Add monthly pay Date/Paid on twice and confirms no left quick
  periods.

- POLISH-01 (31 Aug 2026): Calendar highlights only the quick period that was
  tapped (Today no longer lights This week on Monday; This month no longer
  lights All). Popover is smaller and opens from the field, down if there is
  room, up in Add expense / Add monthly pay. Reports selected-period totals
  reload instead of keeping the previous range, and this tablet’s saved
  receipts win when they have more completed sales than the cloud so today
  sales still show. Graph remains the current calendar month. Checks:
  `tsc -b`, `check:css-scope`, `check:offline`, graphify update,
  `android:beta`. Install-over SM-X115 `R8YX91AKWXJ` and relaunched.
  Uncommitted. Exact next action: owner opens Reports, taps Today only,
  Last week, Last month, and Today’s sales; then Add expense Date for the
  upward popover.

- POLISH-01 (31 Aug 2026): Monthly pay has Delete (does not require deleting
  the staff profile). Stock purchase cash does not dump into report cost;
  profit uses per-sale recipe ingredient cost. Stock right card is Ingredient
  aligned with Healthy/Delete, no Stock details / Ingredient information.
  Reports Products is two Dashboard-like cream-gap cards. Shared period
  calendar (quick periods left, month grid right; first tap day, second tap
  range; first pick survives month change) is used on Reports, Orders,
  expense/pay dates, and Costs month. Reports graph is always the current
  calendar month and ignores the selected period. Checks: `tsc -b`,
  `check:css-scope`, `check:local-inventory-costs`, `check:reports`, Convex
  codegen (includes `staff.removePeriod`), graphify update, `android:beta`.
  Install-over SM-X115 `R8YX91AKWXJ` and relaunched. Uncommitted. Exact next
  action: owner checks monthly-pay Delete, Stock chrome, Products cards,
  calendar (including cross-month range), and the August-only graph.

- POLISH-01 (31 Aug 2026): Products sidebar category names are 12px, one line,
  and ellipsis; they never wrap or clip the product count. Recorded in
  DESIGN.md and products AGENTS.md. Install-over SM-X115 `R8YX91AKWXJ` and
  relaunched. Uncommitted. Exact next action: owner checks Bakery & Savory
  and a long category name on Products.

- POLISH-01 (31 Aug 2026): Add expense Date uses the same Staff caret as Paid
  on; native calendar arrow hidden. Install-over SM-X115 `R8YX91AKWXJ` and
  relaunched. Uncommitted. Exact next action: owner opens Add expense and
  confirms one green caret on Date.

- POLISH-01 (31 Aug 2026): Paid on keeps one green caret; the native
  calendar arrow is hidden. Install-over SM-X115 `R8YX91AKWXJ` and relaunched.
  Uncommitted. Exact next action: owner opens Add monthly pay and confirms one
  arrow on Paid on.

- POLISH-01 (31 Aug 2026): Products right rail is two equal inner cards
  (categories top, products bottom). Empty copy sits under those titles and
  under Used ingredients. Paid on is still a native date calendar, styled like
  Staff (44px field, green caret on the right). Chart legend is Previous
  period. Checks: `tsc -b`, `check:css-scope`, graphify update, `android:beta`.
  Install-over SM-X115 `R8YX91AKWXJ` and relaunched. Uncommitted. Exact next
  action: owner checks Products two cards, Stock empty copy, Paid on caret, and
  Previous period on the chart.

- POLISH-01 (31 Aug 2026): Reports charts fill the left card. Sales right card
  holds Orders, Average, and a smaller operating-profit total. Products right
  card splits category vs product rows. Stock usage keeps used ingredients only.
  Expense/pay dialogs use 44px menus and centered 48px actions. Debug APK
  install-over SM-X115 `R8YX91AKWXJ` and relaunched. Uncommitted. Exact next
  action: owner checks Sales/Products/Stock/Costs plus Add expense and Add
  monthly pay.

- POLISH-01 (31 Aug 2026): Owner was still on the previous APK. Debug
  `app-debug.apk` install-over SM-X115 `R8YX91AKWXJ` succeeded and MainActivity
  relaunched. Convex `dev --once` pushed the reports aggregate. Uncommitted
  Stock/Settings/Reports source is now on the tablet. Exact next action: owner
  unlocks and checks Stock movements, Settings (no tabs), and Reports Sales/Costs.

- POLISH-01 (30 Aug 2026): Stock right card drops inventory-value / linked-recipe
  chrome and shows five recent movements; Adjust count / Receive sit above Save
  with padding. Products category names are 13px. Settings is one page: left
  languages/clock/printer/sync/update, right Staff & access; no tabs, no Lock
  application, no Restore saved logo, no device ID. Reports Sales uses Dashboard
  48px type and a taller chart; Costs is add-only (one-time vs split-by-days
  expenses, monthly pay by staff + date); profit is on Sales for the selected
  dates with daily wage/expense allocation. Android research: React/CSS plus
  existing SQLite cost rows; no native plugin. Checks: `check:css-scope`,
  `tsc -b`, `check:settings`, `check:local-staff`, `check:lock-switch`,
  `check:local-inventory-costs`, `check:reports`, `npm run build`, graphify
  update. Browser lock on a fresh jeep-sqlite had no staff list so authenticated
  1340×800 screenshots were not taken. Uncommitted. Exact next action: owner
  reviews Stock movements, Products categories, Settings, and Reports on the
  Tab A9.

- POLISH-01 (30 Aug 2026): Ingredient editing is the Stock right card (name +
  threshold, Save/Delete). Add ingredient is create-only; its base-unit menu
  matches the 47px fields. Product archive UI and ingredient archive UI are
  gone. Table and detail no longer show ingredient icons. StockIcon removed.
  Orders search/tabs/dates are 42px with 12px type. MenuSelect compact labels
  and search placeholders are 12px. Android research: React/CSS only. Checks:
  `check:css-scope`, `tsc -b`, `npm run build`, `android:beta`. Install-over
  SM-X115 `R8YX91AKWXJ` and relaunched. Pushed
  `f3eadb1a0af16bcaa1deac4b03767b20319cad50` on `origin/main`. Exact next
  action: owner checks Add ingredient unit menu, Edit ingredient on the right
  card, no archive, no table/detail icons, Orders outlines, and placeholder
  size.
- POLISH-01 (30 Aug 2026): Product archive UI is gone (Edit Product control and
  Archived availability filter). Sizes overlay is one header row plus compact
  single-line fields. Add product/category/ingredient keep the same layout with
  ~30% larger type and 47px fields; Add category button label is 12px. Orders
  search/tabs/dates and Stock search share a 36px outline. Stock title counts
  read Active items / Low stock / Used today / Corrections beside the numbers.
  Stock Edit is a quiet 28px pill. Receive purchase and Adjust count have no
  decorative ingredient icons. Android research: React/CSS only. Checks:
  `check:css-scope`, `tsc -b`, `npm run build`, `android:beta`. Install-over
  SM-X115 `R8YX91AKWXJ` and relaunched. Uncommitted. Exact next action: owner
  checks product archive gone, Sizes one-line rows, larger add overlays, Orders
  and Stock search outlines, Stock metric labels, quieter Edit, and icon-free
  stock popups.
- POLISH-01 (30 Aug 2026): Overlays no longer autoFocus a field (keyboard stays
  closed until the operator taps a text box). Backdrop tap blurs / waits for
  the IME to close first; a second backdrop tap closes the overlay. Payment
  still cannot close after the first tender. Android research: WebView IME
  opens on `autoFocus`; `blur()` plus `visualViewport` height dismisses it
  without a native keyboard plugin. Checks: `tsc -b`, `npm run build`,
  `android:beta`. Install-over SM-X115 `R8YX91AKWXJ` and relaunched.
  Uncommitted. Exact next action: owner opens Add product, confirms no
  keyboard until the name field is tapped, then taps outside once to close
  the keyboard and again to close the overlay.
- POLISH-01 (30 Aug 2026): Orders DATE is one baseline (date + time). Products
  and Stock row values share one vertical center; Stock copies Products
  (centered STATUS chips, green selected mark). Stock title metrics are quiet
  counts beside Add ingredient. Add product is 320px (name+photo, category+price
  on one row). Category and Add ingredient overlays are smaller; base unit
  matches the 36px threshold. Overlays close on X or backdrop (Payment stays
  locked after the first tender). Product photos compress to JPEG ≤16KB on the
  tablet, then SQLite schema 22 `image_jpeg` and Convex `imageJpeg`. Android
  research: WebView `<input type="file" accept="image/*">` plus canvas compress;
  no native picker plugin. Checks: `check:css-scope`, `tsc -b`,
  `check:local-catalog`, `check:management`, `npx convex dev --once`,
  `npm run build`, `android:beta`. Install-over SM-X115 `R8YX91AKWXJ` and
  relaunched. Uncommitted. Exact next action: owner checks Orders date/time,
  Products/Stock row alignment, smaller Add product/category/ingredient
  overlays, backdrop close, and product photo pick on Add product plus the
  Edit Product artwork pill.
- POLISH-01 (30 Aug 2026): Products rows hide the code (kept on Edit Product),
  same 65px row, larger type. Orders table taller; showing-count + pager sit
  together near the card bottom; eight equal 55px rows, larger type. Stock
  metrics sit on the title row; table shows seven equal rows, no base-unit
  subtitle, larger type. Android research: React/CSS only. Checks:
  `check:css-scope`, `tsc -b`, `npm run build`, `android:beta`. Install-over
  SM-X115 `R8YX91AKWXJ` and relaunched. Uncommitted. Exact next action: owner
  checks Products name-only rows, Orders footer/rows, and Stock title-row
  metrics plus seven inventory rows.
- POLISH-01 (30 Aug 2026): Shared Lock in-app list (`MenuSelect`) replaces every
  native `<select>` except date/month. Products search/filter/sort sit on the
  title row; table is seven equal-height rows that do not stretch on short
  pages; Add product overlay is 400px. Android research: React/CSS only, no
  native picker. Checks: `check:css-scope`, `tsc -b`, `npm run build`,
  `android:beta`. Install-over SM-X115 `R8YX91AKWXJ` and relaunched.
  Uncommitted. Exact next action: owner checks Lock staff list, Products
  title-row filters, seven vs two product rows, Add product width, and
  dropdowns in Products/Stock/popups (leave calendars alone).
- POLISH-01 (30 Aug 2026): Choices overlay: tabs are Groups, rows are Choices.
  Extra sits left of the price; trash at the row’s right. One Usual per group
  (Several no longer allows two). Android research: React/CSS only. Checks:
  `check:css-scope`, `tsc -b`, `npm run build`, `android:beta`. Install-over
  SM-X115 `R8YX91AKWXJ` and relaunched. Uncommitted. Exact next action: owner
  opens Choices, taps Usual on two rows, confirms only the last one stays on.
- POLISH-01 (30 Aug 2026): Choices card 600→520px. Number fields treat 0 as a
  real placeholder so typing 1 is 1, not 01 (Choices, Recipe, prices, sizes,
  stock, costs). Android research: React/CSS only. Checks: `check:css-scope`,
  `tsc -b`, `npm run build`, `android:beta`. Install-over SM-X115
  `R8YX91AKWXJ` and relaunched. Uncommitted. Exact next action: owner opens
  Choices Several, taps At least, types 1, and confirms a tighter card.
- POLISH-01 (30 Aug 2026): Choices overlay is 600px with 36px fields. Section
  and choice names no longer stretch. At least / At most use filled 44px
  counts with 10px label gap (labels were not flex, so gap never applied).
  Android research: React/CSS only. Checks: `check:css-scope`, `tsc -b`,
  `npm run build`, `android:beta`. Install-over SM-X115 `R8YX91AKWXJ` and
  relaunched. Pushed `95cd14c82bfbac5e6f39e1c9cf8717f6c035cd53` on
  `origin/main`. Exact next action: owner opens Choices on Several and
  confirms short names, spaced counts, smaller card.
- POLISH-01 (30 Aug 2026): Recipe overlay dropped the version sentence. It is
  a 560px card with Ingredient and Amount as row labels and four compact
  name-then-amount columns. Android research: React/CSS only. Checks:
  `check:css-scope`, `tsc -b`, `npm run build`, `android:beta`. Install-over
  SM-X115 `R8YX91AKWXJ` and relaunched. Uncommitted. Exact next action: owner
  opens Recipe on a product with several ingredients and confirms four across,
  short fields, and no version copy.
- POLISH-01 (30 Aug 2026): Choice Delete archived the section but Products
  still listed it. Hook now hides archived sections/values; row trash saves
  immediately. Android research: React/SQLite only. Checks:
  `check:local-catalog`, `tsc -b`, `npm run build`, `android:beta`.
  Install-over SM-X115 `R8YX91AKWXJ` and restarted. Uncommitted. Exact next
  action: owner creates a choice, taps Delete, confirms it is gone.
- POLISH-01 (30 Aug 2026): Choices and Recipe overlays rebuilt to match
  Category/Payment: cream 28px card, 44px fields, Cancel/Save, hairline
  rows. Choices use section tabs; Stock and By size stay closed until
  tapped. Recipe is an ingredient table. Android research: React/CSS only.
  Checks: `check:css-scope`, `tsc -b`, `npm run build`, `android:beta`.
  Install-over SM-X115 `R8YX91AKWXJ` and restarted. Uncommitted. Exact next
  action: owner opens Choices and Recipe on a product with sizes/options.
- POLISH-01 (30 Aug 2026): Edit Product chips fill the leftover Sizes &
  options height as two 28px rows, then scroll sideways. CSS column wrap;
  no native. Checks: `check:css-scope`, `check:local-catalog`, `tsc -b`,
  `npm run build`, `android:beta`. Install-over SM-X115 `R8YX91AKWXJ` and
  restarted. Uncommitted. Exact next action: owner opens a product with
  several sizes/choices and confirms two rows then a side swipe.
- POLISH-01 (30 Aug 2026): Products catalog always ends with pinned
  Uncategorized (filter, not a saved category; no rename/archive/delete).
  Edit Product size/choice chips are one compact line: name + price, no
  stacked Active. Android research: React/CSS only; same `'uncategorized'`
  id as POS; no SQLite/Convex category. Checks: `check:css-scope`,
  `check:local-catalog`, `tsc -b`, `npm run build`, `android:beta`.
  Install-over SM-X115 `R8YX91AKWXJ` and restarted. Browser stayed on Lock
  (no PIN). Uncommitted. Exact next action: owner opens Products, taps
  Uncategorized, then Espresso and confirms Regular is a small one-line chip.
- POLISH-01 (30 Aug 2026): cancelled vs completed Orders detail was packing
  the payment block upward when the receipt had fewer rows. `margin-top:
  auto` on the items-to-payment split pins Payment/Reprint/Cancel to the
  bottom. Debug APK install-over SM-X115 `R8YX91AKWXJ` and restarted.
  Uncommitted. Exact next action: owner switches 0826-0033 and a cancelled
  order and confirms the card does not jump.
- POLISH-01 (30 Aug 2026): cart line Gift, trash, and quantity pill are
  visually smaller (36px circles / 100×36 pill) with 8px gaps; 44px hits
  kept. Exact next action: owner checks on tablet; commit when asked.
- POLISH-01 (30 Aug 2026): Offert Gift sits left of the line trash, not on
  the product photo. Quantity stepper shifted 8px left so the 44px targets
  do not overlap. CSS only. Exact next action: owner checks on tablet;
  commit when asked.
- POLISH-01 (30 Aug 2026): Payment Details/Total sit at the bottom of the
  existing 115px POS block (`justify-content: flex-end`). Offert Subtotal
  rows expand upward; Total stays put above Place order. CSS only; no native.
  Exact next action: owner checks on tablet; commit when asked.
- POLISH-01 (30 Aug 2026): trial cart-line Offert (ninth-drink loyalty).
  Gift on the POS line photo marks one unit Offert: real product + recipe
  stock, charged 0 DH, catalog prices stay on the snapshot, `discountCentimes`
  is the Offert catalog total. Qty > 1 splits. Physical stamp card stays the
  counter; no customer/stamp tracking. Android research: React cart + SQLite
  snapshot JSON + Convex optional `complimentary` flag; no Kotlin/plugin.
  Checks: `tsc -b`, `check:pos`, `check:orders`, `check:printing` golden
  unchanged, `check:css-scope`, `npm run build`. Local Offert path in
  `check:sales` passed; live Convex seed then failed on café Cappuccino
  Regular size (pre-existing snapshot, not Offert). Convex functions
  deployed to colorful-newt-937. Install-over debug APK on SM-X115
  `R8YX91AKWXJ`; app restarted. Uncommitted so the owner can revert with
  `git restore`. Exact next action: owner unlocks, adds a drink, taps the
  gift on the photo; keep or revert; commit only if asked.
- POLISH-01 (29 Aug 2026): Orders detail dropped customer, table, tax,
  View receipt, and the dummy Synced control. Service and created sit on
  one line; footer is Reprint + Cancel; payment (subtotal/total) fills
  the freed space. Snapshot fields stay on receipts for old rows. Exact
  next action: owner checks; commit when asked.
- POLISH-01 (29 Aug 2026): Dashboard Sales rhythm now has the same Y-axis
  ticks as Reports (`formatCompactMoney` at 100/75/50/25 of the period max).
  Peak bar gets the Reports white cap. Tap a bar on Dashboard or Reports for
  a small amount pill on that bar; Reports bar colors/scale unchanged. Live
  colorful-newt-937 29 Aug: net 54200 / 5 orders / 22 items, avg 10840,
  +271.2% vs 28 Aug 14600, peak 29 Aug (not 27 Aug 23200). Best seller
  Hojicha Latte 11 units. SM-X115 screenshots: Y-axis, peak cap, tap 27
  `232,00 MAD` and tap 29 `542,00 MAD` on both charts. `check:css-scope`,
  `npm run build`. Did not run `seed:dev` / `check:dashboard` /
  `check:reports`. Exact next action: owner continues POLISH-01; commit
  when asked.
- POLISH-01 (29 Aug 2026): Dashboard right cards stay equal 334px, but
  lists are four fixed 60px slots (240px). Two stock warnings sit in
  slots 1–2; empty room left for 3–4. Four recent orders fill all four
  slots. Other pages already use fixed table slots (Orders 6×68,
  Products 6×66, Stock 5×62, Reports 3×28) and were not stretched.
  SM-X115: no overflow. Exact next action: owner continues POLISH-01;
  commit when asked.
- POLISH-01 (29 Aug 2026): shared right panels 400px / left 886 on
  Orders, Products, Stock, Reports, and Dashboard. On `origin/main` as
  `bb6652aaf454e0b52bffbe77c11bf95b5d1aeef3`.
- SYNC-09 (29 Aug 2026): verify-only. colorful-newt-937 has receipts
  `0826-0001`…`0826-0018` on device
  `device-9a9b0736-2f17-4923-af5f-c280c9d67bfa`. `dailyMetrics` 2026-08-29
  is `orderCount` 3, `grossCentimes`/`netCentimes` 9700 (0826-0016…0018);
  27 Aug 11/23200; 28 Aug 4/14600. Matching sale totals. Cloud path already
  correct; no `sales.accept` / `dashboard.ts` patch. Locked: online Dashboard
  and Reports stay Convex-only; still-unsynced tickets stay on Orders;
  `offlineViews` remain offline tablet-only. No SQLite+cloud merge, polling,
  or unsynced Dashboard copy. Android research: React/data Convex queries
  plus existing offline SQLite views. No Kotlin, plugin, WorkManager, or
  native charts. Rejected: merging local receipts into online totals;
  polling `dailyMetrics`; a second analytics store. Official offline-first
  local source of truth
  (https://developer.android.com/topic/architecture/data-layer/offline-first).
  WorkManager continues after the app leaves the visible state
  (https://developer.android.com/develop/background-work/background-tasks/persistent)
  and is rejected here. `check:offline` source-match. `npx tsc -b`.
  `npm run build`. Did not run `seed:dev` / `check:dashboard` /
  `check:reports`. Exact next action: POLISH-01.
  On `origin/main` as `590696ebe2ebd6776fec144bc4950808621242e0`.
- Install-over debug APK on SM-X115 `R8YX91AKWXJ`. Samsung keyguard blocked
  the UI; PIN not invented. Café SQLite not wiped. Proof is Convex tables
  plus hook source-match.
- POLISH Customize-order CSS remains on `origin/main` as
  `7e9e6b573ad9f6813a91f05bef1aa547728f107e`; not restaged.

- SYNC-08 (29 Aug 2026): `perform()` throws existing sentences when the
  worker never starts — `CONNECTION_SYNC_FAILURE` if internet is not
  validated or the activity is unfocused; the access sentence if staff
  provisioning is still pending. No quiet `{ synced: 0, pending }` return,
  no `loadTerminalSettings` / `recordSyncFailure` on that path, throw
  before `try`. Android research: React/data uses existing
  SecureSession-validated `available` plus WebView focus; no Kotlin,
  plugin, WorkManager, or native Sync button. WorkManager rejected
  (persists after the app leaves the visible state). Notification-shade
  sync rejected (`foreground === false` is correct). Checks:
  `check:reconnect` (throws + no `synced: 0` skip), `check:settings`,
  `npx tsc -b`, `npm run build`. Install-over debug APK on SM-X115
  `R8YX91AKWXJ`. Lock screen blocked Settings; PIN not invented. Café
  SQLite not wiped; outbox 0/0. On `origin/main` as
  `0379d0c1011a8a820d71a9ac173e0e85bd7d4942`. Exact next action: SYNC-09.
- POLISH Customize-order CSS remains on `origin/main` as
  `7e9e6b573ad9f6813a91f05bef1aa547728f107e`; not restaged.

- SYNC-07 (29 Aug 2026): `pendingSyncCount` is pending+failed sale outbox
  rows (`sale-completed`, `sale-cancelled`), not `COUNT(*)` of all outbox
  types. Existing Settings copy kept (`Waiting sales`, `N waiting`,
  `N saved order(s) still need synchronization.`, zero-sales success
  `Menu and synchronization state are up to date.` even if management
  remains). Android research: count stays React/data SQLite via the
  existing Capacitor plugin; no Kotlin, plugin, WorkManager, or native
  badge. Checks: `check:settings` (1 sale restart, then 3 sales + 1
  `management.category.delete` → count 3 not 4). `npx tsc -b`.
  `npm run build`. Install-over debug APK on SM-X115 `R8YX91AKWXJ`.
  Café outbox empty (0/0); lock screen after launch; PIN not invented;
  Settings not opened. Mixed-queue proof is the check fixture.
  On `origin/main` as `91a71642629fe36f39750955a92cb53543f80377`.
  Exact next action: SYNC-08.
- POLISH Customize-order CSS remains on `origin/main` as
  `7e9e6b573ad9f6813a91f05bef1aa547728f107e`; not restaged.

- SYNC-06 (29 Aug 2026): verify-only. SYNC-02 + SYNC-03 cover Orders Retry;
  added `check:orders` sqlite fixture; no UI copy. A failed
  `management.category.save` parent still in outbox does not hide the sale
  after `makeLocalSaleRetryAvailable`. A still-pending parent still hides
  the child until it leaves `pending`. Case C cannot happen after SYNC-03 in
  this worker. Android research: retry is React/data SQLite + existing
  reconnect worker; no native plugin, WorkManager, or Capacitor change.
  Checks: `check:orders` sqlite half (chained retry listing); cloud half
  stopped at unset `OLASO_OWNER_PIN`. `check:reconnect`. `npx tsc -b`.
  Install-over debug APK on SM-X115 `R8YX91AKWXJ`. Café SQLite not wiped.
  Live chained Retry not reproduced (0016/0017 already synced).
  On `origin/main` as `79b10d6555fb5e529d806e575677e7af4cbf1ced`.
  Exact next action: SYNC-07.
- POLISH Customize-order CSS remains on `origin/main` as
  `7e9e6b573ad9f6813a91f05bef1aa547728f107e`; not restaged.

- SYNC-05 (29 Aug 2026): `PERMANENT_SALE_SYNC_FAILURE` unchanged after
  re-reading every `conflict(` / `invalid(` string in `convex/sales.ts`.
  Card-listed permanent phrases are already in the regex (product gone,
  revision, newer recipe, cost no longer matches, receipt-number format).
  Classified receipt-number still matches `/receipt-number support/i`.
  Not added on purpose: selected-size unavailable, current-recipe
  unavailable, daily-summary / correction conflicts, recipe-ingredient
  unavailable/missing. Generic `Sale synchronization failed.`, SYNC-04
  `Cloud rejected this saved order. Use Sync now to retry.`,
  `CONNECTION_SYNC_FAILURE`, and extra-field dumps must not abandon.
  `failSale` / `abandonSale` control flow unchanged. Android research:
  abandon is React/data only; no native plugin, WorkManager, or Capacitor
  change. Checks: `check:sales` local half (`isPermanentSaleSyncFailure`
  asserts); cloud half stopped at unset PIN. `npx tsc -b`. Install-over
  debug APK on SM-X115 `R8YX91AKWXJ`. Physical permanent conflict not
  reproduced; regex reviewed. Café SQLite was not wiped or injected.
  On `origin/main` as `b5a0577c348e89be82125a2ce63a29f2b0ca4bff`.
  Exact next action: SYNC-06.
- POLISH Customize-order CSS remains on `origin/main` as
  `7e9e6b573ad9f6813a91f05bef1aa547728f107e`; not restaged.

- POLISH: Customize-order is a column flex so footer + 24px padding stay
  visible at 544px max-height; groups scroll in leftover space (no 400px
  groups cap). On `origin/main` as `7e9e6b573ad9f6813a91f05bef1aa547728f107e`.
- POLISH-01 (29 Aug 2026): OverlayPortal so dialogs cover Header; Orders/
  Products/Stock pager uses saved COUNT not loaded rows; Customize-order
  `.dialog` 680→544px and `.groups` 500→400px (20%). On `origin/main` as
  `694775f19016de01ac2886b7b4a3eaad26f60a76`. Debug APK install-over succeeded
  on SM-X115 (`R8YX91AKWXJ`).
- SYNC-01 closeout (29 Aug 2026): owner unlocked, Settings → Sync now. Convex
  colorful-newt-937 now has tablet receipts **0826-0001 … 0826-0018**. Batch
  0001–0017 plus the category-delete outbox row drained in one Manual Sync;
  0018 (Cappuccino) auto-synced after checkout. Schema extra-field reject was
  the only blocker for this queue.
- Why 0016/0017 also synced (not SYNC-02): the category delete was **pending**,
  waiting on failed 0014. Manual Sync flips all `failed` sales back to
  `pending`. 0014 then succeeded, the delete’s parent left `outbox`, then
  0016/0017 became eligible. SYNC-02 remains a latent bug only if a parent
  **stays failed** forever.
- Exact next action: owner opens POS, adds a many-option product, and judges
  whether the 20% shorter Customize-order popup is enough. Do not start
  SYNC-02 unless a parent stays failed.

- Sale-sync bug override (29 Aug 2026): tablet POS orders are not saved in
  Convex. Ledger: [goals/GOAL-06-SALE-SYNC.md](goals/GOAL-06-SALE-SYNC.md).
  SYNC-01 first. POLISH-01 paused (`PLAN.md` mandatory bug rule).
- Diagnosis: `sales.accept` writes `sizeId` / `sizeName` / `choiceValueIds` onto
  `receiptSnapshot.lines`; schema `receiptLine` rejects extra fields. Convex
  logs 27–28 Aug; cloud `sales` still only July seed `dev-sale-0001`–`0013`.
- Tablet SQLite (`R8YX91AKWXJ`, `olaso_posSQLite.db`): 15 failed
  `sale-completed` (0826-0001…0015, 2 tries, `Sale synchronization failed.`);
  one pending `management.category.delete` depending on failed 0826-0014;
  today 0826-0016/0017 pending 0 tries, depending on that delete. Outbox count
  18. ADB was `unauthorized` on the first attempt that day, then `device`.
- Exact next action: SYNC-01 when the owner continues. Do not implement until
  that card is activated.

- POLISH-01 tablet UI (Boxicons, sliding green pills on nav/filters/Products
  categories, shared App Header so the top pill can move, screen fade, POS
  in-card category bloom, CSS Module scope guard) is on `origin/main` as
  `808ea0724f45f5c8df46e682faabeaee17d03dde`. Product grid does not animate.
  POLISH-01 remains pending until owner closeout.
- Exact next action: owner continues POLISH-01 review.

- POLISH-01 POS search band: owner rejected variable-width priced chips (ragged
  row, ellipsized names, fourth chip clipped). Quick-add is now at most three
  equal-width name-only chips at 15px filling the remaining 636px beside the
  320px search field (`left: 330px; right: 0;` = 10px gap). `QUICK_ADD_LIMIT`
  is 3. Debug APK install-over succeeded on SM-X115; tablet was Dozing/locked
  so visual confirm is blocked. Uncommitted.
- Exact next action: owner unlocks the Tab A9 and visually confirms three flush
  equal chips; then review/commit.

- Root cause of the stacked search-field icon: `PurchaseDialog.module.css`,
  `ExpenseDialog.module.css`, `CompensationDialog.module.css`, and
  `StaffDialog.module.css` each grouped a bare `label` (and, in PurchaseDialog,
  a bare `footer`) into a `display: flex; flex-direction: column` rule. CSS
  Modules only rewrite class names, so those selectors stayed global. Visiting
  Stock, Reports, or Settings appended that chunk's stylesheet after
  `index.css` and column-stacked every `<label>` in the app until reload —
  which is why the fault followed the operator back to POS and Orders and
  vanished after a cold start. All four selectors are now scoped to their
  container class. The earlier `label { flex-direction: row }` line in
  `globals.css` was a misdiagnosis and is removed. `npm run check:css-scope`
  fails on any CSS Module selector that does not start with a hashed class.

- The Tab A9 was deliberately wiped by an uninstall to install the debug beta;
  the owner confirmed the sales on it were mock data. The tablet needs an online
  owner sign-in again, and quick-add chips stay hidden until it has saved sales.

- POLISH-01 Lock + Dashboard is on `origin/main` as
  `10765f8104f37ae3de4c62326b963029e6418676`. Lock sign-in cleaned and scaled
  with in-app staff list; Dashboard today follows the local date, quiet today
  vs yesterday shows down, best seller is most units sold online and offline.

- Opening-quantity price is installed-over on the Tab A9 (`R8YX91AKWXJ`). Add ingredient now requires price paid when quantity is greater than 0; that quantity is the first purchase. Café SQLite was preserved.
- Sizes save fix is installed-over on the Tab A9. Adding a third size no longer rewrites the first two. Café SQLite was preserved.
- Add product now opens a modal like Add ingredient / Add category. Prior inline right-rail create looked like a no-op. Uncommitted.
- Add product now opens a modal like Add ingredient / Add category. Prior inline right-rail create looked like a no-op. Uncommitted; needs signed install-over.
- Add product tap miss: Choices dialog CSS leaked a global `header > button { width: 38px }`, crushing the catalog pill to the icon. Scoped under `.dialog`. Uncommitted; tablet still needs a rebuilt debug APK to pick it up.
- OPTIONS-04 is on `origin/main` as `ca7c9540dc29f7778f63d3f73bd19ffc7d6c5f00`.
  Exact next action: stop; OPTIONS sequence complete; ask before POLISH-01.
- OPTIONS-03 is on `origin/main` as `3587c3c2c419fe01a9c27bbb3e60ec4cc095e962`.
- OPTIONS-02 is on `origin/main` as `6f072c64074b85ad958e4a1227fd14854e5afcc9`.
- OPTIONS-01 is on `origin/main` as `ebd3ac0a349ad69c8242f5f8718d3bae63652318`.
- HARD-07 is on `origin/main` as `bb9279350c95779b1503964bb8dd80d4322c2a3c`.
- Client ship gate (do not forget before café handoff): signed release with
  `debuggable false`, durable upload key, shop `versionName`, higher
  `versionCode` than installed tablets, publish update channel, physical About
  update smoke. Recorded in `PLAN.md`, HARD-08, and `tools/release/README.md`.
  Updates need versionCode/signing/channel — not debuggable.
- HARD-06 follow-up is on `origin/main` as
  `f1f3168c927fae74c47d4d9353e556b7f8fe4870`. Shop versions `1.0`/`1.1`
  (versionCode 7/8), About shows `Version 1.1` only, Tab A9 proved private/public
  update path and install-over with preserved firstInstallTime.
- NAV-01's category-image correction is committed and pushed directly to
  `origin/main` as `4890e9f6055cbb1b52a2ab1402576bf4f14adf05`.
  The physical online/offline original sequence, five repeat cycles, focused
  checks, installed Android beta, clean app logs, and Graphify all pass. No
  card is in progress. Exact next action: stop; activate HARD-02 only when the
  owner asks to continue.
- NAV-01's reopened category-image root fix is complete on the physical Galaxy
  Tab A9. Coffee → Bakery → Reports → POS → Coffee preserves all nine original
  Coffee image objects; the first Bakery visit adds only its two new images,
  and later Bakery/Coffee switches remove/add zero images. Five repeated
  complete cycles and the same flight-mode cycle all pass with zero rebuilt
  images, exactly one visible category grid, no visible alerts, and exact
  1340 by 800 viewport. HARD-02 stays pending.
- Official React Activity guidance explicitly preserves hidden component DOM
  and state while cleaning up hidden effects; Android's current rendering
  guidance warns against redundant bitmap uploads and repeated view work.
  Capacitor already hosts this React content in the existing native WebView.
  Keep the fix in the existing POS presentation boundary, reuse installed
  React Activity for previously visited categories only, prune unavailable
  categories, and reject a native plugin, image-cache package, or eager
  rendering of categories the cashier has not visited.
- Sources: https://react.dev/reference/react/Activity;
  https://developer.android.com/topic/performance/vitals/render;
  https://capacitorjs.com/docs.
- The existing regression now guards visited-only live-category React Activity
  retention and unavailable-category pruning. Navigation, POS cart/money,
  lock/staff switching, offline screens, local catalog, TypeScript, production
  build, and the complete 140-task Android beta all pass. The updated beta is
  installed; Bakery product add/remove works; internet and the empty Coffee
  cart are restored; focused Capacitor/chromium/Android app errors are absent.
- Graphify is refreshed to 3,338 nodes, 7,629 edges, and 161 communities.
- NAV-01 implementation push and SHA recording are complete; HARD-02 remains
  pending until the owner explicitly requests the next card.
- NAV-01 is complete and pushed directly to `origin/main` as
  `0e79396d56215f193d80dafd3405518f1e26f2d3`. No card is in progress;
  HARD-02 remains pending until the owner explicitly asks to continue.
- Final NAV-01 implementation and physical owner/cashier matrix pass. Five
  post-build cold/warm runs retain usable startup; five additional settled
  rounds across Dashboard/POS/Orders/Products/Stock/Reports prove all 30
  switches have zero SQLite requests, zero added/removed images, one visible
  screen, and preserved search, drink-image identity, report tab, stock filter,
  and scroll. Owner/Samira flight-mode switching preserves an unfinished order,
  clears prior-role screens, and limits cashier navigation to POS/Orders.
- Final 140-task Android beta is installed. A formerly unprovisioned Samira
  profile is repaired through the existing protected support action, false
  pre-menu invalid-order feedback is root-fixed, receipt-language changes
  propagate to retained POS and were restored, physical sleep/resume preserves
  1340 by 800 and updates the clock in 85 ms, and all 13 sales/seven existing
  outbox rows/two active staff remain intact. Focused navigation, local,
  identity, offline, lock, POS, costs, receipt, Android, TypeScript, and
  production-build regressions pass.
- Graphify is refreshed to 3,334 nodes and 7,625 edges. Final normal owner POS
  has exactly one visible/six retained screens, unclipped 1340 by 800 geometry,
  restored internet, an empty QA cart, no alert, and clean Android runtime.
- Exact current next action: stop. When the owner requests the next card,
  research current official Android/Capacitor splash and icon guidance, then
  activate HARD-02 alone for the approved branded launch and app icon.
- NAV-01's official Android guidance recommends
  preserving each visited navigation destination's saved state and keeping
  previously loaded content immediately available; official React 19.2
  Activity boundaries preserve state and DOM while automatically cleaning up
  hidden effects/subscriptions. Capacitor confirms Android foreground events
  already belong to the existing native Activity/app lifecycle boundary.
- Native-versus-React decision: keep physical lifecycle/connectivity and
  protected SQLite/session ownership in their existing Android/Capacitor
  boundaries; retain only role-authorized, previously visited screen trees in
  App's existing React navigation owner. Reuse the installed React Activity;
  reject Jetpack navigation/ViewModel integration into a WebView-only shell,
  router/state/cache packages, permanently running CSS-hidden pages,
  preloading unauthorized screens, and a new native plugin.
- Official sources: https://react.dev/reference/react/Activity;
  https://react.dev/blog/2025/10/01/react-19-2;
  https://developer.android.com/topic/architecture/ui-layer/stateholders;
  https://developer.android.com/guide/navigation/backstack/multi-back-stacks;
  https://capacitorjs.com/docs/apis/app.
- HARD-01 is complete and pushed directly to `origin/main` as
  `0e0042aeb2da5f9df534fa0f5184d176965d3f8d`; its verified measurements remain
  the NAV-01 before-change baseline.
- HARD-01's complete physical Galaxy Tab A9 baseline passes: five true cold
  Android first-frame runs are 1,047/1,072/1,081/1,098/1,148 ms
  (median 1,081); usable Lock/profile is 1,888–1,934 ms (median 1,912); owner
  tap to cached POS is 805–916 ms (median 885). Five true warm Activity
  recreations display in 184–236 ms (median 191), expose Lock in 495–570 ms
  (median 515), and reach local POS in 709–830 ms (median 766).
- Five passes through all six screens prove 30 repeat reconstructions. POS
  returns take median 180 ms, issue 15–30 SQLite calls, and recreate all 14
  images; Products issues 10–24 local calls, Stock 15–34, Reports 5–20, and
  Orders 2–14. Nine 1,408 by 768 PNG drinks render at only 72 by 92; the
  current 31,626,309-byte debug APK includes 4,276,415 bytes of PNG assets,
  925,371 bytes of eager JavaScript, 265,782 bytes of CSS, 652,953 bytes of
  browser-only SQLite WASM, and 19,414,484 bytes of four-architecture native
  SQLite libraries. Exact figures and boundaries live in Goal 06's HARD-01
  baseline section.
- Physical flight mode independently proves cold/warm Lock at 1,815/563 ms,
  offline owner unlock to POS at 410/422 ms, and all six screens. An explicit
  native unfinished SQLite transaction followed by warm recreation now rolls
  back safely; owner unlock remains successful and all original 13 sales,
  seven existing historical outbox rows, and two active profiles are intact.
  Online state is restored; normal cold/warm tablet logs are clean.
- Final automated checks pass: Android identity/native lifecycle, local SQLite,
  local management/catalog/inventory/compensation/staff, lock switching,
  settings, protected identity, reconnect, offline screens, POS cart/money,
  exact costs, receipt bytes, TypeScript, and the full production web build.
- Graphify is refreshed to 3,320 nodes and 7,602 edges. Final tablet inspection
  confirms the exact 1340 by 800 body, restored internet, and no focused
  Android/WebView runtime errors.
- HARD-01's final evidence is preserved; NAV-01 now owns the measured
  retained-screen improvement and its role/lifecycle security matrix.
- The true same-process warm-launch database bug is root-fixed. Activity
  teardown now schedules rollback of any incomplete transaction followed by
  connection close on that bridge's existing plugin thread before its safe
  shutdown. Closing from the UI thread, or closing without rollback, was
  physically disproven: SQLite retained an in-use connection and remained
  locked. The existing Android beta check now requires ordered rollback then
  close before bridge destruction; the rebuilt/reinstalled 140-task beta
  reproduces the original warm `LaunchState: WARM` plus successful owner
  sign-in, local POS, and all six screens without the former SQLite failure.
- Additional official sources:
  https://developer.android.com/guide/components/activities/activity-lifecycle;
  https://github.com/capacitor-community/sqlite/blob/master/docs/APIConnection.md.
- HARD-01's official Android startup guidance confirms
  that cold, warm, and hot launches differ and that the first activity frame is
  not equivalent to a usable local application. Android's benchmark guidance
  requires repeated median/minimum/maximum evidence on real hardware and a
  release-like profileable build for its full Macrobenchmark framework.
- Reuse the connected Galaxy Tab A9, Android `am start -W`/system timing, and
  the existing development-only debuggable Capacitor WebView. Measure SQLite,
  lock, POS/menu readiness, repeat screen work, APK/bundle/image weight, and
  offline behavior at their actual native and React/data boundaries. Do not
  add a benchmark module, native plugin, package, permanent telemetry,
  production debugging, extra listeners, or secret logging.
- Official references:
  https://developer.android.com/topic/performance/vitals/launch-time;
  https://developer.android.com/topic/performance/benchmarking/macrobenchmark-metrics;
  https://developer.android.com/topic/performance/benchmarking/macrobenchmark-overview;
  https://developer.chrome.com/docs/devtools/remote-debugging/webviews;
  https://capacitorjs.com/docs/apis/app.
- The owner explicitly restored the original Goal 06 sequence: DELETE-01 first,
  then navigation/startup, recovery, release, and security; the separate
  OPTIONS-01 through OPTIONS-04 blueprint follows before final owner-led UI
  polish and acceptance. DELETE-01 and HARD-01 are complete; NAV-01 is next.
- DELETE-01 is committed and pushed directly to `origin/main` as
  `dc86855798041f1e772a7ca3d8729841549faa9d`. Its implementation,
  official Android research, populated schema-19 migration, immutable history,
  real deletion controls, archived-copy cleanup, protected access, full
  regression, Android beta, physical offline/restart/reconnect sequence, exact
  cloud effects, 1340 by 800 screens, clean logs, and Graphify all pass.
- DELETE-01 official Android/Capacitor/Convex research is complete. Android's
  offline-first guidance requires SQLite to remain the screen-visible source
  of truth and deferred durable writes. Android SQLite warns foreign-key
  cascades do not execute unless enforcement is enabled. The existing
  Capacitor SQLite plugin supports explicit transactions, rollback, and bound
  DELETE operations; Convex mutations provide transactional indexed deletion.
  Reuse the existing native SQLite, protected session, management outbox,
  actor-aware foreground sync, and Convex domain boundaries. Do not add Room,
  WorkManager, native code, a state library, or direct UI-to-network writes.
- DELETE-01 caller tracing is complete. SQLite currently prevents live deletion
  through category/product/ingredient/staff foreign keys; pending sales still
  need their original live cloud records until acknowledged; offline ingredient
  reports currently lose names when their live row disappears; and protected
  staff credentials must remain available only until that person's already-
  queued authenticated work has synchronized. The fix is one additive ordered
  migration with independent immutable history snapshots, nullable category
  ownership, dependency-ordered delete operations, bounded owner/manager cloud
  mutations, immediate local UI updates, and delayed protected cleanup.
- SQLite schema 19 now upgrades existing records without disabling foreign-key
  enforcement. Categories can release their products, immutable recipes survive
  product removal, and stock/purchase/recipe/compensation history owns its
  ingredient/product/staff name snapshots independently. The first attempted
  parent-table replacement exposed a real deferred-foreign-key commit failure;
  its root cause was fixed by rebuilding dependent tables before their parents.
  Existing local migration, catalog, inventory/cost, and staff checks all pass.
- Permanent category, product, ingredient, and staff deletion is now wired
  through authorized atomic SQLite writes, pending-order dependencies, bounded
  Convex mutations, actor-scoped reconnect, and short confirmation controls.
  Category removal leaves products uncategorized and sellable; product removal
  retains immutable recipe/order history; ingredient removal retains
  purchase/movement/report snapshots, removes choice effects, keeps remaining
  ingredients in a new immutable recipe version, and marks affected drinks
  unavailable; owner-only staff removal preserves wages and earlier queued
  actor access until cloud revocation. Historical sale items now snapshot
  category identity, and same-day cancellation remains possible after an
  ingredient or category disappears.
- Populated schema-upgrade, category/product deletion, uncategorized editing,
  ingredient recipe/choice repair, purchase and wage retention, staff role
  protection, pending-sale parent order, historical category-report, TypeScript,
  Convex code-generation, and production-build checks pass. One initial sale
  regression lacked its explicitly required test PIN; rerun protected live
  checks with the owner-authorized PIN after deploying the current functions.
- The deployed Convex management check now also proves true category/product/
  ingredient/staff deletion, uncategorized editing, immutable recipe repair,
  removed modifier effects, retry-safe acknowledgement, and preserved worker
  compensation. A real historical-report bug was found before tablet QA:
  deleted workers' wages retained the amount but displayed generic `Staff`.
  Local creation, cloud replacement, saved reads, and the Costs screen now
  preserve/use the worker's immutable name and role; the existing staff check
  reproduces the deleted-worker report and passes.
- First physical installation upgraded the existing tablet from schema 18 to
  19 without losing its 11 sales or seven pre-existing failed historical
  queue rows. Device inspection exposed 678 stale archived ingredients and 44
  obsolete archived profiles left by earlier cloud replacements. The shared
  replacement boundary now deletes absent archived ingredient/staff copies,
  retains any copy required by pending actor/sale work, preserves independent
  recipe/movement/wage history, and returns obsolete profile IDs for protected
  credential cleanup. The expanded populated local-catalog regression proves
  both safe removal and pending-record retention with foreign keys enforced.
- The first cleanup APK exposed one more root cause: 420 obsolete ingredients
  shared the deterministic current snapshot timestamp, so timestamp comparison
  falsely preserved stale rows. Complete replacement now uses actual received
  live-record membership instead; focused checks reproduce stale rows with the
  exact same timestamp while preserving historical and pending records.
- Physical flight-mode QA created one real category, product, ingredient,
  immutable recipe, completed sale, and protected cashier; deleting each live
  record preserved the order, stock history, repaired recipe, owner/Samira
  access, and every pending operation across a forced app restart. Reconnect
  exposed a genuine cross-domain ordering bug: category, ingredient, and
  product deletions all depended on the same sale, so catalog sync could
  remove the product before inventory sync updated its revision. Destructive
  operations now follow the latest already-queued descendant of their required
  sale, preserving both the sale parent and the true category/ingredient/
  product sequence. The existing populated catalog check reproduces and guards
  that ordering; catalog, inventory, management, and TypeScript checks pass.
- The final Galaxy Tab A9 beta repeats the complete category/product/ingredient/
  recipe/sale/deletion sequence in flight mode. Its persisted dependency chain
  is category save → product save → ingredient save → recipe save → completed
  sale → category deletion → ingredient deletion → product deletion; automatic
  reconnect acknowledges every operation without conflict and the exact cloud
  sale count is one. The owner and Samira remain usable, the disposable
  cashier is permanently absent, deleted product/category/ingredient names
  still appear in Orders and Reports, 13 local sales and all historical stock
  effects remain intact, no PIN occurs in queued staff payloads, foreign-key
  checks are empty, all touched screens fit 1340 by 800, and focused Android
  error logs are empty. Repeated reconnect changes no sale or live record.
- Final `check:local`, `check:local-management`, `check:local-catalog`,
  `check:local-inventory-costs`, `check:local-staff`, `check:offline`,
  `check:reconnect`, `check:pos`, `check:settings`, `check:lock-switch`,
  `check:android`, `check:printing`, `check:convex`, TypeScript, the
  140-task Android beta, and `npm run build` pass. Prior real-cloud management,
  sales, inventory, identity, permissions, Orders, Dashboard, and Reports
  checks pass; Graphify is current at 3,287 nodes and 7,552 edges.
- Exact next action: stop with no card in progress. When the owner explicitly
  starts the next card, research current official Android/Capacitor startup
  profiling guidance and activate only HARD-01 for the measured physical
  startup/navigation baseline.
- The owner-approved product configuration blueprint is documented in
  `goals/GOAL-06-PRODUCT-CONFIGURATION.md` and reflected in `PLAN.md`,
  `PRODUCT.md`, `ARCHITECTURE.md`, `DESIGN.md`, and the Goal 06 task board.
  Product-owned sizes and independently copied custom choices determine exact
  selected ingredients, stock deductions, costs, and immutable order history.
  Disposable packaging, nested ingredient recipes, and a detailed Edit Product
  profitability preview are excluded. House-made syrup stays one manually
  priced ordinary ingredient. This separate OPTIONS-01 through OPTIONS-04 plan
  follows the original technical sequence; final owner-led visual polish
  remains the last change phase.
- The documentation-only blueprint commit is pushed directly to `origin/main`
  as `b68aa8c11a01229cc2f7f0fdf176f324e046cd24`. All seven local Markdown
  documents have valid internal links. The original documentation checkpoint
  was later superseded by the owner's explicit DELETE-01-first sequencing.
  No source or Android code changed, so no unchanged APK was rebuilt.
- DELETE-01 is complete; HARD-01 and all separate product-configuration
  implementation cards remain pending until individually authorized.
- LOCAL-04 is complete and pushed to `origin/main` as
  `7f240210c2a591649f7fabd3c3fe51fb9db72df3`.
  SQLite schema 18 stores new sale/correction actor profile IDs; every queued
  management/sale/correction write resolves the originating profile's protected
  session instead of crediting the later synchronizing staff member. On the
  physical SM-X115, manager-created catalog, modifier, recipe, ingredient,
  purchase, count, expense/correction, and owner compensation work all saved in
  flight mode, appeared immediately, survived repeated install/force-stop/
  restart, synchronized in dependency order under the owner, and remained one
  cloud effect after repeat reconnect. Exact cloud `updatedBy` stayed LOCAL04
  Manager for manager work and Olaso Owner for staff/compensation.
- Root-fixed replacement accumulation across catalog and finance: Products
  dropped from 500 stale rows to the current 15, Stock normal view from 675 to
  14 active ingredients, and stale anonymous compensation/LOCAL03 expense rows
  disappeared. Pending local rows and stock/sale history are explicitly
  preserved; archived records appear only through deliberate filters. The
  development reset removed all LOCAL04 QA cloud data, authenticated directory
  reconciliation left only Owner and Samira active, and the tablet remains at
  schema 18 with 11 sales plus the seven unchanged historical failed sale/
  correction outbox rows and zero management rows.
- The apparent 1340 by 2244 install reading was measured while Samsung keyguard
  owned a portrait display and Olaso was hidden. System unlock returned 1340 by
  800. A real bug did exist: wake behind keyguard could mark the visible document
  foreground and retry Convex DNS. Foreground now requires document visibility
  plus window focus. Two exact hidden wake cycles produce zero WebView errors;
  final unlocked POS is 1340 by 800 with zero focused Android failures. Full
  local/cloud/permission/identity/Android/TypeScript/build regression passes;
  Graphify is current at 3,241 nodes and 7,452 edges. The current active card
  and exact next action are the DELETE-01 checkpoint above.
- Updated owner deletion decision: archive is not the universal answer.
  Products can be removed while completed orders keep immutable snapshots.
  Deleting a category leaves its products uncategorized. Deleting an ingredient
  removes live recipe/choice references and identifies affected products for
  repair while preserving purchase, stock, valuation, and sale history. The
  owner may remove live staff profiles while preserving historical actor names
  and roles; the last owner cannot be removed. Completed sales, corrections,
  purchases, movements, expenses, and compensation remain immutable or
  append-only. DELETE-01 implements these approved rules now, before the
  separate OPTIONS-01 through OPTIONS-04 plan.
- LOCK-01 is complete and pushed to `origin/main` as
  `4486a8921d893e3e5edce098b8a17a500cf0a537`. A shared profile menu gives every
  role `Lock / switch staff`; Settings remains owner-only. `App.tsx` owns the
  deliberate switch, asks for confirmation only when the cart has lines, then
  reuses the existing persisted local lock without clearing `posSession` or any
  profile-scoped protected credential. The installed SM-X115 proved owner and
  cashier menus, empty immediate lock, non-empty cancel/confirm, exact cart
  handoff, online and offline unlock for both profiles, force-stop/restart lock,
  and no sale/count mutation. Live WebView content is exactly 1340 by 800 with
  no overflow or warning/error; focused Android runtime failures are zero. Full
  lock/POS/local/sales/Orders/Dashboard/Reports/identity/Settings/staff/
  reconnect/offline/Android/TypeScript/build checks pass. No card is currently
  in progress. Exact next action when the owner continues: research and
  activate only LOCAL-04 for the full offline-management closeout matrix.
- CATALOG-01 is complete and pushed to `origin/main` as
  `43c9e4a3ed169ae7a07344f9587a51f65051e203`.
  The six-asset gallery, neutral resolver, category picker, schema 17, and full
  local/outbox/cloud/snapshot/POS path are implemented. The SM-X115 upgraded its
  real schema-16 database in place, preserving 11 sales; the four existing
  categories mapped to distinct keys. In flight mode, `Seasonal-QA` defaulted
  to neutral, changed to snacks/sweets, survived force-stop/restart, then two
  ordered saves became one revision-2 cloud category with zero pending category
  rows and no duplicate after reconnect. QA cleanup archived only that category
  and restored the four real active categories.
- Physical QA exposed and root-fixed three bugs: the local cache mapper attached
  artwork to modifier options instead of categories; the missing favicon caused
  a WebView 404; and Convex sockets/readers retried while offline or hidden.
  Category artwork is now required by the cache type, the favicon is explicit,
  and the shared connection context gates Lock/Orders/Dashboard/Reports/
  reconnect on validated internet plus foreground visibility while retiring
  transport immediately on browser offline hints. The exact screen-off/resume
  plus airplane loss/recovery matrix now yields zero WebView warning/error and
  returns to 1340 by 800. Full local/catalog/staff/sales/Orders/Dashboard/
  Reports/Settings/offline/reconnect/identity/Android/build checks pass;
  Graphify is current at 3,192 nodes and 7,382 edges, authorities/DOX are
  updated, and focused Android runtime failures are zero. LOCK-01 later closed
  the cashier handoff gap recorded by this completed CATALOG-01 checkpoint.
- STAFF-01 is complete and pushed to `origin/main` as
  `9754897f4be65ffca1b572140e44fc229cad948f`. The
  owner-only minimal form, PIN-free local operation, protected immediate
  offline access, restart survival, retry-safe cloud identity/session creation,
  acknowledgement mapping, and protected cleanup are implemented and proved.
  The physical SM-X115 created `Offline-QA` in flight mode, signed it in as a
  cashier before and after app/tablet restart, synchronized exactly once across
  two reconnects, signed in online and offline after promotion, retained Olaso
  Owner and Samira Barista, and then cleanly archived/removed only the QA
  access. SQLite, protected XML, and focused app logs contained no raw PIN.
  The modal descendant-selector bug found during QA is root-fixed and checked.
  The later React empty startup gate now shows an honest status; the distinct,
  pre-existing native generic-splash/white-frame gap remains accurately owned
  by HARD-02/HARD-03 and is not represented as solved. No card is currently in
  progress. Exact next action when the owner continues: research and activate
  only CATALOG-01.
- LOCAL-03 is complete on `origin/main` at
  `1105de62d8133448b7202dd67971ee83c56ced12`. Schema 16, local Stock/finance
  operations, independent sync domains, role-scoped Costs, backend retries,
  physical offline/restart/reconnect proof, lifecycle/focus-zoom repairs,
  Graphify, documentation, and full checks pass. No card is currently in
  progress. Exact next action when the owner continues: research and activate
  only STAFF-01 for protected offline staff/PIN creation.
- LOCAL-02 is complete and pushed to `origin/main` at
  `1cfbf92fe6df3c8d6a8ee2065f60dafdad041d29`. Its local catalog/recipe
  implementation builds and opens on the physical tablet. A failed test APK had rewritten
  published migration 14 and added unsafe uniqueness rules; the tablet database
  was preserved, backed up in app-private storage, restored with commit
  `26ae027`, then upgraded cleanly from schema 13 through the restored migration
  14 and new migration 15. `check:local`, `check:local-catalog`, the production
  build, Android checks/sync/beta build, APK install, owner unlock through ADB,
  POS catalog load, and focused logcat error scan pass. The stale-parent case is
  also repaired: failed sale outbox rows no longer freeze catalog refreshes,
  while pending management rows still protect local catalog changes. Physical
  proof refreshed an archived Coffee ID, created a Coffee product offline,
  survived restart, synchronized it once, and retained seven unrelated sale
  rows. Offline modifier/product/recipe dependency ordering, restart survival,
  POS modifier selection, acknowledgement mapping, refresh cleanup, and QA
  archive cleanup are also physically proved. All required focused/backend/
  build/Android checks pass and Graphify's deterministic code graph is current.
  No card is currently in progress. Exact next action when the owner continues:
  perform LOCAL-03's official Android/Capacitor research and activate only
  LOCAL-03 for local-first inventory, expense, and compensation management.
- The former HARD-03 `triggerEvent` bug was fixed early when LOCAL-03 reproduced
  it. The actual source was Capacitor's Cordova-compatible `pause` evaluation,
  not SecureSession. Normal, screen-off, and notification-shade launches now
  pass without the error; HARD-03 still owns the full startup/long-sleep matrix.
- Universal Android rule: before every remaining card, research current official
  Android and applicable Capacitor/plugin guidance, record the native-versus-
  React/data boundary and rejected alternatives, then prove the choice on the
  physical tablet. Do not treat the APK as a web page or force unnecessary
  Kotlin when a correct native plugin boundary already exists.
- Goal 06 is active on `main`; LOCAL-01 and LOCAL-02 are complete, and LOCAL-03
  is the only active card.
- Owner sequencing decision: the manual screen-by-screen critique and UI polish
  are the final change phase. LOCAL-01 through HARD-07 must first make the app
  fully functional, offline-capable, fast, recoverable, secure, and releasable.
  POLISH-01/POLISH-02 follow; HARD-08 verifies the polished product. No early
  screen polish is the current next action.
- Owner requirement — complete offline operation: the current beta can read
  Products/Stock offline but deliberately rejects management writes. That is
  not accepted production behavior. Goal 06 LOCAL-01 through LOCAL-04 now make
  every role-authorized catalog, recipe, stock, purchase, adjustment, expense,
  compensation, staff-profile, and protected initial-PIN operation local-first,
  restart-safe, immediately visible, ordered, and exactly-once after reconnect.
- Owner requirement — smooth retained navigation: `App.tsx` currently destroys
  inactive screens, restarts their hooks, can clear saved report content, and
  recreates oversized images. Goal 06 NAV-01 retains visited authorized screens
  and their interaction state without active hidden effects; HARD-04 right-sizes
  assets and measures decode/scheduling. Foreground/resume also refreshes the
  local Header/Lock clock immediately. No loading-screen delay, state library,
  custom cache framework, or fake animation is approved.
- Repository workflow reminder: `main` is the only local and GitHub branch.
  Every future change commits and pushes directly to `origin/main`; do not
  create goal, feature, worktree, or handoff branches unless the owner
  explicitly changes this decision. All deleted branches had zero commits
  missing from `main` before removal.
- Completed owner reminder — cashier handoff: LOCK-01 now gives cashiers,
  managers, and owners the shared Lock / Switch staff action without expanding
  Settings access. The approved confirmation preserves an unfinished cart for
  the next verified staff member.
- Owner reminder — post-delivery updates: the client needs a simple remote path
  for approved fixes without receiving APK files through WhatsApp. The source
  repository is private, so the APK must never contain a GitHub token. HARD-06
  now owns signed release automation plus a separate HTTPS download channel,
  Android install confirmation, upgrade/data preservation, rollback, and
  developer-verification readiness. Recommended starting option: a dedicated
  public binary-only GitHub release repository; confirm whether public APK
  availability is acceptable before implementation.

- OFF-01 through OFF-06 are complete under `OFFLINE_RELIABILITY_PLAN.md`; no
  reliability card or production goal is active. The final APK has native
  fitted viewport handling, independent offline staff access/lockout,
  Android-validated connection truth, one authenticated reconnect worker,
  exact-once physical sale sync, credential-revision locking, and bounded
  offline Products, Stock, Dashboard, and Reports data. Physical user review
  corrected the initial false all-screen pass before closeout. Final owner data
  is 11 sales, 12 items, 41 movements, 7 retained failed development outbox
  rows, and 2 corrections; the owner-added `0826-0005` remains untouched.
  OFF-06 is pushed as `c2b05a5f2de28f1ad3a391c24894567af60ffc20`
  on `origin/main`. That narrow reliability ledger remains complete; its saved
  offline reads did not include management writes. Exact next action is Goal 06
  LOCAL-01 when the owner starts it.
- OFF-02 is complete under `OFFLINE_RELIABILITY_PLAN.md`. Owner and Samira were
  provisioned separately, Samira re-signed online, and both independently
  unlocked after force-close/offline restart with their correct roles. The
  authenticated-only directory refresh reduced the prior duplicate cache to
  exactly one active Owner and one active Samira while the locked profile read
  remains non-mutating. The final APK, focused checks, build, 140-task Android
  beta, clean offline logs, restored Wi-Fi, and temporary-artifact cleanup pass.
  Graphify refresh was retried but remains blocked by the missing semantic API
  key and left the existing graph intact. Exact next reliability action:
  OFF-03 was activated after owner direction. The complete repair and current
  owner-approved tablet presentation set are pushed as
  `32dcc14155aeef4df8028b299620e92aaba2c07e` on
  `origin/codex/goal-06-production-hardening`.
- Owner-approved Settings direction: staff profile creation belongs under the
  owner profile, not permanent navigation. The screen must use short café-owner
  language, remove technical security essays and redundant helper copy, and
  use icons only where they materially improve recognition. Do not implement
  this review inside OFF-02; record and approve the minimal Settings flow first.
- The owner accepted the long sleep/resume result after approximately fifteen
  minutes. The current scoped Lock-screen change replaces the first supplied
  matcha artwork with the owner-supplied 1067 × 1272 Olaso drink photo, only on
  the left panel. The white sign-in panel, flat Cream Surface wash, wordmark,
  quote, status, clock, and all lock behavior remain unchanged. `check:settings`,
  `check:android`, and `npm run build` pass; browser inspection at 1340 × 800
  confirms exact viewport/document bounds, no overflow, and no warning/error.
  The Android beta package was rebuilt and installed successfully on connected
  SM-X115 (R8YX91AKWXJ); its Olaso process is running. Graphify refresh was
  attempted but is blocked by the installed CLI's missing semantic-extraction
  API key. Exact next action: owner visually approves or adjusts this Lock
  screen before any commit or another screen.
- The owner authorized three additional scoped review decisions: keep the
  Lock-screen green wordmark but align its visible edge with the slogan; make
  the shared Header the sole live date/time source on POS, Dashboard, Orders,
  Products, Stock, Reports, and Settings; and eliminate the intermittent
  Android oversized/scrollable launch. The Header date/time stays one line and
  immediately follows the saved 12/24-hour setting. The Android scale now
  retries only through a bounded two-second startup/foreground settle window
  and still responds to real viewport/orientation changes. `check:settings`,
  `check:pos`, `check:android`, and `npm run build` pass. The current APK is
  installed on SM-X115; three consecutive force-stopped launches measure
  1007 × 602 with zoom `0.751493` and no overflow. Graphify refresh remains
  blocked by the installed CLI's missing semantic-extraction API key. The owner
  identified the distinct long-tablet-lock resume path, so the current APK also
  runs the same bounded settle sequence when the native activity returns focus.
  Exact next action: owner performs a long lock/unlock with Olaso left open,
  then inspects the resumed layout and shared Header/date/time before approval
  or commit.
- The owner superseded the white Lock-screen treatment: use the exact verified
  transparent Operational Green `#006A2B` wordmark instead, larger on the Lock
  screen and compact in the shared header used by POS, Dashboard, Orders,
  Products, Stock, Reports, and Settings. The typed sign-in identity block and
  all lock, session, permission, and offline behavior remain unchanged.
  `check:settings`, `check:pos`, `check:identity`, `npm run build`, and the
  Android beta checks/build pass. Browser inspection at 1340 × 800 confirms the
  Lock screen has exact viewport/document bounds, no clipping/scrolling, and no
  console warning/error. The debug APK was installed on connected SM-X115 and
  launched. Graphify refresh was attempted after the shared Header change but
  is blocked by the installed CLI's missing semantic-extraction API key; the
  required pre-change graph query was completed. Exact next action: owner
  unlocks SM-X115 to inspect the real Lock and shared-header treatments before
  approval or commit.
- No goal is active. Goal 05 is complete on `origin/main` at
  `aa6d26b651e644db47a521f467b16d01cecab426`.
- Goal 06 is planned next as normal card-by-card collaboration, not one
  autonomous `/goal`. Exact next action is LOCAL-01; POLISH-01 is deferred until
  every card through HARD-07 is complete.
- ID-02 audit repair is complete: strict transport-only offline fallback,
  protected monotonic PIN lockout, fail-closed terminal startup, and
  device-bound token enforcement now cover protected Convex operations; no
  `OLASO_ALLOW_DEV_*` authorization bypass remains. The dedicated dev
  deployment typechecked, accepted a valid token, and rejected a revoked token,
  mismatched device, and wrong PIN without an offline bypass.
- SM-X115 installed-APK evidence: cold restart locks before POS; 1340 × 800
  lock and POS screenshots show no clipping or scrollbars; airplane-mode
  restart reports native validated-network absence and unlocks the cached
  owner session locally. `ACCESS_NETWORK_STATE` fixed the native connectivity crash. Focused
  identity/Android checks, production build, 140-task Android beta, and
  `git diff --check` pass. Reconnected-tablet PIN entry returned to the full
  POS screen with no filtered crash/console errors. Graphify refreshed to
  2,671 nodes and 12,431 edges. ID-02 is done. Exact next action: inspect the
  owner/manager/cashier matrix and current Convex/local/UI data paths for
  PERM-01 without changing policy behavior.
- PERM-01 is complete: one
  owner/manager/cashier matrix now protects Convex functions, navigation,
  routes, and cached operational data. Managers retain operating data and
  expenses but not staff, compensation, or profitability; cashiers retain only
  POS/Orders data and cannot call management functions. SQLite migration 10
  converts legacy cached `worker` roles to `cashier`, and the Convex schema no
  longer accepts the retired role. `npm run check:permissions`,
  `npm run check:local`, `npm run check:identity`, `npm run check:android`,
  `npx tsc -b`, `npx convex dev --once --typecheck enable`, and `npm run build`
  pass. The installed SM-X115 APK has a full 1340 × 800 owner POS screen with
  no filtered crash/console errors; direct permission checks reject cashier and
  manager protected requests. Graphify refreshed to 2,691 nodes and 15,179
  edges. Exact next action: implement the confirmed POLICY-02 operational
  behavior without expanding into refunds.
- POLICY-02 is complete. New
  sales are limited to Dine-in/Take-away and Cash/Card, with no customer/table
  inputs; each local transaction allocates an offline-safe `MMYY-0001`
  counter in migration 11 and preserves all prior snapshots unchanged. Saved
  receipts carry their selected English/French language, logo-only printer
  header, Cash/Card tender, and no-tax representation. Online wrong-PIN
  responses are structured rather than thrown, so the app shows `Wrong PIN.
  Try again.` with no Convex/uncaught console entry. `npm run check:sales`,
  `check:permissions`, `check:identity`, `check:pos`, `check:printing`,
  `check:local`, `check:android`, TypeScript, production build, Android debug
  build, and `git diff --check` pass. SM-X115 APK evidence covers failed and
  successful owner PIN entry and an unclipped 1340 × 800 POS rail with only
  Dine-in/Take-away, Cash/Card, and No tax. Graphify refreshed to 2,711 nodes
  and 17,918 edges. Commit `2bab5512e5d7e9ccb6cfb54a13f79a0ed58654f8` is
  pushed to the canonical branch. Exact next action: implement ORDER-01 alone.

- ORDER-01 is complete. A
  same-day cashier correction keeps the original sale immutable, changes its
  status to cancelled, records the actor, required reason, time, original
  reference, and retry ID, and reverses only the original saved stock/cost and
  daily-summary effects. SQLite migration 12 stores correction audit/outbox
  state; Convex has indexed correction records and rejects duplicate or
  non-completed originals. A missing original returns a structured pending
  result, never a raw Convex message. `check:sales`, `check:orders`,
  `check:permissions`, `check:identity`, `check:local`, `check:pos`,
  `check:android`, TypeScript, Convex typecheck, production build, and
  `git diff --check` pass. SM-X115 evidence covers active-profile refresh,
  owner unlock, unclipped POS/Orders, correction reason dialog, and friendly
  pending-sync copy; filtered crash logs are empty. Graphify refreshed to
  2,731 nodes and 20,715 edges. Commit `eedbcc04d5e8cad91e3bac92e0acc7419a1d0f59`
  is pushed to the canonical branch. Exact next action: verify ID-03 alone.

- ID-03 verification: sync retry failures now persist allowlisted operator copy
  instead of raw Convex/server messages. Focused identity, permission, local,
  sales, orders, Android, TypeScript, Convex typecheck, build, and diff checks
  pass; Graphify is refreshed to 2,731 nodes and 30,626 edges. On SM-X115, a
  wrong PIN renders `Wrong PIN. Try again.`, online and cached-offline unlocks
  recover the unclipped 1340 × 800 POS, reconnect is clean, support recovery
  revokes the old token and requires a fresh PIN, and a full tablet reboot
  starts locked. Recent filtered logcat has no raw Convex/server text or crash.
  Commit `fa132a8c4a5b82f2114f430b25718bcada5593de` is pushed to the canonical
  branch. Exact next action: run POLICY-03 closeout alone.

- POLICY-03 closeout is complete pending its card commit and push. Protected
  test harnesses now establish an owner token after each deterministic reset;
  no check uses the removed development bypass. New same-device sign-in revokes
  the prior opaque token and deletes already-revoked session rows through a
  bounded index. `check:convex`, every focused policy/management/inventory/
  cost/staff/expense/dashboard/report/settings/local/sales/orders/identity/
  permission/printing/Android check, TypeScript, build, Android beta, Convex
  deployment typecheck, and diff check pass. SM-X115 has the final APK
  installed, unlocked with the owner PIN, fitted at 1340 × 800, and recent
  filtered logcat is clean. Graphify refreshed to 2,740 nodes and 44,944 edges.
  Commit `6f4c6a28d4015f43f22f4f9691147ecfa761ea95` is pushed to the canonical
  branch. Goal 05 is complete; exact next action is await Goal 06 activation.

### 2026-08-22 — POLICY-02 checkout policy completed

- Completed the confirmed Dine-in/Take-away, Cash/Card, no-tax, anonymous-sale,
  bilingual receipt, and monthly receipt-number policy without changing prior
  immutable snapshots. Structured wrong-PIN responses prevent raw Convex errors
  from appearing in the app.
- Verified focused sales, permissions, identity, POS, printing, local migration,
  Android, TypeScript, Convex, production-build, and SM-X115 tablet evidence;
  pushed `2bab5512e5d7e9ccb6cfb54a13f79a0ed58654f8`. ORDER-01 is now sole active.
- Graphify was queried before resuming work. It confirms the existing saved
  receipt, Orders, and print-state paths that Goal 05 must preserve.
- POLICY-01 is fully confirmed. Its authority updates document logo-only
  temporary receipt headers, no tax, cash/card product-split payments,
  French/English selection, `MMYY-0001`, dine-in/take-away only, warning-only
  stock, same-day offline whole-sale corrections, cumulative roles, and the
  confirmed PIN/session policy. Exact next action: validate, commit, and push
  POLICY-01. It was committed and pushed as
  `eafe2d3e6603cbf5957c548b5e83473da05465df`; ID-01 is the only card in
  progress. The opaque protected-session identity boundary is documented; exact
  next action: implement protected credentials/session persistence and remove
  production authorization overrides in ID-02.
- Exact next action: obtain the owner's explicit POLICY-01 answers. No
  policy-dependent behavior, identity design, or authorization implementation
  will be selected before those decisions are recorded.
- Confirmed so far: receipts retain the approved Olaso logo; tax is not shown
  on receipts; supported tenders are cash and card with split payments allowed;
  the staff app is French/English; and receipt numbers should be compact. Legal
  header details, tax treatment, receipt language, the exact receipt-number
  format/reset rule, and all remaining POLICY-01 decisions are still open.
- Further confirmed: the temporary receipt header is logo-only; the application
  performs no tax calculation anywhere; a split is product-based sequential
  checkout, not a split-tender amount; and the receipt language follows the
  currently selected staff-app language. Receipt numbers use `MMYY-0001`, with
  the numeric sequence resetting monthly. All later POLICY-01 decisions remain
  open.
- Further confirmed: the only service modes are take-away and dine-in; online
  ordering is not part of the application. Ingredient-specific low-stock
  thresholds create a warning and daily staff review, never a checkout block.
  A completed sale may be cancelled only as an append-only correction with a
  required reason; card corrections are recorded only and never trigger a bank
  reversal. Dine-in has no table selection, customer details are not collected,
  and any cashier may authorize a cancellation.
  Cashiers may make a whole-sale correction while offline, only on the same
  local business day, then re-enter a replacement sale. All identity/role
  decisions remain open except the confirmed cumulative cashier/manager/owner
  access hierarchy and owner-only sensitive information. Every owner, manager,
  and cashier has a separate six-digit PIN; the app locks for handoff/restart,
  auto-locks after an owner-configurable five-minute default, permits local PIN
  use throughout an outage, and locks out after five failed attempts for five
  minutes. The owner accepts physical custody as the first-release lost-tablet
  control. Owner recovery is support-mediated against the existing identity;
  the exact one-time reset procedure remains to be defined without a temporary
  privileged profile.
- Goal 04 is complete; COST-01 through COST-09 are pushed and its completion
  record is `8e7a981e2813cd768ebe70063fefc5c52d880d3d`.
- The owner requested that all current UI remain unchanged until the complete
  application can be reviewed in final hardening. Goal 06 now records an
  owner-led dislike/simplification list, concise Settings/operator cleanup,
  curated category artwork with a neutral fallback, a compact app icon, and an
  optional measured logo/light startup reveal. No application behavior or asset
  format was selected by this planning update.

- 2026-08-22: reconstructed Goal 04 from the repository after the unreliable
  continuation loop. `codex/goal-04-costs-profitability` and its remote are
  synchronized at `9504b833413b8fae75590cc211b930467a039bd7`; COST-01 through
  COST-04 are pushed and COST-05 is the sole active card.
- COST-05 now caches ingredient inventory value, cost status, and valuation
  revision for offline checkout; one local transaction saves immutable sale and
  line costs, stock cost effects, receipt snapshot, and outbox event. Cloud
  sync validates complete/incomplete cost consistency, recalculates and rejects
  tampered snapshots when cached valuation revisions still match, preserves
  stale/incomplete snapshots idempotently, and advances weighted-average
  inventory valuation. Cache refresh preserves negative cloud stock as a signed
  local delta so SQLite's non-negative base quantity constraint remains valid.
- Focused checks pass: `npm run check:sales`, `npm run check:local` (including
  10 repeated restart/migration runs), `npm run check:inventory`, `npx tsc -b`,
  `npm run check:convex`, `npm run build`, and `npm run android:sync`. The
  sales check proves complete local persistence, permitted incomplete offline
  checkout, server-side matching-revision recalculation, tamper rejection, and
  idempotent cloud preservation. The pre-existing
  `scripts/check-local-database.mjs` cleanup change was verified: it closes a
  retained SQLite handle defensively and makes Windows temporary-file cleanup
  retry-safe; it has not yet been committed.
- Blocker: this workstation has no Java runtime, Android SDK, or `adb` on PATH.
  `npm run android:beta` reaches Gradle then reports `JAVA_HOME is not set and
  no 'java' command could be found`; APK build/install, physical SM-X115 smoke,
  and logcat review are therefore unavailable. Graphify incremental refresh is
  also blocked because the installed graph has no usable manifest and requests
  an external semantic-extraction API key for the mixed corpus. Exact next
  action: provide/configure the existing Java 21 and Android SDK platform-tools
  paths (and Graphify semantic backend/key or a valid manifest), then finish
  COST-05 verification, refresh Graphify, commit, push, and continue COST-06.
- Resumed 2026-08-22 with the already-installed project-local toolchain:
  `D:\Olaso\tmp\android-toolchain\jdk\jdk-21.0.11+10` and
  `D:\Olaso\tmp\android-toolchain\android-sdk`. Java 21, `adb`, and the
  connected Galaxy Tab A9 SM-X115 are verified. The beta rebuilt and installed;
  its awake foreground POS is the approved 1340 × 800 composition, an Espresso
  take-away sale completed locally with its saved receipt preview, and the
  foreground/post-sale log has no Capacitor console error, exception, or crash.
  The earlier `triggerEvent` error occurs only when Android pauses the app while
  the tablet is asleep before the Capacitor bridge is injected; it does not
  recur for the real foreground launch/sale path.
- Graphify's full incremental command still requires an unavailable semantic API
  key because its stale manifest marks the mixed corpus changed. The structural
  code graph was instead refreshed from the seven changed COST-05 code/check
  files without pruning unrelated semantic nodes: `graphify-out/graph.json`
  now contains 2,467 nodes and 5,592 edges, and a follow-up graph query returns
  the new `prepareSale`, `commitLocalSale`, `loadSaleSyncPayload`, and
  `sales.accept` paths. Exact next action: run final focused checks, commit and
  push COST-05, record the pushed SHA, then make COST-06 the only in-progress
  card.
- COST-05 implementation commit
  `1e7b225ad57b4a69b8776b7f39f08c549115b73e` is pushed and matches
  `origin/codex/goal-04-costs-profitability`. COST-06 is now the only card in
  progress. Exact next action: re-query Graphify, inspect the existing staff
  and authorization boundaries, then implement owner-only staff profiles and
  effective compensation periods.
- COST-06 now has bounded management staff-profile reads/writes with no salary
  fields, plus owner-only compensation history/creation. Compensation periods
  are integer centimes, append-only, retry-safe, and reject overlap. The new
  `staffProfiles.by_client_mutation` index protects create retries; focused
  staff, Convex, and TypeScript checks pass. The Settings DOX keeps Staff &
  access unavailable until the owner confirms role/login policy, so COST-06
  deliberately exposes no compensation UI or operational cache data. Exact next
  action: add deterministic staff/compensation seed coverage, then run the
  card's closeout checks before commit/push.
- COST-06 seed coverage and closeout pass: the deterministic reset now has two
  staff profiles and one July-2026 worker compensation period; staff, seed,
  Convex, TypeScript, production-build, Android beta, physical SM-X115 install,
  awake foreground Settings launch, and clean foreground logcat pass. Graphify
  structural refresh is 2,483 nodes and 5,545 edges. Exact next action: commit
  and push COST-06, record its SHA, then activate COST-07.
- COST-06 implementation commit
  `1c6e5e465e427ec8f3728dec73f257533ba00388` is pushed and matches
  `origin/codex/goal-04-costs-profitability`. COST-07 is the only in-progress
  card. Exact next action: re-query Graphify and inspect expense schema,
  validation, and report-boundary paths before implementation.

- Goal 04 is active and COST-01 is the only card in progress on
  `codex/goal-04-costs-profitability`, pushed from clean `main` before any
  branch changes.
- Graphify was queried before code inspection; it identifies the established
  inventory, recipes, local sales, sync, Stock, and Reports ownership paths.
- COST-01 is complete and pushed as `9750fbc299f9b9b1770fd021352a3708b29dd7ba`
  on `origin/codex/goal-04-costs-profitability`.
- COST-02 is complete and pushed as `6b2a0208254f03327cbb84aa6f5f9e36b4cdf018`
  on `origin/codex/goal-04-costs-profitability`.
- COST-03 is the only card in progress.
- COST-03 is complete and pushed as `bfe73a67062e95de0127fe0ea42b0a981bb15314`
  on `origin/codex/goal-04-costs-profitability`.
- COST-04 is the only card in progress.
- COST-04 is complete and pushed as `551856a3c3e35c057ca70d91e23667831a33c2a5`.
- COST-05 is the only card in progress.
- Verified: exact-cost check, SQLite migration/restart check, inventory seed
  fixture check, Convex typecheck/deploy, TypeScript, production build, and
  Capacitor Android sync. Graphify is refreshed to 2,441 nodes and 5,603 edges.
- Used the project-local OpenJDK 21 and Android platform tools to build the
  140-task debug beta, install it on SM-X115, and run a cold-launch/Stock smoke
  test. The real 1340 × 800 POS and Stock screens are unclipped; post-unlock
  logcat has no Capacitor-console errors, uncaught exceptions, or crashes.
- Exact next action: re-query Graphify and inspect the existing inventory
  mutation/history paths before implementing retry-safe package receiving and
  weighted-average valuation for COST-02.
- COST-03 will extend the existing Stock receive interaction with package math,
  purchase cost, carrying value, average cost, and append-only purchase/
  valuation history while retaining visibly distinct ordinary adjustments.
- COST-03 now returns bounded purchase history with each selected ingredient,
  maps valuation state through the Stock data boundary, presents carrying value
  and average cost/incomplete state in the existing detail panel, and opens a
  package-receipt dialog from the existing receive action.
- Graphify is refreshed to 2,457 nodes and 5,643 edges; focused TypeScript,
  inventory, and production-build checks pass.
- Exact next action: run browser interaction QA for the package dialog, then
  Android beta/install and a physical Stock package-receipt smoke test before
  committing COST-03.
- Browser QA at 1340 × 800 verified a 12-piece, 48 MAD package receipt changes
  stock 9→21, carrying value 36→84 MAD, average cost, status, and append-only
  purchase history. After deploying the updated query, no new browser errors
  occurred.
- Android beta built successfully; the current APK is installed on SM-X115. The
  unlocked physical Stock screen opens the complete package-receipt dialog with
  visible fields, package math, and no console/logcat errors. COST-03 is ready
  for final focused checks and commit/push.
- Exact next action: re-query Graphify and inspect the recipe/product management
  and cost helper paths before implementing current product costs and margin.
- COST-04 now has a deployed bounded `recipes.getCost` query. It returns active
  recipe cost completeness, exact centimes, named missing ingredient IDs, and
  per-modifier ingredient cost effects; Cappuccino's deterministic fixture is
  complete at 504 centimes with the checked modifier costs.
- Exact next action: map the cost result to the product editor and show price,
  direct cost, gross profit, margin, and explicit missing ingredients, then run
  focused/browser/Android verification.
- The product hook and editor now show selling price, current direct cost, gross
  profit, margin, and explicit incomplete/missing-cost state without allocating
  compensation or overhead. TypeScript and production build pass; Graphify is
  refreshed to 2,462 nodes and 5,639 edges.
- Exact next action: verify the complete and incomplete product-cost states at
  1340 × 800 and on SM-X115, then complete COST-04 checks and commit/push.
- PRINT-08 closeout commit
  `1c1a34706154b3e6b93e92f4a83f9cc1a10493d9` is pushed to
  `origin/codex/goal-03-printing-integration`.
- PRINT-07 implementation commit
  `5e93dd7858d693867a6ed7482131eb202e598a18` is pushed to
  `origin/codex/goal-03-printing-integration`.
- PRINT-06 implementation commit
  `9602fed94f5d49f552527275c5c704a2e21c6906` is pushed to
  `origin/codex/goal-03-printing-integration`.
- PRINT-05 implementation commit
  `eb00d2f92094c60adbd6cdc68e877f1a9e790959` is pushed to
  `origin/codex/goal-03-printing-integration`.
- PRINT-04 implementation commit
  `9c87c625a1f379e7307ec0c167b5002c0ec5e8dc` is pushed to
  `origin/codex/goal-03-printing-integration`.
- PRINT-03 implementation commit
  `c41e29c75c1a340519c6d217e220ed7f84723f76` is pushed to
  `origin/codex/goal-03-printing-integration`.
- PRINT-02 implementation commit
  `5cb5da399900f6d2aca22bd4ecd341844884d78c` is pushed to
  `origin/codex/goal-03-printing-integration`.
- PRINT-01 implementation commit
  `a1bca7fc2df4c0f2b718e7bf46956a2301ee75ea` is pushed to
  `origin/codex/goal-03-printing-integration`.
- `main` and `origin/main` were clean and synchronized at
  `deba73b1e2baf1b92d7ce6e7f030b7c23c655383` before activation.
- The accepted `D:\Olaso-escpos-lab` source was inspected without modification;
  its durable inputs and generated outputs were hashed before preservation.
- USB queues `POS-80C` and `80mm Series Printer(1)` report available. The
  physical Galaxy Tab A9 SM-X115 is connected through ADB.
- The previously observed printer address `192.168.123.100` did not answer the
  workstation reachability check. PRINT-02 still owns measured LAN discovery,
  raw-port proof, router policy, and tablet-to-printer testing.
- The accepted lab is preserved under `tools/wd8260-receipt-lab/` with isolated
  locked dependencies and reviewed golden receipt/logo bytes. Its focused
  checks, root build, Android sync/beta build, USB queue send, physical tablet
  install/launch, 1340 by 800 browser regression, console check, and structural
  Graphify refresh pass.
- The user correctly rejected the first physical-tablet QA claim: the shipped
  one-time `window.outerWidth` scale could sample the natural-orientation width
  before landscape settled, shrinking the app into one part of the screen. An
  intermediate `innerWidth` build instead exposed the fixed 1340-pixel meta
  viewport and was oversized; it was immediately replaced.
- The corrected APK scales from the CSS screen's stable long edge. Live WebView
  inspection reports screen `1007 by 601`, zoom `0.751493`, and document
  `1007 by 602` with no horizontal or vertical overflow across three consecutive
  cold starts. The Android check rejects both fragile width APIs.
- The user physically confirmed the corrected app fills the tablet without
  scrolling and the printed receipt preserves the accepted resident logo,
  layout, separators, MAD heading, bilingual footer, and partial cut.
- Exact next action: connect the WD8260 Ethernet port to the café router, read
  the router/tablet network, change the printer's static address/subnet/gateway
  to that network without hardcoding it in the application, then prove the raw
  TCP port with a physical diagnostic print.
- PRINT-02 measured the active network: tablet `192.168.11.225/24`, workstation
  Wi-Fi `192.168.11.222/24`, and router/gateway `192.168.11.1`. The printer's
  old static `192.168.123.100` is correctly unreachable while it remains off
  the Ethernet LAN.
- The existing WD8260 CD documentation and Printer Test V3.2 utility were
  inspected locally. The vendor MAC-based `Auto Set IP` flow can discover
  cross-subnet printers and writes IP, `255.255.255.0` mask, gateway, and port;
  its expected raw TCP port is 9100, which still requires a successful measured
  paper print before acceptance.
- The router admin page redirects to a self-signed HTTPS interface. Its DHCP
  pool/reservation policy remains unconfirmed; no certificate warning,
  credential prompt, or network setting was bypassed.
- Candidate `192.168.11.100` returned unreachable ping/ARP/service probes before
  assignment. This is collision evidence, not a router reservation guarantee.
- Using the existing Printer Test V3.2 utility with USB selected, the wired
  fields were changed from `192.168.123.100 / 255.255.255.0 /
  192.168.123.1` to `192.168.11.100 / 255.255.255.0 / 192.168.11.1` and the
  wired-only `Set above contents` action was sent. The tool showed no error but
  exposes no trustworthy readback; power-cycle self-test proof is pending.
- Added a development-only Node standard-library LAN probe with explicit
  IPv4/port/timeouts and honest byte-write-only results. Its local check proves
  exact golden-byte delivery, validation, and connection-refused behavior.
- The user confirmed the self-test IP is correct and moved the printer to the
  router. The printer's own HTTP page read back MAC `00-61-8D-86-B9-4B`, IP
  `192.168.11.100`, mask `255.255.255.0`, gateway `192.168.11.1`, and DHCP
  disabled.
- Workstation ping and TCP 9100/HTTP 80 succeed; the tablet has 0% ping loss and
  direct TCP 9100/80 connections succeed. The workstation LAN probe wrote all
  1,814 golden bytes in 6 ms after a 4 ms connect. A distinct 122-byte raw
  diagnostic was then sent directly from the Galaxy Tab with exit 0.
- Wrong address `192.168.11.101:9100` and wrong port
  `192.168.11.100:9101` both fail as bounded connect timeouts without reporting
  bytes written. Physical confirmation of the normal LAN receipt and labeled
  tablet diagnostic remains pending.
- The user confirmed the LAN paper printed. Raw TCP 9100 is therefore physically
  accepted, including the direct Galaxy Tab path; it is no longer merely a
  documented or socket-open assumption.
- With the router left on and printer powered off, its neighbor state became
  incomplete, the Windows TCP check failed after 21,127 ms, and the bounded LAN
  probe returned `CONNECT_TIMEOUT` in 500 ms with exit 1 and no byte-success
  claim.
- Exact next action: power the printer back on, measure reconnect time, and
  prove recovered paper output before testing router/link loss.
- After printer power-on, ping recovered in 149 ms and TCP 9100 was open in a
  539 ms Windows check. A tablet diagnostic using plain `nc -w 2` wrote input
  but timed out waiting for remote close; the corrected Toybox
  `nc -q 1 -w 2` close-after-EOF path exited 0. Physical recovery-paper
  confirmation remains pending.
- The user confirmed the labeled `OLASO LAN TABLET TEST` paper printed after
  power-on. Printer-off/restart recovery is physically accepted.
- With printer/router power retained and the Ethernet cable removed, ping
  returned `DestinationHostUnreachable`, neighbor state became unreachable,
  and the bounded probe returned `CONNECT_TIMEOUT` in 500 ms with exit 1 and no
  byte-success claim.
- Exact next action: reconnect Ethernet, prove endpoint recovery and paper, then
  decide the router-power-off evidence and static-address ownership.
- After Ethernet reconnection, ping succeeded in 55 ms, TCP 9100 connected in
  11 ms, and the correct MAC returned reachable. A 122-byte labeled diagnostic
  sent directly from the tablet exited 0 in 135 ms; physical paper confirmation
  is pending.
- The user confirmed the labeled paper printed after Ethernet reconnection.
  Cable-loss/reconnect recovery is physically accepted without tablet/app or
  printer reconfiguration.
- Exact next action: run a timed local monitor while the router is powered off
  for about 10 seconds and restored, then prove endpoint and paper recovery and
  record who owns exclusion/reservation of static `192.168.11.100`.
- The user declined an actual router power cycle because it would disconnect the
  household. The prepared monitor was stopped without changing router state.
  This limitation is recorded rather than hidden.
- Non-disruptive client-side outage substituted: tablet Wi-Fi off removed the
  WLAN route, ping failed, and TCP returned `Network is unreachable` with exit
  1. Wi-Fi restored `192.168.11.225/24` in 2,293 ms; ping/TCP then exited 0 and
  a labeled tablet print write exited 0. Physical paper confirmation remains.
- The user confirmed the Wi-Fi-recovery diagnostic printed on paper.
- Address policy: `192.168.11.100` is a home-lab endpoint only. At café
  deployment, the client/router administrator owns reserving or excluding the
  selected static printer address from DHCP and any future router changes. The
  application address remains configurable and never hardcodes this lab value.
- Exact next action: run PRINT-02 closeout checks/build/APK install/log review,
  commit and push the card, record its SHA, then activate PRINT-03.
- PRINT-02 closeout passes: receipt/golden/LAN probe checks, production build,
  Android identity/sync, 126-task Gradle beta build, physical APK replacement
  and cold launch, exact 1340 by 800 landscape bounds, clean WebView console,
  exact browser body/document bounds with no warning/error logs, Graphify
  2,228-node/5,128-edge structural refresh, and whitespace checks.
- Exact next action: query Graphify and inspect the Android plugin, terminal
  settings, Settings screen, and test/check ownership before implementing one
  bounded Kotlin TCP transport and persisted Test printer flow.
- PRINT-03 implementation now has Kotlin 2.3.21 with compatible AGP 8.13.2,
  registered `EscPosPrinterPlugin`, bounded `LanSocketWriter`, pure native socket
  unit tests, a generic Capacitor byte wrapper, deterministic non-sale
  diagnostic, validated/persisted IPv4 and port, and an enabled Settings Test
  printer panel. Checkout remains untouched.
- Native JVM tests, Settings persistence/validation/diagnostic checks, Android
  static checks, TypeScript, and production build pass. Browser QA verifies
  exact 1340 by 800 bounds, 44/52-pixel controls, restart persistence, precise
  invalid/unavailable feedback, no overflow, and clean console.
- Exact next action: run Android sync/beta with unit tests, install on the
  physical tablet, enter the measured lab endpoint, print the non-sale
  diagnostic, verify restart and wrong-address recovery, and inspect logcat.
- Full `android:beta` now runs 140 tasks including native unit tests and passes;
  the synced APK installed successfully on the SM-X115.
- On the physical Settings panel, `192.168.11.100:9100` saved and survived
  process restart. The in-app diagnostic wrote 103 bytes in 6 ms, returned
  `paperConfirmed:false`, displayed `Confirm paper`, produced no console/logcat
  warning/error, and the user confirmed paper.
- Changing to unused `.101` persisted the draft and produced a bounded 2-second
  `TIMEOUT` with actionable UI copy. Expected native failure now returns typed
  `ok:false` rather than a rejected Capacitor promise, keeping console/logcat
  clean. Correcting back to `.100` then wrote 103 bytes in 6 ms with `ok:true`;
  final recovery-paper confirmation is pending.
- The user confirmed the corrected-endpoint recovery diagnostic printed. A final
  process restart still shows `192.168.11.100:9100`; physical Settings geometry
  fills the 1340 by 800 tablet with no clipping or overflow.
- Final Graphify refresh contains 2,295 nodes and 5,269 edges. Settings,
  Android static, TypeScript, production build, native unit/assembly, browser,
  tablet, persistence, wrong-address, clean-log, and paper checks all pass.
- Exact next action: query Graphify and inspect saved receipt snapshots,
  checkout/order parsers, formatters, and accepted golden bytes before defining
  the smallest transport-independent receipt model and deterministic encoder.
- PRINT-04 now adds a pure snapshot-to-receipt model and WD8260 encoder with
  integer-centime reconciliation, Africa/Casablanca date/time, complete CP858,
  unsupported-character replacement, exact 30/5/13 item columns, wrapping,
  four 48-column separators, NV logo recall, double-width TOTAL/MERCI, feed, and
  partial cut. It remains disconnected from checkout/transport orchestration.
- New local snapshots preserve optional cashier name; existing snapshots remain
  valid, and local/cloud Orders map cashier into the transport-independent
  receipt shape without reading current product data.
- `check:printing`, sales, Orders, TypeScript, and whitespace checks pass across
  empty/64-character IDs, accents, unsupported scripts, long products/modifiers,
  quantity 100, large totals, optional fields, exact payment/change, and invalid
  reconciliation.
- Accepted fixture text matches the existing 48-column baseline. The 941-byte
  application encoder SHA-256 is
  `8C8C109B9A4F884D44819A55099C7D88FA7B005927FD5BB4767734E79EF6B1AE`;
  direct tablet LAN send exited 0. Physical paper comparison is pending.
- The user confirmed the new application-encoder paper matches the accepted
  laboratory receipt perfectly. This proves the independent production encoder,
  not a repeat of the receiptline lab. SHA
  `8C8C109B9A4F884D44819A55099C7D88FA7B005927FD5BB4767734E79EF6B1AE`
  is now frozen as the paper-approved application golden.
- Exact next action: run final printing/sales/orders/build/Android/tablet/log/
  Graphify checks, commit/push PRINT-04, record its SHA, then activate PRINT-05.
- Final receipt golden, sales, Orders, POS, local database, Settings,
  TypeScript, production build, 140-task Android beta, whitespace, and
  Graphify checks pass. The rebuilt APK is installed on the real SM-X115.
- Browser and physical-tablet Orders previews show the saved cashier cleanly;
  the tablet remains full-screen at 1340 by 800 with no clipping or internal
  preview overflow. Browser logs contain no warning/error, and no
  application-console or card-introduced Android log warning/error appeared.
- Graphify refreshed to 2,335 nodes and 5,332 edges. PRINT-04 was committed and
  pushed at `9c87c625a1f379e7307ec0c167b5002c0ec5e8dc`.
- Exact next action: inspect the accepted resident-logo payload, Settings
  ownership, and native asset/plugin contracts before adding the deliberate
  one-time PRINT-05 provisioning action.
- PRINT-05 packages the exact 2,441-byte accepted NV payload, SHA-256
  `D5D3B835800970D7F81BD188311EC766DCF4F0867F2E9B697C227AD9F9818C76`,
  as an Android raw asset. Static checks prove it matches the preserved fixture
  byte-for-byte and is present in the built APK.
- Settings now exposes deliberate Restore saved logo and Test printer actions.
  The restore action requires the native replacement warning and reports only
  byte/timing evidence. Browser layout, warning/cancel behavior, and clean logs
  pass without pretending the browser can print.
- The first installed-tablet restore wrote all 2,441 bytes in 9 ms with
  `paperConfirmed:false`. Two immediate accepted 16-byte recalls succeeded,
  followed by successful recalls after app restart (11 ms), full tablet restart
  (47 ms), and printer network-module restart (109 ms). The printer TCP path
  disappeared and recovered in 3,909 ms during that restart.
- The user caught an oversized launch while Android 16 ignored the existing
  landscape request. The first property/scale test appeared to pass after the
  display was already landscape, but a later physically portrait install
  disproved it; the API-35 target correction below is the accepted fix.
- Exact next action: physically inspect the emitted logo-only slips for the
  crisp horizontal OLASO wordmark, power-cycle the printer, send one final
  recall, then run PRINT-05 closeout/Graphify/commit/push.
- Final focused Settings/Android/printing/receipt-lab/sales/TypeScript checks
  pass. A fresh browser reports exact 1340 by 800 content, no panel overflow,
  and no warning/error; Graphify refreshed to 2,354 nodes and 5,365 edges.
- The user corrected the unnecessary pause and confirmed that the six logo
  recalls physically printed. PRINT-01 already accepted the exact preserved
  logo payload, horizontal orientation, ordinary recall, and survival across a
  true printer power cycle. PRINT-05 proves its bundled native asset is exactly
  that same 2,441-byte payload and that the installed app can provision and
  recall it across app, tablet, and printer-module restarts.
- PRINT-05 was committed and pushed at
  `eb00d2f92094c60adbd6cdc68e877f1a9e790959`. No further logo print is
  required.
- Exact next action: inspect checkout commit ownership, local migrations, POS
  submission state, and recovery boundaries before connecting one post-commit
  print attempt with persisted pending/printed/failed state.
- The later cold install from a physically portrait screen disproved the claim
  that the API-36 compatibility property alone forces landscape. Because this
  product is manually distributed and Google Play is excluded, the APK now
  compiles with SDK 36 but targets API 35. With system rotation locked portrait,
  the rebuilt physical APK opens at the complete 1340 by 800 layout; auto-rotate
  was restored afterward.
- Local schema version 5 adds pending/printed/failed state, attempt count,
  attempt time, bounded error code/message, and observed byte/total timing.
  Focused checks prove print failure/success updates never change sale, item,
  stock movement, or outbox counts.
- Browser unconfigured checkout committed and cleared its cart, opened the
  saved preview, marked print failed, and logged no warning/error.
- Physical offline checkout added exactly one sale, one item, two stock
  movements, and one outbox row; print state became failed/UNREACHABLE with one
  attempt. App restart preserved every count and made no new print call. Wi-Fi
  recovery synchronized the same sale to outbox zero while print stayed failed.
- One online physical checkout then added exactly one more sale/item and two
  movements, sent 787 receipt bytes in 6 ms, persisted printed/attempt 1, and
  the user confirmed paper output. A final app restart preserved both print
  states and all counts without printing again.
- Graphify refreshed to 2,388 nodes and 5,500 edges. PRINT-06 was committed and
  pushed at `9602fed94f5d49f552527275c5c704a2e21c6906`.
- Exact next action: inspect Orders data/detail ownership and connect reprint to
  the saved snapshot/current settings while exposing persisted print state and
  preserving all sale/item/stock/outbox counts.
- Orders now reads tablet-local print state alongside the immutable snapshot,
  preserves it when the matching cloud row arrives, disables cloud-only
  reprints, and exposes Reprint/View receipt/sync as three 50-pixel actions.
- Focused tests prove successful and failed reprints change only print state;
  sales/items/stock movements/outbox are invariant. Browser unconfigured
  reprint keeps recovery available with no console warning/error or overflow.
- Physical wrong-address reprint plus two rapid taps produced one TIMEOUT and
  advanced only attempt 1 to 2. App process restart and full tablet restart
  preserved failed state and counts 3/3/9/0 without any print call.
- Restoring `.100` and pressing Reprint once wrote the same 787 saved-snapshot
  bytes in 62 ms, moved only attempt 2 to 3 and failed to printed, and left
  sales/items/movements/outbox at 3/3/9/0. The exact receipt encoder and paper
  path were already physically accepted; no repeated paper gate was added.
- Existing accepted printer/router disconnect/power recovery from PRINT-02
  applies to the same transport, while current wrong-address/restart/repeated-
  tap recovery proves Orders orchestration. Graphify refreshed to 2,396 nodes
  and 5,523 edges.
- PRINT-07 was committed and pushed at
  `5e93dd7858d693867a6ed7482131eb202e598a18`.
- Exact next action: derive the PRINT-08 completion matrix, run full automated
  regression and bounded 20-sale/5-reprint endurance without unnecessary logo
  tests, inspect browser/tablet/log/database evidence, update all authorities,
  and finish with pushed clean synchronization.
- Added `check:printing-endurance`: 20 mixed atomic sales, 20 unique receipts,
  20 items, 47 exact stock movements, 20 outbox events, one printer failure/
  restart recovery, 26 total print attempts, and five immutable saved-sale
  reprints all reconcile; all 20 finish printed. Current product name/price
  mutation does not alter reprint bytes.
- Full POS/management/inventory/local/sales/Orders/Dashboard/Reports/Settings/
  Android/printing/receipt-lab/TypeScript/Convex/seed checks pass. The one
  Dashboard failure in the first parallel batch was an explicit Convex OCC
  collision with the concurrent Inventory mutation; the complete cloud suite
  passed sequentially afterward.
- Production build and 140-task Android beta pass. Root transitive
  brace-expansion/nanoid/postcss lockfile fixes reduce both root and receipt-lab
  audits to zero vulnerabilities without changing public dependencies.
- Fresh browser POS/Orders/date-picker/Reprint/Printer Settings checks report
  exact 1340 by 800 bodies, no panel overflow, and no warning/error. The final
  APK is installed on the physical SM-X115 at target API 35; POS, Orders, and
  Settings fill 1340 by 800, live WebView zoom is 0.751493, and app logs are
  clean.
- Final physical database remains 3 sales/3 items/9 movements/0 outbox with two
  printed states and no failed states; final install created no print. External
  accepted lab sources still match all five preserved source hashes.
- Graphify refreshed to 2,413 nodes and 5,559 edges. PRINT-08 was committed and
  pushed at `1c1a34706154b3e6b93e92f4a83f9cc1a10493d9`.
- Exact next action: push this final completion record, prove the branch is
  clean/synchronized, and leave Goal 04 inactive until explicit activation.

## Planning Journal

### 2026-09-04 — Profile creation and PIN-change reliability audit

- Audited every profile credential boundary instead of treating the prior
  delayed-unlock symptom as the only defect. The production owner/profile was
  read-only throughout; no PIN, session token, verifier, or secret was printed.
- Android research confirmed that related preference edits can be atomically
  committed, while separate asynchronous writes cannot report durable failure.
  Reused the existing Keystore/AES-GCM Capacitor plugin and added no dependency.
- Repaired protected credential atomicity, safe online recovery from corrupt
  provisioned storage, lockout cleanup, latest-PIN staff-creation retries, and
  save-dialog double execution/close races. Added focused checks for the new
  invariants and a cloud test covering old-PIN rejection, new-PIN acceptance,
  session revocation, lockout reset, and changed-credential creation retry.
- Safe checks passed as recorded in Current Checkpoint. `check:staff` correctly
  stopped at its missing development owner PIN before seed/reset, so its new
  live cloud scenarios remain unexecuted. Physical two-profile acceptance also
  remains pending because production test-profile mutation was not assumed.
- The first native build rejected nullable bundle values at Kotlin compile time.
  Added the explicit rejection, then the full 140-task beta passed. Graphify's
  normal mixed-content refresh stopped at its missing semantic-key gate without
  replacing the graph; its documented code-only refresh indexed the changed
  source successfully at 3,087 nodes / 6,132 edges.

### 2026-09-04 — Production setup and large-menu POS repair

- Production was empty before import. Deployed the committed backend, created
  one Yassine owner identity, removed the temporary recovery environment value,
  and verified one active production owner without recording the raw PIN.
- Imported the four approved database-owned categories, their editable artwork
  selections, all 92 source products, and only the explicit V60 Hot/Cold sizes.
  Production count verification passed at 23/27/19/23.
- Built the web bundle against the production deployment, synced Android, built
  with the existing Java 21 toolchain, installed over the app, and cleared only
  the disposable Olaso development data. The production Lock, authentication,
  POS catalog, Settings staff row, and Change PIN dialog passed direct 1340 by
  800 inspection with no focused console/logcat error.
- The owner then identified weak artwork, Bakery title collision, and clipped
  lower catalog rows. The CSS root cause and minimal repair are recorded in the
  Current Checkpoint; no category asset, database row, business rule, or cart
  geometry changed.
- Committed and pushed the repair as
  `31e57f2e09d335bf06cd4096288590770455fe1c` (`POLISH-01: fix large production
  menu layout`). Redeployed production, rebuilt/synced Android, and installed
  over the existing production-connected app without clearing its data.
- Physical SM-X115 evidence at 1340 by 800 confirms all four category cards
  remain visible, inactive artwork is legible, Bakery & Desserts wraps in the
  reserved text column without touching its illustration, and an in-grid swipe
  reaches Coffee's final row including V60 while the order rail remains fixed.
  Focused app logcat contains no error. Owner visual acceptance remains.

### 2026-09-04 — Owner-only staff PIN changes

- The owner requested editable profile PINs and supplied the first production
  owner's name and PIN. The PIN is treated as runtime-only secret input and is
  never repeated in source, documentation, SQLite, the ordinary outbox, or Git.
- Reused the existing staff dialog language, PBKDF2 credential format, protected
  Android offline storage, owner permission, and credential-version/session
  model. No new table, migration, native plugin, or dependency was introduced.
- A current owner changing their own PIN keeps only the authenticated current
  device session; changing another profile revokes that profile's existing
  cloud sessions. Both paths replace the protected offline verifier and clear
  local failed-attempt state after cloud acknowledgement.
- Safe checks pass as recorded in Current Checkpoint. Production deployment,
  first-profile creation, menu population, Android packaging, installation,
  and physical acceptance remain to be completed and recorded separately.

### 2026-09-04 — Four-category menu and artwork approved

- Owner approved four top-level categories so all category cards remain visible
  without scrolling: Coffee, Matcha, Cold Drinks, and Bakery & Desserts.
- Preserved all 92 extracted products and recorded the exact source-section and
  within-category order mapping in the real-menu extraction ledger.
- Owner approved a new artistic direction based on expressive product and
  ingredient linework rather than literal stock icons. Replaced only
  `coffee.webp`, `tea.webp`, `cold-drinks.webp`, and `bakery.webp`; neutral and
  snacks/sweets remain untouched.
- The generated drafts incorrectly contained a painted checkerboard despite
  requesting transparency. The approved visible green artwork was isolated
  mechanically, recolored to exact Operational Green `#006A2B`, centered on a
  true-alpha 320 by 320 canvas, and saved as lossless WebP. No application code,
  production database, tablet, PIN, seed, reset, or live catalog was touched.
- Exact-size, alpha-range, and visible-color checks passed for all four files.
  `npm run build` and `git diff --check` passed; the build retained only the
  existing jeep-sqlite browser-compatibility warning.
- Exact next action: commit and push this owner-approved artwork step, then the
  owner reviews the four cards in the application before any production menu
  import.
- Committed and pushed the approved asset and documentation step as
  `2113043d82eb37133a9a3127dd36289007e0f406`
  (`POLISH-01: refresh real menu category artwork`) on `origin/main`.

### 2026-09-01 — POLISH-01 receipt, language, and delayed staff reliability

- Professional POS research separates variants, modifiers, and discounts.
  Olaso now prints product + size as one heading, selected choices as one
  wrapping middle-dot list, and Offert only as a zero line charge plus totals
  deduction. French receipt service labels are translated.
- Root cause review found profile language pulled from cloud before the local
  preference was pushed, offline staff acknowledgement hardcoded English, and
  an ambiguous compensation-delete SQL column repeatedly aborting reconnect.
  Fixed all three at their shared data boundaries and retained protected
  offline fallback when an active cloud identity is temporarily unavailable.
- Deployed the Convex functions, built and installed the development beta over
  the existing tablet data, and verified a clean exact-size Lock restart. Final
  profile/PIN and paper acceptance still require the owner's physical action.

### 2026-08-30 — POLISH-01 overlay keyboard vs backdrop close

- Removed dialog `autoFocus`. Backdrop close now dismisses an open keyboard
  first (`blur` + visualViewport), then closes on the next dimmed tap.
- Exact next action: owner checks Add product keyboard on the tablet.

### 2026-08-30 — POLISH-01 table alignment, compact overlays, product photos

- Orders date/time share one baseline. Products and Stock cells center on one
  line; Stock STATUS is a centered chip with the Products green selected mark.
- Stock title-row Active/Low/Today/Counts are quiet number+label pairs.
- Add product 320px with photo picker; category and ingredient overlays
  shrunk; unit control matches the 36px threshold. Backdrop or X closes
  overlays except a locked PaymentDialog.
- Schema 22 + Convex `imageJpeg`: canvas JPEG cap 16,384 chars before SQLite
  or the management outbox.
- Exact next action: owner checks alignment, overlay size, backdrop close,
  and product photos on the tablet.

### 2026-08-30 — POLISH-01 Choices group vs choice, one Usual

- Overlay name field is Group; list rows are Choices. Extra is left of the
  price; delete is at the right edge. Usual is exclusive in a group.
- Exact next action: owner checks Usual and Extra on the tablet.

### 2026-08-30 — POLISH-01 tighter Choices and number placeholders

- Choices width 520px. Empty numeric 0 is a placeholder across product, recipe,
  stock, and cost number fields.
- Exact next action: owner types into At least / Extra / Price on the tablet.

### 2026-08-30 — POLISH-01 compact Choices overlay

- Dialog 880×680 → 600×max 640. Name fields 168/160px. At least / At most
  are filled counts with 10px label gap, not bordered 44px capsules.
- Exact next action: owner opens Choices on Several on the tablet. Pushed
  `95cd14c82bfbac5e6f39e1c9cf8717f6c035cd53` on `origin/main`.

### 2026-08-30 — POLISH-01 Recipe overlay four-up layout

- Removed “Saving creates version n” copy. Ingredient and Amount sit as row
  labels beside four compact selects and amount fields. Dialog is 560px.
- Exact next action: owner opens Recipe on the tablet.

### 2026-08-30 — POLISH-01 Choices and Recipe overlay overhaul

- Both overlays now use the Category/Payment card: 44px controls, Cancel/Save,
  hairline rows. Choices are section tabs; Stock/By size/Copy stay closed.
  Recipe is an ingredient table with size columns only when there are two sizes.
- Exact next action: owner opens Choices and Recipe on the tablet.

### 2026-08-30 — POLISH-01 Uncategorized filter and compact size chips

- Products sidebar always shows Uncategorized last, pinned above Add
  category, even at count 0. Same `'uncategorized'` id as POS. Not a saved
  menu group. Edit Product chips are 28px one-line name + price; Active is
  omitted unless the size is unavailable/archived.
- Exact next action: owner checks Uncategorized list and Espresso Regular
  on the tablet; commit when asked.

### 2026-08-30 — POLISH-01 tender sync deploy and Orders payment band

- Root cause of Needs sync: live `sales.accept` rejected extra field `tenders`.
  Deployed Convex dev (colorful-newt-937). Manual Sync retries the failed
  sales; they are not permanent.
- Orders detail payment band is 136px above Reprint/Cancel so split Given/
  Change rows cannot cover the buttons.
- Exact next action: owner Sync now, then inspect a split order after the
  new debug APK.

### 2026-08-30 — POLISH-01 split alignment, Offert split, cart space, no preview

- Split prices stay in a right column; long names/options ellipsis. Split
  only when two-plus paid units; Offert never appears as a 0 DH split line.
  Given/Change sit outside the scrolling body. Cart list is 348px without
  Offert so three lines fit with a 16px gap above Payment Details. POS
  ReceiptPreviewDialog deleted. Owner confirmed split amounts align.
- Exact next action: owner continues POLISH-01. Pushed
  `bb5a499194ceae6ea13a39eea0bc82cdf20730f5` on `origin/main`.

### 2026-08-30 — POLISH-01 payment overlay follow-up

- Fully Offert carts skip PaymentDialog (nothing to collect). Split hides
  when cart unit count is 1. Quick amounts are 20/50/100/200 on one 44px row.
  Split lists fade in with the 420ms page curve; Remaining/This payment are
  hairline rows, no nested boxes. Offline product/category money uses charged
  0 for Offert; daily net already used sale total. Split print still goes
  through `createSavedReceiptBytes` / existing encoder; golden SHA unchanged.
- Exact next action: owner checks overlay skip, chips, split UI, paper;
  commit only if asked.

### 2026-08-30 — POLISH-01 cash tender, change, and split overlay

- Place order opens PaymentDialog. Cash: 20/50/100 DH plus custom given and
  change. Split assigns remaining units (qty 2 takes one) to the next payer;
  overlay stays after the first payment. One sale, one ticket, each tender
  given+change. Card is exact due. Revises POLICY-01 product-based sequential
  checkout.
- Android research: React overlay and decimal input; persist `tenders` on the
  saved receipt JSON; Convex optional snapshot/accept tenders; print from
  snapshot tenders. Golden SHA unchanged (payment-arg path).
- Checks: `check:pos`, `check:printing` golden SHA unchanged, `check:css-scope`,
  `check:orders`, `tsc -b`, `npm run build`, `convex codegen`. Local tenders
  in `check:sales` passed; live seed still fails on café Cappuccino Regular
  (pre-existing). Graphify AST refresh; export unchanged. Debug APK
  install-over SM-X115 `R8YX91AKWXJ`. Uncommitted.
- Exact next action: owner unlocks, slides Place order, tries cash change
  then Split with two drinks; commit only if asked.

### 2026-08-30 — POLISH-01 trial cart-line Offert

- Gift beside the cart-line trash marks one unit Offert for the physical
  ninth-drink stamp card. Catalog prices stay on the snapshot; charged total
  is 0; recipe stock still deducts; qty > 1 splits a paid twin. No stamp
  wallet, customer records, or general discount. Payment Total stays pinned
  above Place order; Gift/trash/stepper are compact with 8px gaps. Place
  order chevrons nudge -3px to +3px.
- Android research: React/data cart flag + SQLite receipt JSON + Convex
  optional `complimentary`. Chevron/layout are CSS only.
- On `origin/main` as `6f6c90ba7fa288a42a0e860d67e02229eda8d474`.
- Exact next action: product-based split checkout (pay selected lines, leave
  the rest in the cart; not split tender).

### 2026-08-29 — POLISH-01 Dashboard 400px stack and recent-order dates

- Dashboard right stack (Needs attention + Recent orders) now 400px at left
  922, matching Orders/Products/Stock/Reports. SalesPulse 886. Inner 834 /
  356. Agent: [Dashboard 400px + dates](4347b86b-f166-4ca0-8d37-32ca33a4adb9).
- Recent orders status includes day + short month + time (`29 Aug, 13:11`).
  Tablet screenshot: 0826-0015 is 28 Aug; 0016–0018 are 29 Aug.
- `check:css-scope`, `npm run build`, `android:beta`, install-over SM-X115.
  SalesPulse equal thirds + yesterday pill beside net sales. On
  `origin/main` as `bb6652aaf454e0b52bffbe77c11bf95b5d1aeef3`. Exact next
  action: owner continues POLISH-01.

### 2026-08-29 — SYNC-09 keep online Dashboard/Reports Convex-only

- Prove-first on colorful-newt-937 (read-only, never seeded): 18 café
  receipts `0826-0001`…`0826-0018` in `sales`; `dailyMetrics` 2026-08-29
  3/9700 matches 0016…0018; 27 Aug 11/23200; 28 Aug 4/14600. `getSnapshot`
  reads `dailyMetrics` by business date. No Convex code change.
- Locked decision: online (`available === true`) Convex-only. Do not call
  `loadOfflineDashboard` / `loadOfflineReport` while online. Do not merge
  SQLite into cloud totals when `pendingSyncCount > 0`. Unsynced tickets
  stay on Orders. Offline keeps `offlineViews`. `reconnect.revision`
  already refetches. Do not treat Wi-Fi as online. Do not read cloud while
  `!foreground`.
- Hooks already match; no TSX. `check:offline` asserts the online arm is
  `getSnapshot` / `getSummary` and never mentions `pendingSyncCount` or
  `loadOffline*`. One-sentence DOX in `src/data/AGENTS.md`, dashboard, and
  reports.
- Android research: Dashboard/Reports are React/data Convex queries plus
  existing offline SQLite views. No Kotlin, plugin, WorkManager, or native
  charts. Rejected merge, polling, second analytics store.
- Android: `android:sync`, debug beta BUILD SUCCESSFUL, `adb install -r`
  Success on SM-X115 `R8YX91AKWXJ`. Café SQLite not wiped or injected.
  Samsung keyguard was showing (Sat 29 Aug); Olaso `MainActivity` sat
  underneath. PIN not invented. Dashboard/Reports not opened. Proof is
  Convex `dailyMetrics` plus `check:offline` source-match.
- Exact next action: POLISH-01. Pushed `590696ebe2ebd6776fec144bc4950808621242e0`
  to `origin/main`.

### 2026-08-29 — SYNC-07 count waiting Settings sales not all outbox rows

- `pendingSyncCount` COUNT filters `sale-completed` / `sale-cancelled` only.
  Existing Settings copy unchanged. Mixed `check:settings` fixture: 3 sales
  + 1 `management.category.delete` → 3 not 4.
- Android research: React/data SQLite via existing Capacitor plugin. No
  Kotlin, WorkManager, or native badge.
- Checks: `check:settings`, `npx tsc -b`, `npm run build`. PIN unset.
  Install-over debug APK on SM-X115 `R8YX91AKWXJ`. Café outbox empty.
  Exact next action: SYNC-08. Pushed `91a71642629fe36f39750955a92cb53543f80377`
  to `origin/main`.

### 2026-08-29 — SYNC-08 throw when reconnect never starts

- `perform()` no longer returns `{ synced: 0, failed: 0, pending,
  refreshed: false }` when `available !== true`, `!foreground`, or
  pending staff. Gate kept. Throw before `try`.
- Unvalidated internet or unfocused activity:
  `Cloud connection failed. Check the connection and try again.`
  (`CONNECTION_SYNC_FAILURE`). Pending staff:
  `Synchronization access is unavailable. Restore terminal access and try again.`
- No `loadTerminalSettings()` on the skip path. No `recordSyncFailure` on
  skip. Settings `syncNow` catch still `setError(message)`. POS checkout
  catch still `The order is saved locally and waiting to synchronize.`
- Android research: skip is React/data using existing Android-validated
  `available` from SecureSession / `connectionContext` plus
  `document.visibilityState` / `document.hasFocus`. Official offline-first
  local source of truth
  (https://developer.android.com/topic/architecture/data-layer/offline-first).
  WorkManager is for work that continues after the app leaves the visible
  state
  (https://developer.android.com/develop/background-work/background-tasks/persistent);
  rejected because Olaso must not sync while locked, hidden, or without
  validated internet. Notification-shade sync rejected. No Kotlin, plugin,
  WorkManager, or native Sync button.
- `check:reconnect`: gate match kept; gated path throws
  `CONNECTION_SYNC_FAILURE`; pending-staff throws the access sentence;
  throw is before `try` and before `await syncPendingSales`; `synced: 0`
  skip return gone. `check:settings`. `npx tsc -b`. `npm run build`.
  `OLASO_OWNER_PIN` unset; no cloud half.
- Android: `android:sync`, debug beta BUILD SUCCESSFUL, `adb install -r`
  Success on SM-X115 `R8YX91AKWXJ`. Café SQLite not wiped or injected.
  Read-only dump: outbox 0 sales / 0 all. Launch showed Unlock Olaso
  (owner selected, Terminal online). PIN not invented. Settings not
  opened. Install-over + `check:reconnect` is the physical evidence.
- Exact next action: SYNC-09. Pushed `0379d0c1011a8a820d71a9ac173e0e85bd7d4942`
  to `origin/main`.

### 2026-08-29 — SYNC-06 verify Orders retry after failed parents no longer hide sales

- Ponytail verify-first: no TSX. SYNC-02 already lists a child whose parent
  is `failed` and still in outbox. SYNC-03 processes catalog/inventory then
  sales in the same automatic reconnect batch. Case C (sale still hidden by a
  still-pending ineligible parent after Retry) cannot happen in this worker:
  automatic reconnect only promotes `CONNECTION_SYNC_FAILURE` to `pending`
  with `available_at = 0`. Worker-gated `synced: 0` is SYNC-08.
- `check:orders`: after `makeLocalSaleRetryAvailable`, a sale depending on a
  failed `management.category.save` is listed; a sale depending on a pending
  parent is not (parent listed instead). Retry still uses
  `reconnect.run('automatic')` and does not call `makePendingOutboxAvailable`.
- Did not clear `depends_on` on a pending parent. Did not add waiting-on-change
  copy. Did not fork Settings Sync.
- Checks: `npm run check:orders` sqlite half pass; cloud half stopped at unset
  PIN. `npm run check:reconnect`. `npx tsc -b`. Graphify update after the
  check script.
- Android: `android:sync`, debug beta BUILD SUCCESSFUL, `adb install -r`
  Success on SM-X115 `R8YX91AKWXJ`. Café DB untouched. Live chained Retry not
  reproduced (0016/0017 already synced); automated check is the proof.
- Exact next action: SYNC-07. Pushed `79b10d6555fb5e529d806e575677e7af4cbf1ced`
  to `origin/main`.

### 2026-08-29 — SYNC-05 keep abandon only for true permanent conflicts

- Re-read every `conflict(` / `invalid(` operator string in `convex/sales.ts`
  against `PERMANENT_SALE_SYNC_FAILURE`. Regex not changed: every
  card-listed permanent phrase was already present.
- Still permanent: `A sale product is no longer available.`;
  `${name} changed after it was added.`; `${name} has a newer recipe.`;
  `The saved ingredient cost no longer matches its valuation revision.`;
  `Receipt number must use MMYY-0001.` plus classified
  `This saved order needs receipt-number support before it can synchronize.`
  (`/receipt-number support/i`). Existing leftover `modifier setup` /
  `selected modifier` / `category is unavailable` phrases kept, not widened.
- Reviewed and left non-permanent on purpose (do not expand):
  `A selected size for ${name} is unavailable.`;
  `${name}'s current recipe is unavailable.`;
  `A recipe ingredient is unavailable.` / `is missing.`;
  daily-summary duplicated/exceeds-limits; correction same-day / already
  corrected / history incomplete and related correction conflicts.
- Must not abandon (checks added): generic `Sale synchronization failed.`;
  SYNC-04 `Cloud rejected this saved order. Use Sync now to retry.`;
  `CONNECTION_SYNC_FAILURE`; extra-field `choiceValueIds` fixture after
  `describeSaleSyncFailure`. Must still abandon: product-unavailable fixture
  and classified receipt-number path.
- `failSale` / `abandonSale` control flow unchanged. Physical permanent
  conflict not reproduced; regex reviewed against `convex/sales.ts`. Did not
  delete a café outbox row.
- Checks: `npm run check:sales` local half pass; cloud half stopped at unset
  PIN. `npx tsc -b` pass. Graphify update after check-sales import.
- Android: `android:sync`, debug beta BUILD SUCCESSFUL, `adb install -r`
  Success on SM-X115 `R8YX91AKWXJ`. Café DB untouched.
- Exact next action: SYNC-06. Pushed `b5a0577c348e89be82125a2ce63a29f2b0ca4bff`
  to `origin/main`.

### 2026-08-29 — SYNC-04 classify cloud sale rejects without auto-retry

- In `describeSaleSyncFailure`, after auth/network/permanent branches and
  before the fallback, extra-field / `not in the validator` /
  `ArgumentValidation` (parsed message) or `INVALID_ARGUMENT` (raw error)
  returns exactly `Cloud rejected this saved order. Use Sync now to retry.`
  Secret `Uncaught ConvexError: secret server detail` still falls back to
  `Sale synchronization failed.` Convex dumps and field names are not stored.
- `failSale` already persists that classified sentence. `makeConnectivityFailuresAvailable`
  still matches only `CONNECTION_SYNC_FAILURE`. Did not touch
  `PERMANENT_SALE_SYNC_FAILURE`, `abandonSale`, SYNC-02 SQL, or reconnect
  `continue`.
- Orders `OrderDetailPanel`: failed `syncNote` is `order.syncError` when
  non-empty, else the previous hardcoded sentence.
- Checks: extra-field fixture in `check-sales.mjs`; classified sentence
  left failed in `check-reconnect.mjs`. `npm run check:sales` local half
  passed (PIN unset stopped cloud half). `check:reconnect` and `npx tsc -b`
  pass.
- Android: `android:sync`, debug beta BUILD SUCCESSFUL, `adb install -r`
  Success on SM-X115 `R8YX91AKWXJ`. Café DB untouched.
- Exact next action: SYNC-05. Pushed `8c656caeac92918404082975194d2196063e332e`
  to `origin/main`.

### 2026-08-29 — SYNC-03 attempt eligible sales after management work

- Deleted the reconnect `if (staffResult.processed + catalog.processed +
  inventory.processed > 0) continue` block. Staff → catalog → inventory →
  sales → costs order, 10-batch cap, and empty sales+costs `break` unchanged.
  Optional extra yield was skipped; the existing post-costs `setTimeout(0)`
  remains.
- `scripts/check-reconnect.mjs` asserts the processed-sum skip is absent and
  `syncPendingSales` plus `batch < 10` remain.
- `npm run check:reconnect` and `npx tsc -b` pass. `android:sync` + debug
  beta BUILD SUCCESSFUL. `adb install -r` Success on SM-X115 `R8YX91AKWXJ`.
- Café outbox left untouched; queue already drained (0826-0001…0018). Did
  not inject a failed catalog row.
- Pushed `31eb5fce8d7897b3525c5657b60f222a8d033fe8` to `origin/main`.
- Exact next action: SYNC-04.

### 2026-08-29 — SYNC-02 failed parents must not hide later work

- Three shared SQL fixes: pending-only parent blocking in
  `listPendingOutboxFromDatabase`; pending-only
  `latestPendingManagementOperationIdFromDatabase`; pending-only
  `latestPendingSaleForRecordFromDatabase` (failed/absent sale lets delete
  pin to pending management). Callers unchanged.
- Smallest checks in `check-reconnect.mjs` and the existing
  `check-local-management.mjs` failed-parent list. Catalog pending-chain
  asserts still pass.
- Install-over on SM-X115 succeeded. Café outbox left untouched;
  0826-0016/0017 had already synced after SYNC-01.
- Pushed to `origin/main` as `d5c87b0e31f7be4c6933390568683f3d15179330`.
- Exact next action: SYNC-03.

### 2026-08-28 — POLISH-01 shared shell, pills, and POS category bloom

- Phosphor replaced with Boxicons. Sliding green pills on Dine In/Take Away,
  Cash/Card, top nav, Orders filters, Reports tabs, and Products categories.
- One App-owned Header so the nav pill can animate across screens; lazy
  screens fade without a cream flash. CSS Module scope guard added.
- POS category cards keep a clipped in-card green bloom; a row-level sliding
  pill leaked into the 10px gaps and was rejected. Product grid stays still.
- On `origin/main` as `808ea0724f45f5c8df46e682faabeaee17d03dde`.

### 2026-08-27 — POLISH-01 quick-add equal chips

- Owner rejected four variable-width name+price chips: ragged widths, names
  cut off, fourth chip clipped by `overflow: hidden`.
- Query cap 4→3. Chips are equal `flex: 1; min-width: 0`, name only at 15px,
  row spans search+10px gap to the menu-column right edge (636px row, ~205px
  each of three).
- Passed: `npm run build`, `check:pos`, `check:css-scope`, `check:offline`.
  `graphify update .` ran. `android:sync` + debug beta + `adb install -r`
  succeeded on SM-X115 `R8YX91AKWXJ`. Tablet was Dozing with lockscreen;
  visual check needs owner unlock. Chips stay empty until last-7-day sales.
- Follow-up: `flex: 1` alone stretched a lone chip across the whole 636px row
  when fewer than three products qualified. Chips now carry
  `max-width: calc((100% - 20px) / 3)`, so one or two keep the three-across
  size and left-align. Rebuilt, rechecked, reinstalled on the tablet.
- Exact next action: owner unlocks Tab A9, confirms three flush equal chips,
  then review/commit. No push.

### 2026-08-26 — OPTIONS-04 honest costs and packaging closeout

- Android research: cost stays in JS (`costs.ts` + `productCostRange.ts`);
  Capacitor SQLite transactions only; no native cost engine.
- `ManagedProductCost` range (≤64 combos) in Product editor; no GP/margin.
- Removed paper-cup from seed/sale recipes; kept purchasable ingredient.
- Deleted unused `recipes.getCost`; editor stops linking modifier groups;
  operational modifier snapshot kept for legacy/pending checkout.
- Tab A9: cost line, offline/online sale, restart, cashier nav, 1340×800.
- Exact next action: commit/push; OPTIONS sequence done; ask before POLISH-01.

### 2026-08-26 — OPTIONS-03 cashier selection closeout

- Wired CartLine `sizeId`/`choiceValueIds`, selection dialog, receipt rail meta,
  `prepareSale` + `sales.accept` resolver, migration 21, sync ID mapping.
- Fixed cloud `receiptSnapshot` to persist `sizeName` so synced Orders detail
  matches the cart (was dropping size after reconnect overwrite).
- Tab A9: Ceremonial Matcha Large+Extra cream (37 MAD), offline Espresso,
  restart/Orders, cashier nav, 1340×800. Checks: sales, product-configuration,
  pos, orders, reconnect, offline, local, tsc, build, convex dev --once.
- Exact next action: commit/push, ask before OPTIONS-04.

### 2026-08-26 — OPTIONS-03 sale/resolver wiring

- Wired `resolveProductConfiguration` into `prepareSale` and Convex
  `sales.accept` (sizeId path); legacy `modifierOptionIds` when sizeId empty.
- Extended SavedReceipt / SaleSyncPayload with sizeId, sizeName,
  choiceValueIds; migration 21 `size_id_snapshot` / `size_name_snapshot`.
- `toConvexSaleArgs` maps product-size and choice-value cloud IDs.
- `check:sales` local path uses size + oat replace; cancel restores oat.
  Cloud half needs `OLASO_OWNER_PIN` (unset here). `check:product-configuration`,
  `check:local`, `tsc -b` pass. POS UI left to the other agent.
- Files: `localSales.ts`, `reconnectContext.tsx`, `convex/sales.ts`,
  `schema.ts`, `check-sales.mjs`, `check-local-database.mjs`, WORK_LEDGER.
- Exact next action: POS closeout if needed, full sales check with PIN, Tab A9,
  commit/push.

### 2026-08-26 — OPTIONS-02 tablet closeout

- Fixed Sync now failure `Management operation types are invalid` by raising
  the bounded operation-type list cap in `localManagement.ts` from 20 to 32.
- Tab A9 evidence: owner sizes/choices/copy independence, process restart
  persistence, cashier Products hidden, 1340×800, clean console on Products
  reopen. Temporary signed debuggable release used for CDP only; source
  `debuggable false` restored.
- Checks: `check:local-catalog`, `check:local-management`,
  `check:permissions`, `build`, Graphify update.
- Exact next action: commit `OPTIONS-02: …`, push `origin/main`, record SHA,
  stop and ask before OPTIONS-03.

### 2026-08-26 — OPTIONS-02 write paths implemented

- Added local product-size and choice-section write operations, archive/delete
  protection, independent copied section IDs with explicit size mapping, and
  immutable recipe size quantities. Reconnect maps local/cloud IDs and sends
  the new retry-safe `productConfiguration` mutations after product parents.
- Research decision remains Capacitor SQLite plus the management outbox:
  https://capacitorjs.com/docs/guides/storage and
  https://developer.android.com/topic/architecture/data-layer/offline-first.
  No native catalog boundary is needed.
- Focused local checks, product-configuration resolver, management checks,
  TypeScript, production build, Convex dev deployment, and Graphify pass. UI
  dialogs and physical tablet evidence remain before the card can close.

### 2026-08-26 — OPTIONS-02 owner editor implemented

- Added bounded Sizes and product-scoped Choices dialogs, including explicit
  unmapped-size selection before independent copying. Recipe versions now edit
  per-active-size ingredient quantities; Products no longer shows unsupported
  direct-cost, gross-profit, or margin claims. Legacy shared groups remain
  accessible only as the documented POS bridge.
- `npx tsc -b`, focused lint, and Graphify update passed. Physical Tab A9
  offline/reconnect evidence remains before card close.

### 2026-08-26 — OPTIONS-01 foundation ready to push

- Research: offline-first SQLite SSOT; Capacitor additive `user_version`
  upgrades; serialized plugin transactions; WebView CDP. Keep Capacitor
  SQLite; reject Room/second DB/native catalog rewrite.
- Schema 20 + eight Convex tables; Regular size backfill; seed Regular sizes;
  additive sync/cache; pure `productConfiguration` resolver unwired to
  checkout; ingredient delete repairs choice effects + size quantities;
  `check:product-configuration` / local DB 19→20; tablet-session helper;
  recovery ADB handoff doc.
- Device: signed install-over (debug APK signature mismatch with installed
  release). Owner 1340×800, Products/POS clicks. Cashier recreated through
  Staff & access with env PIN; Products hidden for cashier. Stale Convex
  sign-in errors cleared after restart.
- Exact next action: commit/push, then OPTIONS-02.

### 2026-08-25 — HARD-05 closeout pushed; HARD-06 activated

- Published `HARD-05: drop export UI and clear irreparable sync queue` as
  `625ed2bc115b82c6606f318e3b7400a94b22d7d6` on `origin/main`. HARD-06
  research recorded: durable keystore secrets, versionCode bump, same cert
  upgrades, HTTPS APK+manifest, PackageInstaller confirm. Exact next action:
  implement HARD-06.

### 2026-08-25 — HARD-05 owner closeout: drop export, fix sync queue

- Removed Settings Export/Verify and DocumentExport; kept Auto Backup off.
- Sync may use active owner/cashier session when original protected session is
  missing; sale cashierName stays on the receipt sent to Convex.
- Irreparable catalog/receipt outbox rows are abandoned; already-clouded sales
  acknowledge without re-accept. Physical verify: Waiting sales 0 / Up to date.
- Exact next action: push this closeout, then HARD-06.

### 2026-08-25 — HARD-05 pushed to origin/main

- Published `HARD-05: add SAF operational backup export and recovery` as
  `7698fa52cc6dbfc8df608b70c36a4d9dec9a39a7` on `origin/main`. No card in
  progress; HARD-06 waits for an explicit owner request.

### 2026-08-25 — HARD-05 backup/export/verify rehearsed

- Research: disable Auto Backup; exclude DB/prefs via `data_extraction_rules`
  + `backup_rules`; owner JSON from bounded SQLite reads via SAF
  `DocumentExportPlugin`; corrupt open fail-closed; recovery docs in
  `tools/recovery/`. Rejected Filesystem npm packages and whole-DB export.
- Implemented Settings Export/Verify, privacy assert, `check:recovery`,
  ARCHITECTURE/DOX updates. Physical Tab A9 export + verify preserved 7
  waiting sales; backup has no PIN/session secrets in data payload.
- Exact next action: commit/push and stop before HARD-06.

### 2026-08-25 — HARD-04 pushed to origin/main

- Published `HARD-04: right-size POS assets and defer sync after paint` as
  `cce0ebf73143b6feff72bcd33534a96804fb8512` on `origin/main`. No card in
  progress; HARD-05 waits for an explicit owner request.

### 2026-08-25 — HARD-04 measured assets, lazy screens, deferred sync

- Research kept WebView decode (right-sized WebP), Vite lazy secondary screens,
  and post-paint automatic reconnect; rejected Coil/Glide and WorkManager for
  this card. Physical before/after: APK −5.3 MB, main JS −633 KB, drink decode
  from 1408×768 to 144×184, visual POS accepted, measure medians recorded.
  Exact next action: commit/push and stop before HARD-05.

### 2026-08-25 — HARD-03 pushed to origin/main

- Published `HARD-03: brand staff-session gate and revalidate lifecycle` as
  `590c9cecfe485cd7debb28abd08d3310cd0079aa` on `origin/main`. No card in
  progress; HARD-04 waits for an explicit owner request.

### 2026-08-25 — HARD-03 physical matrix and branded staff-session gap

- Kept OlasoWebView pre-bridge triggerEvent guard; branded App staff-session
  recovery with the shared cream/green wordmark surface; android-beta assertion
  added. Physical Galaxy Tab A9 matrix (cold, shade, screen-off, bg/fg, long
  sleep) all clean with zero triggerEvent/Capacitor/uncaught/AndroidRuntime
  errors, 1340×800 viewport, and validated native online after resume.
- Cashier unlock verified after offline recreate; final owner POS empty cart
  with internet. Graphify code-only refresh: 2,450 nodes / 4,632 edges.
  Exact next action: commit/push and stop before HARD-04.

### 2026-08-25 — HARD-03 activated after owner unlock and cashier reset

- Owner unlocked on the tablet; Samira was deleted and recreated offline so a
  known cashier PIN exists for later role checks. No PIN values were written to
  the ledger or source tree.
- HARD-03 research selects the existing OlasoWebView pre-bridge triggerEvent
  guard plus SecureSession networkStatus/NetworkCallback boundary. Exact next
  action: remove the unbranded staff-session intermediate and run the physical
  lifecycle matrix.

### 2026-08-25 — HARD-02 pushed to origin/main

- Published `HARD-02: brand cream launch and white-on-sage icon` as
  `632dc101258ac3226eb24f1041afe7faed2aa78c` on `origin/main`.
- Card complete. HARD-03 stays pending until the owner asks.

### 2026-08-25 — HARD-02 physical launch continuity verified

- Installed current beta on SM-X115. Cold-launch contact sheet shows cream
  native splash, then one green OLASO with three dots, then Lock. App drawer
  shows the full white-on-sage launcher. Focused logs had zero tile-memory,
  Capacitor, AndroidRuntime, chromium error, or `Starting Olaso…` hits.
- Five cold / five warm lock-ready runs: cold median Android/lock
  1,093/1,911 ms; warm 244/574 ms. All viewports 1340 × 800. Budgets pass.
- Docs updated for cream-native splash, web wordmark+dots, and
  `onPageCommitVisible` handoff. Exact next action: push and record SHA.

### 2026-08-25 — HARD-02 resumes on unverified onPageCommitVisible handoff

- Owner-approved design is one green web OLASO plus bouncing dots after a
  plain cream native splash; no duplicate logo and no “Starting Olaso…”.
- Earlier `postVisualStateCallback` path caused Chromium tile-memory warnings
  on the Galaxy Tab A9. Current code uses SplashScreen exit-overlay retention
  plus Capacitor `onPageCommitVisible` / page-failure release. Final APK
  build/test after that change was interrupted and is not yet proven.
- Exact next action: build/install and physical cold-launch recording proof.

### 2026-08-25 — HARD-02 recording exposed early WebView splash dismissal

- The first implementation passes its 140-task Android beta and is installed.
  Samsung's app drawer shows the genuine complete white-on-sage OLASO icon;
  cold-launch recording shows the genuine green logo on the cream surface.
- The original physical recording nevertheless exposes two intermediate
  cream-only frames after Android dismisses the splash and before HTML paints.
  Android explicitly documents that page-finished alone is insufficient;
  `postVisualStateCallback` is the exact HTML/image/CSS first-frame guarantee.
- Existing Capacitor `WebViewListener.onPageLoaded` provides the correct native
  callback without replacing the existing bridge client. Keep the system
  splash only until the actual page visual state is ready, releasing failures
  immediately; no fixed delay or additional dependency.
- Mandatory bug gate: root-fix and prove the exact recorded launch before
  proceeding with HARD-02 acceptance. Later physical runs of that callback
  produced Chromium tile-memory warnings, so the handoff was revised again.

### 2026-08-25 — HARD-02 activated after official Android launch research

- The owner explicitly authorized only HARD-02. Re-read the full applicable
  root/Android/source/data instruction chains, canonical plan, active ledger,
  goal contract, and approved brand/startup authorities; Graphify was queried
  before inspecting code, and `main` is clean and matches `origin/main`.
- Android requires one static opaque system launch surface, an actual vector
  drawable inside the splash/adaptive mask, a post-splash theme, and the
  centered 66 × 66 adaptive safe area. The existing app already depends on
  `androidx.core:core-splashscreen:1.2.0`; Capacitor does not require its
  separate optional splash plugin for the Android system's launch behavior.
- Keep native launch/icon/window/WebView appearance in Android; retain SQLite
  and lock readiness in their existing React/data owners. Reuse exact traced
  owner-supplied artwork, original white-on-sage launcher branding, and the
  approved green-on-cream launch wordmark. Add no plugin, second activity,
  animation format, artificial delay, crop, stretch, or speculative icon.
- Exact next action: implement HARD-02 alone and verify true cold/warm
  launches, the real launcher icon, startup continuity, the exact viewport,
  protected lock/POS access, focused regressions, and clean physical logs.

### 2026-08-25 — NAV-01 category-image correction pushed to main

- Committed and pushed the complete physically verified category-retention
  correction directly to `origin/main` as
  `4890e9f6055cbb1b52a2ab1402576bf4f14adf05`.
- Five original online loops and one flight-mode loop rebuild/remove zero
  Coffee images; all nine original objects survive. The 140-task installed
  Android beta, focused regressions, touch behavior, exact viewport, restored
  internet/empty cart, clean app logs, and refreshed Graphify all pass.
- Exact next action: stop with no card in progress. HARD-02 remains the next
  card, pending the owner's explicit instruction.

### 2026-08-25 — NAV-01 category-image root fix verified on the tablet

- Reused installed React Activity for previously visited live POS categories;
  unvisited grids never mount and removed category grids are not retained.
- Built and installed the complete 140-task Android beta. Original physical
  Coffee → Bakery → Reports → POS → Coffee now retains the same nine Coffee
  image nodes with zero additions/removals; five repeated cycles and an
  offline flight-mode cycle pass identically. First Bakery access loads only
  its two genuine new products. Exactly one category grid stays visible.
- Physical Bakery add/remove, empty-cart restoration, restored internet, exact
  1340 by 800 geometry, no alerts, and focused clean Android/WebView logs pass.
  Navigation, POS, lock, offline, catalog, TypeScript, web build, Android
  checks/build, and the 3,338-node/7,629-edge Graphify refresh pass.
- Exact next action: push the implementation directly to `origin/main`, record
  its full SHA, then stop with HARD-02 pending.

### 2026-08-25 — NAV-01 reopened for reproduced POS category image bug

- The owner identified intermittent Coffee image reconstruction after selecting
  Bakery, leaving POS for Reports, returning to POS, and selecting Coffee.
- Physical WebView observation proved the previous screen-retention fix works:
  returning to POS creates no images. However, selecting Bakery removes nine
  Coffee images and selecting Coffee recreates those same nine DOM elements.
- Current official React, Android rendering, and Capacitor guidance supports
  retaining only visited category grids with the already installed React
  Activity boundary. No additional Android plugin, dependency, global cache,
  or eager unvisited-category rendering is justified.
- Reopened NAV-01 under PLAN.md's mandatory bug rule. HARD-02 remains pending;
  the exact next action is the focused root fix plus physical regression proof.

### 2026-08-25 — NAV-01 complete and pushed; HARD-02 pending

- Committed and pushed verified NAV-01 directly to `origin/main` as
  `0e79396d56215f193d80dafd3405518f1e26f2d3`; local and remote SHAs match.
- Physical 30-switch zero-image/zero-SQLite navigation, preserved interaction
  state, protected Owner/Samira offline cart handoff, restored cashier access,
  immediate clock resume, historical data, exact viewport, clean logs, focused
  regressions, 140-task beta, authorities, DOX, and Graphify all pass.
- Exact next action: stop with no active card. Activate only HARD-02 after the
  owner requests the approved Android OLASO launch and app icon.

### 2026-08-25 — NAV-01 final physical retained-navigation matrix passes

- Final installed 140-task beta measured five physical cold/warm starts and
  five full navigation rounds. After initial authenticated reconnect settles,
  30 more destination changes perform zero SQLite requests, recreate/remove
  zero images, retain six visited screens, and show exactly one. POS return
  falls from 14 reconstructed images/15–30 requests to zero/zero.
- Verified exact POS search/image node, Reports subtab, Stock search/scroll,
  owner-only Settings, immediate reversible receipt-language changes, real
  screen-off/keyguard resume, 85-ms current clock, and exact 1340 by 800 fit.
- Repaired the pre-existing active Samira profile's missing identity through
  approved protected support provisioning; no credential was logged or saved.
  Actual Owner/Samira offline switches preserve the draft cart, destroy all
  owner-only trees, expose only cashier POS/Orders, and preserve 13 sales,
  seven historical outbox rows, and two active profiles. A false transient
  invalid-cart warning is fixed and guarded; the QA cart is cleared.
- Focused navigation/lock/local/identity/offline/receipt/Android checks,
  TypeScript, production build, final current-device installation, exact
  owner-POS geometry, and clean ordinary runtime logs pass. Graphify is
  refreshed to 3,334 nodes and 7,625 edges.
- Exact next action: push NAV-01 directly to main, record its SHA, and stop.

### 2026-08-25 — NAV-01 activated after official Android and React research

- Reread the tracked Markdown authorities, active plans, offline/identity
  safeguards, and every applicable source/data/feature DOX chain. HARD-01's
  pushed five-run physical measurements provide the actual before baseline.
- Android's navigation/state-holder documentation requires previously loaded
  destination state to remain instantly available. React 19.2 officially
  supports Activity boundaries that preserve state and DOM while cleaning up
  hidden effects; Capacitor ties existing foreground callbacks to Android's
  real Activity lifecycle.
- Chosen boundary: App-owned visited/authorized React screen retention;
  existing Android lifecycle, protected sessions, local SQLite, data hooks,
  and authenticated reconnect worker remain their current owners. No router,
  state/cache library, custom listener, native plugin, or unauthorized
  pre-rendering is introduced.
- Exact next action: trace every navigation, authorization, profile-switch,
  refresh, clock, and lifecycle caller; implement NAV-01 only, add the
  smallest regression guard, and compare the real tablet with HARD-01.

### 2026-08-25 — HARD-01 complete and pushed; NAV-01 pending

- Committed and pushed the verified HARD-01 implementation directly to
  `origin/main` as `0e0042aeb2da5f9df534fa0f5184d176965d3f8d`; local and
  remote SHAs match.
- Five cold/five warm physical launches, five rounds across all six screens,
  flight mode, preserved sales/outbox/staff history, the ordered native SQLite
  rollback/close root fix, focused Android/local/identity/receipt/build
  checks, exact viewport, clean logs, and refreshed Graphify all pass.
- Exact next action: stop with NAV-01 pending; activate it only when the owner
  asks to continue, after its required official platform research.

### 2026-08-25 — Five-run tablet startup and navigation baseline verified

- Final physical device: `SM-X115`, Android 16/API 36, Google WebView
  `151.0.7922.199`, debug APK, exact 1340 × 800 viewport. Five forced-process
  cold samples give median Android-display/Lock-ready/post-PIN-menu
  1,081/1,912/885 ms. Five Android-confirmed same-process warm Activity
  recreations give 191/515/766 ms. Lock-ready includes conservative host ADB
  inspection overhead; manual PIN entry is never included or persisted.
- SQLite/Lock/profile ready marks, local query counts, image insertion/removal,
  network resource entries, long tasks, exact APK/assets, Android/WebView
  identity, and all 30 authorized screen transitions are captured by the small
  standard-library-only `npm run measure:android` host command.
- POS reconstruction is confirmed rather than inferred: every repeat adds 14
  images and performs 15–30 SQLite requests. Nine 1,408 × 768 source images
  display at 72 × 92. The APK contains 31,626,309 bytes, initial JS 925,371,
  CSS 265,782, browser SQLite WASM 652,953, and PNG artwork 4,276,415 bytes.
  The generic white/blue native splash remains an explicit HARD-02 task.
- Flight mode proves cold/warm unlock and all six screens. The regression
  deliberately leaves a real native SQLite transaction open, recreates the
  Activity without killing its process, successfully unlocks the owner, and
  verifies all 13 sales, seven unchanged historical outbox rows, and two
  active staff remain intact. Reconnected normal cold/warm logs are clean.
- Focused Android, SQLite, local management/catalog/inventory/staff, lock,
  settings, identity, reconnect, offline, POS, costs, printing, TypeScript,
  and build checks pass. Graphify is refreshed to 3,320 nodes/7,602 edges;
  final physical viewport and focused Android runtime logs remain clean.
- Exact next action: commit/push verified HARD-01 directly to `origin/main`,
  record the implementation SHA, then stop with NAV-01 pending.

### 2026-08-25 — HARD-01 warm-recreation database lock root-fixed

- The first direct native close interrupted queued SQLite work; the second
  queued close still left an unfinished transaction checked out in Android's
  SQLite pool. Physical retry reproduced the original locked-database failure
  after both incomplete attempts, preventing a cosmetic or unverified fix.
- `MainActivity.onDestroy()` now queues rollback of any unfinished SQLite
  transaction and then closes the exact `olaso_pos` connection on its own
  existing Capacitor plugin thread before safe bridge shutdown. Committed
  history remains intact; interrupted uncommitted work rolls back atomically.
- The existing runnable Android check now rejects missing cleanup, UI-thread
  cleanup, close-before-rollback, or bridge destruction before ordered queue
  registration. Full 140-task Android beta plus install-over-upgrade pass.
- The physical original failure now passes: cold launch/owner unlock, actual
  Android-reported warm Activity recreation, second owner unlock, live local
  menu, and all six-screen navigation. No SQLite lock workaround, process
  restart, data reset, extra dependency, or diagnostic secret was introduced.
- The new standard-library-only physical harness records Android display,
  WebView/SQLite/Lock/menu readiness, per-screen SQLite calls, removed/added
  images, asset dimensions, and package weight. Exact next action: complete
  five-run measurements, offline/history/log proof, docs, Graphify, and push.

### 2026-08-25 — HARD-01 exposes reproducible warm-recreation database lock

- Rebuilt and installed the unchanged 140-task Android beta on the connected
  SM-X115. The first controlled cold launch displayed in 1,403 ms, reached
  its usable Lock screen in 2,310 ms, and loaded the local POS 733 ms after
  the accepted owner PIN.
- The first true same-process Android `LaunchState: WARM` recreated the
  Activity, then online owner authentication succeeded server-side but local
  reconciliation failed with `database is locked (code 5)`. Direct debug-only
  Capacitor boundary inspection confirmed `CapacitorSQLite.beginTransaction`
  as the failing call without exposing the session or PIN.
- Inspected the installed plugin and Android lifecycle sources: each Activity
  constructs a new plugin/native database dictionary; the plugin never closes
  its old connection during bridge destruction. Android documents releasing
  Activity-owned resources, and the installed plugin exposes explicit
  connection close.
- The mandatory root-bug gate supersedes the remaining measurements. Exact
  next action: close the existing native connection before Activity/bridge
  destruction, add a focused native check, rebuild/reinstall, and reproduce
  repeated real warm recreation plus owner unlock on the physical tablet.

### 2026-08-25 — HARD-01 activated after official Android research

- Read the root/Android/source/data/feature/Lock/POS instruction chains,
  PLAN.md, WORK_LEDGER.md, Goal 06's exact card contract, and the current
  architecture/design startup and navigation authorities. Graphify mapped the
  existing native Activity, WebView, Android checks, and startup boundary.
- Current official Android startup, Macrobenchmark, Chrome WebView, and
  Capacitor App documentation establishes first-frame versus fully-usable
  timing, cold/warm process semantics, repeated median/minimum/maximum device
  measurements, release/profileable benchmark limitations, and real Android
  activity lifecycle.
- Chosen boundary: Android owns physical process/activity timing and the
  existing debug-only WebView inspection; React/data owns local SQLite, lock,
  POS/menu readiness, and repeat-navigation evidence. Reject permanent
  telemetry, native plugins, new benchmark modules/dependencies, a fake
  release baseline, hidden waits, and optimizations before measurement.
- HARD-01 alone is in progress. Exact next action: inspect existing launch and
  packaging ownership, rebuild/install the unchanged current beta, and measure
  five physical cold/warm launches, navigation, images, assets, local
  readiness, and clean logs.

### 2026-08-25 — DELETE-01 complete on origin/main

- Pushed `DELETE-01: add safe permanent management deletion` directly to
  `origin/main` as `dc86855798041f1e772a7ca3d8729841549faa9d` and
  independently verified that the remote main reference resolves to that SHA.
- Full schema/history/local/cloud/staff/printing/Android/build checks, the
  deployed management/permissions/report suites, refreshed Graphify, exact
  physical offline restart and cross-domain reconnect, preserved historical
  names, protected profile isolation, 1340 × 800 screens, and clean runtime
  logs all pass. No unrelated files, credentials, signing keys, generated
  Android artifacts, or local hardware helpers were committed.
- Goal 06 remains active without an in-progress card. HARD-01 is next and
  remains pending until the owner explicitly asks to begin it.

### 2026-08-25 — DELETE-01 final physical offline/reconnect matrix passes

- Galaxy Tab A9 upgraded schema 18 → 19 without clearing its 11 original sales
  or seven pre-existing unrelated failed historical rows. In flight mode,
  created a category, product, priced recipe with two ingredients, completed
  sale, and protected cashier; the cashier unlocked offline with only cashier
  screens, then owner access permanently removed the cashier while preserving
  Owner/Samira. Category removal left the drink uncategorized, ingredient
  removal created immutable repaired recipe version 2 and made the product
  unavailable, and product removal preserved its order and both recipes.
- A forced offline app restart retained every pending change and historical
  name while exposing only the two legitimate profiles. The first reconnect
  exposed a real product revision conflict because independent deletion
  operations shared the same sale parent. Root-fixed the shared SQLite
  dependency lookup to follow the latest operational descendant of that
  parent; expanded populated catalog and inventory checks to reproduce exact
  category → ingredient → product ordering before rebuilding the Android app.
- Repeated the entire real offline recipe/sale/deletion sequence on the fixed
  beta. Every queued change acknowledged automatically in order, the cloud
  contains exactly one sale and zero deleted products/categories/ingredients/
  staff, and a second reconnect remains unchanged. Orders and Reports retain
  the exact deleted names and amounts; Costs retains saved worker names;
  SQL foreign-key violations and staff-PIN payload exposure are zero.
- Products, Stock, Orders, Reports/Costs, Settings/Staff, Lock, and POS fit
  exactly 1340 × 800 without overflow. Focused Android console/error logs are
  empty. Archived staff copies fell from 44 to zero; only 11 archived
  ingredients needed by seven pre-existing failed historical rows remain.
- Exact next action: run final regression/build checks, refresh Graphify,
  commit/push DELETE-01 directly to origin/main, record its SHA, and stop with
  HARD-01 pending for the owner's next instruction.
- Final regression/build checks pass and Graphify refreshed successfully to
  3,287 nodes, 7,552 edges, and 162 communities; direct main commit/push and
  SHA evidence are the only remaining closeout actions.

### 2026-08-25 — DELETE-01 physical migration exposes archived-copy accumulation

- Installed the first deletion APK over the connected Galaxy Tab A9 without
  clearing data. Its real SQLite database upgraded 18 → 19 with 11 sales, four
  categories, 15 products, 14 active ingredients, two active staff, seven
  unchanged old failed sale/correction rows, and zero foreign-key violations.
- Direct tablet inspection reproduced the owner's original archive complaint:
  678 obsolete archived ingredient copies and 44 archived profile copies were
  still stored even though ordinary screens hid them. Existing catalog cleanup
  also deleted immutable recipe versions when removing a stale product copy.
- Root-fixed the shared complete-snapshot boundary: preserve inactive recipe
  history and its independent names, delete absent archived ingredients/staff,
  retain any ingredient or actor required by queued sale/correction/management
  work, populate recipe snapshots during fresh cloud replacement, and clear
  obsolete protected staff credentials after authenticated reconciliation.
- The first physical cleanup removed many stale records but retained 420
  ingredients and seven staff copies with the exact same deterministic
  timestamp as current records. Replaced timestamp-based pruning with actual
  complete-snapshot membership and expanded the regression to reproduce that
  exact equal-timestamp failure.
- Expanded the existing local-catalog check with archived ingredient/product/
  profile history, saved wage/movement/recipe names, pending staff/ingredient
  retention, and `foreign_key_check`; catalog, staff, reconnect, and
  TypeScript checks pass. Exact next action: rebuild/reinstall the root-fixed
  APK, unlock the physical tablet, and complete full offline deletion QA.

### 2026-08-25 — DELETE-01 deployed checks and worker-history root fix

- Deployed the current Convex functions and passed the expanded live
  `npm run check:management` matrix: deleting a category releases its product,
  uncategorized editing works, product deletion retries safely, ingredient
  deletion preserves/rebuilds immutable recipes and removes choice effects,
  and staff deletion preserves compensation history.
- Found and root-fixed a remaining user-visible bug: the deleted worker's
  compensation appeared as `Staff` because its historical name never crossed
  the local compensation read/replacement boundary. New wage saves, cloud
  replacement, local reports, and the owner-only Costs row now carry the
  independent name/role snapshot. The existing physical-data-style staff
  regression now proves the deleted worker remains named and the monthly total
  is unchanged.
- Reread and updated the governing root, data, Products, Stock, POS, Settings,
  Reports, Convex, and architecture contracts so they no longer describe
  archive-only behavior. Exact next action: finish protected full cloud/local
  regression, build/install without erasing tablet data, and run the physical
  offline/restart/reconnect/history/role/layout/log matrix.

### 2026-08-25 — DELETE-01 local, cloud, UI, and history checks implemented

- Expanded the schema-19 migration check with populated menu choices, sale
  items, ingredient movements/purchases, immutable recipes, and staff wages.
  Existing orders now own historical category snapshots; deleting each live
  record preserves every independent historical row with foreign keys on.
- Implemented the four atomic local delete operations and actor-authorized
  cloud deletions. Earlier pending sales/corrections block dependent removals;
  removed ingredients retain names/base units, strip active choice effects,
  create an immutable repaired recipe when other ingredients remain, and mark
  affected products unavailable. Staff removal protects the active/final owner,
  retains old actor credentials only until queued work is acknowledged, then
  revokes protected/cloud access without deleting compensation history.
- Added short category/product/ingredient/staff delete controls, uncategorized
  product editing/POS browsing, historical offline category/ingredient reports,
  and cancellation after a category/ingredient is gone. Strengthened the
  existing focused catalog, inventory/cost, staff, migration, and offline
  checks instead of adding a new dependency or test framework.
- `npm run check:local`, `npm run check:local-catalog`,
  `npm run check:local-inventory-costs`, `npm run check:local-staff`,
  `npm run check:offline`, `npx tsc -b`, `npm run check:convex`, and
  `npm run build` pass. Exact next action: protected live regression/deploy,
  then physical-tablet offline/reconnect/history/permission/layout evidence.

### 2026-08-25 — DELETE-01 schema-19 history migration passes

- Added one new ordered SQLite migration without rewriting any released
  migration. Products can now lose their category; historical recipe versions
  no longer require a live product; recipe items, stock movements, purchases,
  and compensation retain independent ingredient/product/staff snapshots.
- The first migration ordering reproduced a real `FOREIGN KEY constraint
  failed` at transaction commit even though `foreign_key_check` was empty.
  Deferred SQLite parent-drop accounting was the root cause; rebuilt children
  before parents instead of disabling foreign keys or bypassing the check.
- `npm run check:local`, `npm run check:local-catalog`,
  `npm run check:local-inventory-costs`, and `npm run check:local-staff` all
  pass with schema 19. No tablet data was modified. Exact next action: add
  populated-history migration regressions, then local/cloud/UI deletion.

### 2026-08-25 — DELETE-01 dependency and history tracing complete

- Reread the complete root/source/data/Products/Stock/Settings/Convex DOX chain,
  all 2,675 current ledger lines, the canonical plan, and the active card after
  context compaction. Graphify traced local transactions, management operations,
  reconnect dispatch, protected staff sessions, product/category screens,
  ingredient reports, immutable sale snapshots, and cloud authority paths.
- Confirmed the root issue: SQLite foreign keys currently forbid deleting a
  category with products, a product with recipe versions, an ingredient with
  recipe/movement/purchase history, or a staff member with compensation.
  Historical receipts already contain independent immutable names, prices,
  ingredient effects, and actor labels, but offline ingredient reports still
  join the removable live ingredient and require their own saved snapshot.
- Confirmed pending-sale ordering cannot be bypassed: a deletion after an
  offline order must wait for that saved sale to synchronize before removing
  its live cloud product/category/ingredient. A removed staff member's
  protected credential must remain usable only for that person's pre-existing
  queued writes, then be removed after owner-authorized cloud revocation.
- Chosen implementation: one additive schema-19 migration preserving current
  records and foreign-key validity; nullable product category ownership;
  history-owned product/ingredient/staff snapshots; four bounded, authorized,
  retry-safe local/cloud delete operations; clear confirmation actions; and
  focused migration, dependency, historical-report, and role regressions.
  Exact next action: implement schema 19 and domain operations before device
  installation or completion claims.

### 2026-08-25 — Original plan order restored and DELETE-01 activated

- The owner explicitly rejected starting the new separate product-options
  plan immediately. Restored DELETE-01, the original navigation/startup,
  recovery, release, and security work first; OPTIONS-01 through OPTIONS-04
  follow before the final owner-led visual review and acceptance.
- Activated only DELETE-01. Graphify traced the existing SQLite, Convex,
  Products, Stock, identity, and offline-view boundaries. Current official
  Android offline-first/SQLiteDatabase, installed Capacitor SQLite
  transaction/API, and Convex writing/indexing guidance were researched.
- Decision: retain the existing native Android SQLite local source of truth,
  bound transactional local deletes, protected role/session checks, immutable
  snapshots, existing management outbox/original-actor retry, and bounded
  transactional Convex mutations. Android foreign-key behavior will be checked
  explicitly. No Room, WorkManager, new plugin, state library, network-bound
  deletion button, or destruction of sales/financial history is permitted.
- Updated `PLAN.md`, both Goal 06 documents, and this ledger to preserve the
  owner's revised sequence. Exact next action: read the applicable child DOX
  chain and inspect every delete/archive/reference/snapshot/identity/sync/UI
  caller before implementing DELETE-01.

### 2026-08-25 — Product-owned choices and exact ingredient blueprint approved

- The owner required product-owned sizes and freely named independent choices,
  exact size/choice ingredient recipes, real milk substitution and stock
  deduction, mandatory `Copy choices from another product`, offline operation,
  historical snapshots, and honest configuration-dependent ingredient costs.
- Explicit exclusions: disposable packaging as a recipe cost, nested
  house-syrup recipes/manufacturing, permanently fixed Size/Milk/Syrup/Extras
  cards, shared mutable groups, and a detailed Edit Product profitability
  preview. House-made syrup remains one normally priced stock ingredient.
- Added `goals/GOAL-06-PRODUCT-CONFIGURATION.md`; aligned `PLAN.md`,
  `PRODUCT.md`, `ARCHITECTURE.md`, `DESIGN.md`, the Goal 06 plan, and this
  ledger. OPTIONS-01 through OPTIONS-04 now run before DELETE-01; removal of
  categories, products, ingredients, and staff preserves the relevant live
  reassignment/repair rules and immutable historical snapshots.
- Documentation only: no source, theme, native code, APK, or runtime behavior
  changed. The blueprint commit is pushed directly to `origin/main` as
  `b68aa8c11a01229cc2f7f0fdf176f324e046cd24`; local Markdown links, consistent
  five-card order, and `git diff --cached --check` all passed. No implementation
  card was activated. Exact next action: wait for owner direction, then activate
  only OPTIONS-01.

### 2026-08-24 — LOCAL-04 complete on origin/main

- `LOCAL-04: close offline management reliability` is pushed directly to
  `origin/main` as `7f240210c2a591649f7fabd3c3fe51fb9db72df3`; local and remote
  resolved to that same full SHA before this completion record.
- LOCAL-04 is done with schema 18/original-actor attribution, every physical
  flight-mode management UI, repeated restart/reconnect/exactly-once proof,
  role isolation, stale catalog/finance cleanup, explicit archived filters,
  hidden-keyguard focus gating, full regression, repeated 140-task Android beta,
  final exact APK, clean logs, Graphify, authority, DOX, and QA cleanup evidence.
- No card is active. Per the owner's instruction, stop now and discuss the
  pending DELETE-01 policy/UI before any deletion implementation or HARD-01.

### 2026-08-24 — LOCAL-04 full matrix and mandatory fixes complete

- Added schema 18 actor profile IDs and one tested operation-session resolver.
  The owner can reconnect another person's queued work, but each cloud mutation
  authenticates with the original profile's protected token. Legacy label-only
  rows fail unless the active name matches. Local and cloud proof retained the
  manager actor across category/product/modifier/recipe/ingredient/purchase/
  adjustment/expense work and the owner actor for staff/compensation.
- The real tablet completed every authorized UI in flight mode, including an
  offline-created manager/PIN, exact stock package/count operations, POS use of
  the offline product/required modifier/recipe, expense correction, and one
  owner-only compensation period. All survived restart; six pending second-
  batch operations synchronized to zero, and repeat reconnect left one group,
  product, compensation and one three-row expense correction set.
- Physical QA root-fixed stale replacement accumulation in catalog and finance,
  plus default Products/Stock archived filtering. Current seed refresh leaves
  4 categories, 15 products, 14 active ingredients, zero expenses, one seed
  compensation, Owner/Samira only, 11 preserved local sales, seven unchanged
  historical failed sale/correction rows, and zero management outbox rows.
- A system-keyguard portrait measurement was not a visible app defect: unlock
  correctly restored 1340 by 800. The associated hidden-wake network race was
  real and is fixed by requiring both visibility and window focus. Two exact
  wake-behind-keyguard cycles now emit zero WebView warning/error; focused
  Android runtime failures are zero and final owner POS is exact 1340 by 800.
- Full local management/catalog/inventory/cost/staff/migration/reconnect/sales/
  Orders/backend/permissions/offline/identity/Settings/POS/Dashboard/Reports/
  Android/TypeScript/Convex/build checks pass. Graphify refreshed to 3,241
  nodes and 7,452 edges. The temporary app-private pre-migration backup was
  removed after verified preservation. Exact next action is implementation
  commit/push and SHA closeout, then stop for the owner's DELETE-01 discussion.

### 2026-08-24 — DELETE-01 added before final offline closeout

- The owner rejected archive-only CRUD and the resulting duplicate archived
  records in everyday Products/Stock lists. Permanent deletion must exist where
  historical truth already survives independently, but not where deletion
  would break staff identity, stock valuation, expense, compensation, sale, or
  correction history.
- This is not a safe one-button patch: it needs local-first delete operations,
  dependency validation, idempotent cloud acknowledgement, restart/reconnect,
  and real UI confirmation. Added DELETE-01 as a dedicated card before LOCAL-04
  can close. Product deletion preserves immutable sale snapshots; empty
  categories and unused modifiers can delete; only never-used ingredients can
  delete. Staff and append-only financial/stock/sale records do not hard-delete.
- The owner later directed completion of all LOCAL-04 work first, followed by a
  stop for discussion. DELETE-01 therefore remains pending after LOCAL-04 and
  before HARD-01; no manual-polish card moves earlier.

### 2026-08-24 — LOCAL-04 paused on cross-staff audit root cause

- Caller inspection found that local management rows correctly persist actor
  profile/name/role, but `ReconnectProvider` passes the currently unlocked
  session to every catalog, inventory, cost, and staff cloud mutation. If a
  different staff member restores internet, cloud `updatedBy` falsely records
  that later person. Pending sales/corrections have the same systemic problem
  and currently persist only an actor label, not the originating profile ID.
- The acceptance matrix is paused under the mandatory bug rule. The root fix is
  to keep original profile identity with every new local sale/correction and
  use the existing profile-scoped protected session for each queued write. The
  visible current staff still owns reconnect orchestration, but never replaces
  the operation actor. Legacy rows may sync only when their saved actor label
  matches the active profile; otherwise they fail honestly rather than being
  misattributed.
- Exact next action: add one ordered migration, a small tested actor-session
  resolver, route every queued management/sale/correction dispatch through it,
  and reproduce manager-offline/owner-reconnect attribution before resuming the
  rest of LOCAL-04.

### 2026-08-24 — LOCAL-04 physical UI exposed stale catalog accumulation

- The schema-18 APK upgraded the real database without clearing data and the
  offline-created `LOCAL04 Manager` immediately unlocked with manager access.
  Before adding catalog QA data, Products rendered the 15 live products plus
  the full 500-row bound and dozens of duplicate archived categories left by
  earlier development cloud resets.
- Root cause is `replaceOperationalCache`: it archived every prior cloud row
  and upserted the new bounded snapshot but never deleted cloud-owned category,
  product, modifier, or recipe rows absent from the replacement. Immutable sale
  snapshots do not depend on those stale catalog rows, and refresh is already
  forbidden while operational management work is pending.
- Added bounded stale-catalog pruning after a successful replacement, ordered
  from recipe children through products/categories, while retaining every row
  present in the current snapshot and leaving ingredient/stock history intact.
  A focused regression reproduces and removes the old archived category/product
  pair while preserving the current pair. Exact next action: rebuild/install,
  continue the offline matrix, then prove reconnect collapses the tablet back
  to the current bounded cloud catalog without losing QA data.

### 2026-08-24 — LOCAL-04 activated as an acceptance and bug-fix card

- The owner said to continue. LOCAL-04 is the only in-progress card; HARD-01
  and every later card remain pending. `main` was clean and synchronized at
  `faf811611f55804b4baa9e535f47b7b009ee70c0` before activation.
- Reread the applicable root/Android/Convex/source/data/feature DOX, PLAN, Goal
  06 contract, ledger, and local-first authorities, then queried Graphify for
  the catalog, recipe, inventory, finance, staff, permission, outbox, mapping,
  and reconnect paths before manual inspection.
- Android's current offline-first guidance requires local data as the exclusive
  upper-layer source and recommends critical lazy writes: commit locally, queue,
  then reconcile. The existing Capacitor SQLite explicit transactions remain
  the native boundary. WorkManager remains rejected because Olaso does not
  authorize staff cloud work after lock/process exit; the durable SQLite queue
  waits for the next visible authenticated session.
- Sources: https://developer.android.com/topic/architecture/data-layer/offline-first,
  https://developer.android.com/develop/background-work/background-tasks/persistent,
  https://github.com/capacitor-community/sqlite/blob/master/docs/SQLiteTransaction.md,
  and https://capacitorjs.com/docs.
- LOCAL-04 begins with evidence, not new architecture. It must exercise every
  real owner/manager/cashier UI path in flight mode, restart before reconnect,
  verify parent ordering and single effects after repeated reconnect, inject a
  recoverable failure, prove sensitive role isolation online/offline, and clean
  QA records through normal archive/correction flows. Any bug invokes the
  mandatory root-cause gate.

### 2026-08-24 — LOCK-01 complete on origin/main

- `LOCK-01: add role-safe staff switching` is pushed directly to `origin/main`
  as `4486a8921d893e3e5edce098b8a17a500cf0a537`; local `main` and the remote
  resolved to that same full SHA before this completion record.
- LOCK-01 is done with approved cart policy, shared role-safe access, protected
  credential preservation, full regression/build, repeated 140-task Android
  beta, final APK install, owner/cashier online/offline/restart handoff, exact
  viewport, clean logs, mandatory redundant-Settings fix, Graphify, authority,
  and DOX evidence. No card is active; LOCAL-04 is next when the owner continues.

### 2026-08-24 — LOCK-01 physical handoff and regression complete

- Installed the checked 140-task beta over the real tablet data without
  clearing it. Owner sees Settings plus Lock / switch staff; Samira Barista sees
  only Lock / switch staff. Empty-cart switching locks immediately. With one
  Espresso Plus in the cart, Cancel kept owner and the exact cart; confirm
  locked, then Samira unlocked and inherited that exact cart.
- In flight mode, Samira locked and owner unlocked with the cart preserved. The
  test cart was removed without checkout, force-stop/relaunch returned to Lock,
  and Samira unlocked offline after restart. Internet was restored and the
  tablet was left online as owner with an empty cart. Sales remained 11 and the
  seven pre-existing failed development outbox rows were unchanged.
- Exact 1340 by 800 live WebView bounds have no overflow and produced zero
  warning/error after reload. Focused Android runtime failures are zero. Full
  focused, local, cloud-backed, offline, identity, Android, TypeScript, and
  production build checks pass. Final APK QA caught one redundant Settings menu
  item while Settings was already open: `SettingsScreen` supplied a dummy open
  callback. The callback was removed, the source regression now rejects it,
  and the rebuilt/reinstalled APK proves POS has Settings plus switch while
  Settings has switch only. Graphify is current at 3,211 nodes and 7,405 edges.
  Exact next action is final review, implementation commit, and push.

### 2026-08-24 — LOCK-01 shared action implemented

- Added one compact profile menu used by every Header. Owners see Settings plus
  Lock / switch staff; managers and cashiers see only Lock / switch staff.
  Outside-click and Escape close it, and lock failure remains visible without
  exposing Settings or credential details.
- App retains ownership of the only lock transaction and the POS session. An
  empty cart locks immediately; a non-empty cart uses the approved one-sentence
  confirmation. Cancel leaves the current staff/cart untouched; confirm saves
  the lock flag, clears only active in-memory staff identity, and preserves the
  cart for the next authenticated staff member.
- Added the focused `check:lock-switch` guard plus existing identity, Settings,
  POS, TypeScript, and production build verification. No database/schema,
  native code, plugin, dependency, or new application state layer was added.
  Exact next action is the full physical SM-X115 handoff matrix.

### 2026-08-24 — LOCK-01 activated with approved cart handoff

- The owner confirmed that staff switching preserves an unfinished cart even
  though the workflow should be rare. The app must show a short confirmation;
  it never silently discards the order. The staff member who completes checkout
  remains the saved cashier.
- Graphify, the full applicable DOX chain, plan, Goal 06 contract, ledger, and
  lock/session/cart authorities were read before application inspection.
  Official Android guidance treats an in-progress cart as transient UI state
  for normal navigation and recommends keeping state above individual screens;
  Capacitor requires native code only for actual platform capabilities.
- Reuse the existing App-owned cart and lock implementation. Add one shared
  role-safe entry point through Header, retain protected offline credentials,
  and avoid new navigation, persistence, plugin, native code, or state library.
  Exact next action is complete caller/invariant inspection.

### 2026-08-24 — CATALOG-01 complete on origin/main

- `CATALOG-01: add offline category artwork` is pushed directly to
  `origin/main` as `43c9e4a3ed169ae7a07344f9587a51f65051e203`; local `main` and
  the remote resolved to the same SHA before this completion record.
- CATALOG-01 is done with its gallery, schema 17, local/cloud/fallback,
  migration, physical offline/restart/reconnect/cleanup, mandatory cache/
  favicon/cloud-lifecycle bug fixes, full regression, repeated Android beta,
  exact viewport, clean console/runtime, Graphify, authority, and DOX evidence.
  No card is active. LOCK-01 is next only after the owner confirms what happens
  to an unfinished cart when staff switch.

### 2026-08-24 — CATALOG-01 physical workflow and mandatory bugs complete

- Installed the checked 140-task beta over the real schema-16 database after an
  app-private backup. Schema 17 applied without clearing 11 sales and mapped
  Coffee/Tea/Cold/Bakery to their intended artwork keys; the temporary backup
  was removed only after migration and workflow proof passed.
- In flight mode, created `Seasonal-QA` with the neutral default, then selected
  Snacks & sweets. Both local-first operations survived restart, rendered in
  POS, synchronized in order to one cloud revision-2 category, and stayed
  duplicate-free on another reconnect. Archived only the QA cloud category and
  confirmed the four real categories/keys remained active with no category
  outbox row.
- The first physical POS showed neutral art on every card despite correct SQL.
  Root cause was a cache mapping typo that placed `artworkKey` on modifier
  options; made category artwork required in the TypeScript cache contract and
  added an exact mapper regression. A missing favicon and offline/hidden Convex
  retry loop were also reproduced from WebView logs. Added an explicit data
  favicon, promoted foreground visibility into the shared Android connection
  context, retired the cloud client on immediate offline hints, and gated every
  direct Lock/Orders/Dashboard/Reports/reconnect caller. Live CDP proof across
  screen off/resume and airplane loss/recovery reports zero warnings/errors,
  visible state, and exact 1340 by 800 bounds.
- Focused/full local, catalog, Orders, offline, reconnect, identity, permission,
  management, TypeScript, Convex deployment, production build, Android sync,
  and repeated 140-task beta checks pass. Graphify, authorities, DOX, final
  regression, live WebView console, exact viewport, and Android runtime checks
  now pass. Exact next action is the implementation commit and push.

### 2026-08-24 — CATALOG-01 gallery and data path implemented

- Reused the three versioned line-art sources for coffee, tea, and snacks; used
  built-in image generation for neutral botanical, iced citrus drink, and
  croissant/wheat artwork. Two initial outputs contained baked checkerboards;
  rejected them and edited the backgrounds to real alpha before repository use.
  All six final images were normalized to Operational Green and lossless 320 px
  WebP, totaling about 142 KB instead of adding six 1,200 px PNGs to the APK.
- Added one shared registry/fallback and one compact six-choice picker inside
  the existing category dialog. Artwork stays decorative and selectable; names
  never choose or change it automatically.
- Added SQLite migration 17 and propagated `artworkKey` through local save,
  PIN-free management payload, reconnect, Convex validation/storage/seed,
  bounded snapshot, Products, and POS. Focused migration, custom fallback,
  invalid key, asset size, local transaction, cloud retry/update, permission,
  TypeScript, deployment, and production-build checks pass. Exact next action
  is checked Android packaging and the real flight-mode/restart/reconnect UI
  proof on the SM-X115.

### 2026-08-24 — CATALOG-01 activated with bundled-asset decision

- Activated only CATALOG-01 after the owner's instruction; LOCK-01 and all later
  cards remain pending. Queried the refreshed Graphify graph, reread the full
  applicable DOX chain, plan, Goal 06 contract, ledger, and product/design/brand
  category-art authorities before application inspection.
- Android's current APK guidance favors fewer, smaller image resources and
  documents density-aware WebView graphics. Capacitor remains web-first and
  copies the built web bundle into Android, so the correct native decision is
  no native implementation: ship a small, optimized gallery through Vite and
  the existing checked Capacitor sync/build path.
- Category names and artwork remain independent. The data layer will persist a
  validated gallery key, while one bundled neutral illustration handles every
  absent, corrupt, or future key offline. Exact next action is end-to-end caller,
  schema, migration, payload, and asset inspection before implementation.

### 2026-08-24 — STAFF-01 complete on origin/main

- `STAFF-01: add offline staff creation` is pushed directly to `origin/main` as
  `9754897f4be65ffca1b572140e44fc229cad948f`; local `main` and the remote
  resolved to the same SHA before this completion record.
- STAFF-01 is done with its protected-storage, local/cloud, authorization,
  exact-retry, browser, Android beta, flight-mode, app/tablet restart, role,
  cleanup, log, Graphify, and documentation evidence recorded above. No card is
  active. CATALOG-01 is the next pending card when the owner continues.

### 2026-08-24 — STAFF-01 physical matrix complete and ready to push

- Built and installed the checked 140-task Android beta without clearing the
  tablet. At 1340 by 800, Staff & access preserved Olaso Owner and Samira
  Barista, and the Add staff dialog fits with persistent labels and 44-pixel
  actions. Physical QA exposed a descendant CSS selector that displaced the
  dialog heading/close action; the root selector was narrowed to the direct page
  header and a regression check now protects the nested dialog.
- In Android flight mode, created one cashier `Offline-QA`. SQLite contained one
  active local profile and one owner-audited, PIN-free staff operation/outbox
  row; no raw PIN bytes existed in SQLite or protected SharedPreferences. The
  new cashier signed in immediately, survived force-stop/relaunch and tablet
  reboot, and retained cashier-only POS/Orders navigation.
- Owner-authenticated reconnect created one cloud profile/credential/session,
  acknowledged one operation, mapped and archived the temporary local ID,
  removed its protected material, and preserved cloud-profile offline access.
  A second reconnect left one cloud profile and zero staff outbox rows. Online
  and later offline PIN sign-in both passed. The temporary cloud profile was
  then archived; the final tablet shows only the two pre-existing active
  profiles and neither temporary protected key set remains.
- Capacitor/Android runtime failure count is zero and protected values never
  appeared in focused logs. Browser lock QA reports no warning/error. Graphify
  refreshed to 3,176 nodes and 7,370 edges. The separate native launch gap
  remains the already-planned HARD-02/HARD-03 work; STAFF-01 does not claim it.
  Exact next action is the implementation commit/push and SHA closeout record.

### 2026-08-24 — STAFF-01 implementation ready for physical verification

- Added the minimal owner Settings staff list/form with only name, role, PIN,
  PIN confirmation, Cancel, and Add staff. A valid offline save immediately
  creates an active local profile and a bounded owner-audited, PIN-free outbox
  operation; the profile can unlock this tablet before internet returns.
- Fixed a security flaw found in the first draft before device QA: reconnect no
  longer stores or reloads the raw PIN. One PBKDF2 salt/hash pair supports both
  protected offline verification and delayed cloud provisioning, while the
  retry-safe cloud action creates the staff credential and device session.
  Official Capacitor configuration now disables native/redirected logging so
  protected session/verifier plugin values cannot leak through debug logcat.
- Development Convex proof creates one profile across a duplicate retry,
  validates the returned device session and later PIN sign-in, and rejects
  manager/cashier provisioning. All focused local/security/regression checks
  and the production build pass; the browser lock surface is exactly 1340 by
  800 with no warning/error. Exact next action is Android build/install and the
  full physical offline/restart/reconnect proof on the SM-X115.

### 2026-08-24 — STAFF-01 started with protected-storage decision

- Activated only STAFF-01 after the owner's instruction. LOCAL-01 through
  LOCAL-03 remain done; CATALOG-01 and all later cards remain pending.
- Official Android guidance confirms the existing non-exportable Keystore AES-
  GCM key and profile-scoped encrypted values are the correct native boundary.
  The React/data layer owns validation, derived offline verification, PIN-free
  SQLite/outbox work, and owner-session reconnect orchestration.
- No new plugin, dependency, database, WorkManager job, StrongBox requirement,
  support recovery secret, or raw-PIN SQLite/outbox/log path is allowed. Exact
  next action: inspect all current call sites and implement the minimal complete
  offline create/restart/sign-in/reconnect flow.

### 2026-08-24 — LOCAL-03 complete and pushed

- `LOCAL-03: add local-first inventory and costs` is pushed directly to
  `origin/main` as `1105de62d8133448b7202dd67971ee83c56ced12`; local `main` and
  the remote resolved to the same SHA before this completion record.
- LOCAL-03 is done with its automated, cloud, APK, physical tablet, role,
  offline/restart/reconnect, exact-cloud, lifecycle, viewport, Graphify, and
  documentation evidence. STAFF-01 is next and remains pending.

### 2026-08-24 — LOCAL-03 ready for Graphify and commit

- SQLite schema 16 and separate local inventory/cost/report/sync boundaries now
  save ingredients, thresholds, priced purchases, count adjustments, expenses,
  expense corrections, and compensation locally with exact quantities and
  integer centimes. Finance dependencies are isolated from sale/operational
  dependencies; compensation/profitability stays owner-only.
- Focused local management/catalog/inventory-cost/migration/reconnect/offline,
  backend inventory/expense/staff/monthly-cost, permission, sales, Orders,
  Reports, Dashboard, management, identity, TypeScript, production build,
  Android static, JVM, sync, and 140-task beta checks pass. Expense correction
  retry is now idempotent and the missing-PIN harness fails before reseeding.
- Installed schema 15-to-16 over the real SM-X115 without clearing data. In
  flight mode the full Stock and Costs workflows saved immediately, survived
  force-stop/restart, synchronized in order after validated Wi-Fi returned, and
  remained single-effect after a second reconnect. Exact cloud proof found one
  archived QA ingredient (revision 4, 400 g, 800 centimes), one expense
  original/reversal/replacement trio, and one future owner compensation period.
  The seven historical failed sale rows remain visible and unchanged.
- Reproduced and fixed two Android defects under the mandatory bug rule. The
  pre-bridge error came from Capacitor's Cordova `pause` event, not the
  SecureSession callback; `OlasoWebView` now gates that direct event until
  `triggerEvent` exists. The fixed viewport now rejects focus/user zoom, so
  closing the keyboard keeps the full 1340 by 800 layout. Normal, screen-off,
  notification-shade, and search-focus/close evidence has clean focused logs.
- Exact next action: refresh Graphify, rerun final closeout checks, commit/push
  LOCAL-03 on `main`, record the full SHA, and leave STAFF-01 pending.

### 2026-08-24 — LOCAL-03 started with native local-first decision

- Activated only LOCAL-03 after the owner's instruction. LOCAL-01 and LOCAL-02
  remain done; STAFF-01 and every later card remain pending.
- Graphify and the complete applicable DOX/plan/ledger chain were read before
  manual inspection. Official Android guidance confirms a persisted local
  source of truth plus lazy queued writes for critical offline operations; the
  existing Capacitor SQLite explicit transaction is the selected native path.
- LOCAL-03 must preserve integer base-unit quantities, integer centimes,
  append-only stock/purchase/valuation history, recurring effective periods,
  owner-only compensation, immediate saved Stock/Reports state, and exactly-once
  reconnect. No Room, WorkManager, second database, state library, direct UI
  network mutation, or last-write-wins is added.
- Exact next action: inspect the existing ingredient/purchase/adjustment/
  expense/compensation callers and implement the smallest complete local
  operations and reconnect handlers. Any bug pauses the card until fixed and
  regression-proved.

### 2026-08-24 — Owner made root-cause bug fixing non-negotiable

- Added PLAN.md's mandatory bug rule. Any bug discovered or reproduced during
  work pauses the current card and overrides ordinary card order until its root
  cause is fixed, protected by the smallest regression check, and proved under
  the original conditions on the physical Galaxy Tab A9.
- A different record, alternate workflow, clean database, restart, hidden error,
  weakened validation, or later-card assignment cannot be used as completion
  evidence. If a safe fix cannot be completed, the card remains blocked with an
  exact evidence-backed next action.
- This is a documentation-only owner decision. LOCAL-02 remains complete, no
  card is active, and LOCAL-03 remains next subject to the mandatory bug gate.

### 2026-08-24 — LOCAL-02 complete on origin/main

- Committed the verified local-first category/product/modifier/recipe workflow,
  stale-cache and migration recovery fixes, bounded active-first reads, ordered
  reconnect mappings, dependent-sale translation, modifier overflow access,
  focused checks, Android evidence, authorities, and ledger in
  `1cfbf92fe6df3c8d6a8ee2065f60dafdad041d29` (`LOCAL-02: add local-first catalog management`).
- Pushed `main` directly to `origin/main`; the remote advanced from `d6f010e` to
  `1cfbf92fe6df3c8d6a8ee2065f60dafdad041d29`. LOCAL-02 is done and no later card
  was activated in that commit.
- Exact next action when the owner continues: research the official Android and
  Capacitor boundaries for LOCAL-03, then activate only LOCAL-03. Do not begin
  STAFF-01 or polish work.

### 2026-08-24 — LOCAL-02 closeout ready to commit

- Physical SM-X115 continuation created `Temperature QA 1308` with Hot/Cold
  options offline, assigned it to the synchronized QA product, and saved an
  immutable one-item recipe offline. The dependency chain was modifier group,
  product assignment, then recipe version. All survived force-close/restart;
  POS displayed the optional Temperature group and added Cold to the cart.
- Physical testing found and fixed three closeout defects: a fifth modifier
  group was rendered but unreachable because the editor sliced the list to
  four; acknowledging a cloud-owned edit attempted a duplicate identity
  mapping; and refresh inserted a cloud recipe before removing its mapped local
  temporary version. The final scrollable four-card geometry, identity-mapping
  skip, and pre-insert mapped-record cleanup all pass on the tablet.
- Reconnect produced one cloud group, two options, one product link, one recipe
  version, and one recipe item with zero management outbox rows. The QA product,
  group, and category were then archived through ordinary app actions and
  synchronized; the seven pre-existing historical sale outbox rows were not
  changed.
- Final checks pass: `check:local-management`, `check:local-catalog`,
  `check:local`, `check:reconnect`, `check:offline`, `check:pos`,
  `check:settings`, `check:sales`, `check:management`, `check:convex`,
  `npm run build`, `npx convex dev --once`, and the 140-task `android:beta`
  build. The final APK installed and cold-started offline at 1340 by 800, owner
  unlock succeeded through ADB, the clean four-category/15-product POS rendered,
  and the focused introduced-error scan was empty.
- `graphify . --update` could not perform mixed semantic extraction without an
  LLM key. `graphify update .` completed the supported deterministic code-only
  refresh, repeated after the final code fix: 2,984 nodes, 6,857 edges, and 147
  communities. Exact next action:
  commit/push LOCAL-02, then record the implementation SHA and mark it done.

### 2026-08-24 — LOCAL-02 stale catalog freeze fixed and physically proved

- The owner correctly rejected bypassing a stale Coffee category by choosing a
  fresh test category. Root cause: the reconnect worker required the entire
  outbox to be empty before refreshing the operational catalog, so seven older
  sale failures indefinitely kept an archived cloud category ID active in the
  tablet cache.
- Changed the boundary so only pending/failed `management.*` operations block a
  catalog refresh. Immutable pending/failed sales keep their receipt/product
  snapshots and stock deltas but no longer freeze categories, products,
  modifiers, or recipes. Active rows are also prioritized before archived rows
  in every bounded catalog read, so live offline records cannot fall beyond a
  limit filled by historical archived data.
- Focused management, reconnect, migration, and catalog checks pass; the test
  explicitly proves that a sale-only failed outbox does not count as pending
  management work. Production build, Android static/sync, and the 140-task beta
  build pass.
- Physical SM-X115 proof restored the stale pre-test database, retained seven
  sale outbox rows, refreshed Coffee from its old archived ID to the current
  active ID, and left zero management rows. `Offline Coffee 1302` was then
  created under Coffee with Wi-Fi/mobile data disabled, survived force-close
  and owner unlock, appeared as Coffee item 10 in POS, synchronized on reconnect
  to one cloud product/mapping/acknowledgement, and left zero product or
  management outbox rows. No category conflict recurred.
- The separate known HARD-03 pre-bridge `triggerEvent` bug produced one black
  launch during the lifecycle portion and remains assigned to HARD-03; an awake
  foreground relaunch completed this card's data proof. LOCAL-02 remains in
  progress. Exact next action: finish offline modifier and recipe physical
  creation/edit/restart/POS/reconnect proof, then close the card gate.

### 2026-08-24 — LOCAL-02 database-upgrade incident recovered and fixed

- An unfinished test APK failed to open SQLite because it rewrote published
  migration 14 and tried to create `categories_by_local_key` as a unique index
  over historical duplicate category keys. Android logcat recorded schema
  13-to-14 failure `UNIQUE constraint failed: categories.key`; this was caused
  by the in-progress change, not the protected PIN or existing application data.
- Preserved the 1,200,128-byte database and copied it to app-private
  `files/recovery-20260824-1235-olaso_posSQLite.db`. Installed a clean APK built
  from known-good commit `26ae027` with `adb install -r`; no uninstall or data
  clear occurred. The lock screen and saved POS catalog reopened successfully.
- Corrected the working source by restoring published migration 14 exactly and
  moving the new product/modifier-group columns to migration 15 without the
  unnecessary uniqueness rules. The migration check now includes an archived
  duplicate category-key fixture matching the physical failure.
- `npm run check:local`, `npm run check:local-catalog`, `npm run build`, Android
  static/sync/beta build, install-over-upgrade, and the real schema 13-to-15
  migration pass. The owner supplied the test PIN; ADB entered it without
  printing it to logs, the current POS reopened with saved products, and the
  focused final error scan was empty.
- LOCAL-02 remains in progress. Exact next action: complete its flight-mode
  create/edit/restart/reconnect/exactly-once physical workflow before Graphify,
  documentation, commit, and push. Do not activate LOCAL-03.

### 2026-08-24 — LOCAL-02 physical workflow prepared

- The complete current source passes local-management, local-catalog,
  migration/restart, reconnect, offline-view, POS, Settings, TypeScript,
  production-build, Convex deployment/typecheck, Android static/sync, and the
  140-task beta build. The final APK installed successfully on SM-X115 and cold
  started at the required Lock boundary.
- Automated code now covers atomic local category/product/status/modifier/
  recipe writes, parent-ordered catalog dispatch, local/cloud mappings,
  sale/correction dependencies, ID translation, local cost display, archived
  management records, and synchronized temporary-row cleanup.
- The owner later supplied the owner PIN explicitly, allowing ADB to enter it
  for the physical workflow. The PIN remains absent from source, Git, application
  logs, SQLite, and ledger evidence beyond this owner-provided test credential.
  The remaining work is flight-mode UI creation, force-close/restart
  persistence, POS visibility/sale dependency, reconnect, exactly-once cloud
  mapping, clean logs, Graphify, docs, commit, and push.
- LOCAL-02 remains the only active card; nothing is committed or claimed done.

### 2026-08-24 — LOCAL-02 local catalog implementation in progress

- Added atomic local category, product, status, modifier/option, archive, and
  recipe-version operations plus catalog reconnect dispatch against the existing
  retry-safe Convex mutations. Products now reads and saves through SQLite as
  the single screen source; TypeScript passes.
- This work is not yet accepted or committed. Remaining before LOCAL-02 can be
  done: attach pending catalog dependencies/mappings to sale payloads, add the
  complete focused catalog/reconnect checks, run build/browser/flight-mode/
  restart/reconnect/tablet evidence, refresh Graphify, and record pushed SHAs.
- LOCAL-02 remains the only active card. Do not activate LOCAL-03.

### 2026-08-24 — LOCAL-02 mapping/dependency checkpoint

- Tracing offline-created catalog use into checkout exposed that later sale
  synchronization must wait for and translate new product/recipe/option IDs;
  management UI synchronization alone would be incomplete.
- Added migration 14 local/cloud mapping rows and persisted modifier-option keys,
  then extended management acknowledgement/mapping resolution. Existing cloud
  IDs remain valid when no mapping exists. Focused local-management, migration/
  restart, and TypeScript checks pass.
- No Product screen write is claimed offline yet. Exact next action is atomic
  local category/product operations, followed by modifiers/recipes, sale
  dependencies, and reconnect dispatch. LOCAL-03 remains pending.

### 2026-08-24 — LOCAL-02 started with Android offline-catalog decision

- Activated only LOCAL-02 after the owner's instruction. LOCAL-01 remains done;
  every later card is pending.
- Official Android guidance confirms local-source-of-truth plus lazy writes for
  critical offline data. The existing native Capacitor SQLite transaction is
  selected for category/product/modifier/recipe rows and their operation/outbox;
  stable local IDs and parent dependencies preserve relationships.
- Rejected Room/another ORM or database, WorkManager under the locked-session
  policy, last-write-wins conflict loss, and direct Products UI-to-Convex writes.
  Existing revision validation remains the conflict boundary.
- Exact next action: replace current Products direct mutations with the minimum
  complete local domain operations and dependency-aware reconnect dispatch.

### 2026-08-24 — triggerEvent lifecycle bug made a HARD-03 completion blocker

- The owner challenged whether the previously mentioned pre-bridge error was
  actually fixed. Confirmed it remains in the current APK and corrected the plan
  so generic startup wording cannot let it be forgotten.
- Evidence points to SecureSession Android connectivity `notifyListeners()`
  running before Capacitor defines the JavaScript `triggerEvent` bridge. The
  explicit visible-state refresh recovers, so observed impact is one lost early
  event/console error rather than crash or data damage; production still rejects
  it.
- HARD-03 now requires official Android/Capacitor lifecycle research and clean
  physical normal cold, screen-off, notification-shade, background/foreground,
  and long-sleep/resume evidence without triggerEvent, duplicate listener,
  crash, or stale connection state. No code/card status changed.

### 2026-08-24 — LOCAL-01 complete on origin/main

- `LOCAL-01: add local-first management foundation` is pushed as
  `0c7da7d63c293c4d96b5c28d8425210c6f9cc8b8` on `origin/main`.
- SQLite schema 13, immutable management envelopes, role/secret validation,
  dependent outbox eligibility, acknowledgement mapping, safe failures, focused
  checks, Android research, final build/beta/install-over, physical migration/
  Lock smoke, and Graphify code refresh satisfy the card contract.
- LOCAL-02 is next but not active. It must begin with its own official Android/
  Capacitor research checkpoint; no catalog/recipe workflow is claimed offline
  yet.

### 2026-08-24 — LOCAL-01 implementation ready to commit

- SQLite migration 13 adds durable immutable management-operation rows and
  optional outbox dependencies without changing existing sale/stock data.
  Separate small data files own pure envelope/permission/secret validation and
  SQLite enqueue/list/acknowledge/failure persistence; domain business writes
  remain explicitly outside this foundation card.
- The focused check proves migration/restart survival, immutable retry IDs,
  manager/owner/cashier permission boundaries, protected-key rejection without
  false-positive ordinary fields, parent blocking/release, connection retry,
  cloud mapping, mismatched acknowledgement rejection, and missing-pair stops.
- Existing sale/correction synchronization filters its own outbox types, so
  future management entries cannot consume or starve the ten-sale batch.
- Local-management/local/reconnect/settings/offline/POS/TypeScript/build and
  Android beta checks pass. Cloud-integrated Orders/Sales checks require a
  six-digit development restore PIN that is intentionally absent; they stopped
  before data work and no secret was retrieved. No Convex sale code changed.
- The real SM-X115 accepted install-over migration 12-to-13 and retained its
  existing database and app identity; the fitted Lock screen opens on an awake
  cold launch with no fatal/uncaught/SQLite migration error. Graphify code
  refresh is 2,911 nodes/6,672 edges/150 communities.
- Exact next action: commit and push LOCAL-01, record its full SHA, then leave
  LOCAL-02 pending until the owner continues.

### 2026-08-24 — Android-native research required for every card

- The owner requires official Android-native research before every card. PLAN,
  Goal 06, and root DOX now require the applicable native options, selected
  boundary, rejected alternatives, and physical Galaxy Tab A9 proof before a
  card can finish.
- LOCAL-01 official research confirms the correct Android offline-first pattern:
  SQLite is the immediate source of truth, critical writes save locally first,
  and a durable queue synchronizes later. The existing Capacitor Community
  SQLite plugin already supplies native Android SQLite/transactions.
- Rejected Room because it would add a second database/source of truth. Deferred
  WorkManager because Olaso deliberately performs no staff-authorized cloud work
  while locked and does not require upload after process exit; the durable local
  data waits safely for the authenticated foreground reconnect worker.
- The already-running Android beta completed successfully with 140 tasks. Exact
  next action: verify install-over migration 13 and preserved tablet data, then
  finish LOCAL-01 regression/Graphify/ledger/commit/push.

### 2026-08-24 — Goal 06 LOCAL-01 started

- The owner said to start. Activated Goal 06 directly on `main` with LOCAL-01
  as the only in-progress card; all later functionality, hardening, polish, and
  acceptance cards remain pending.
- Graphify preflight traced the existing serialized local sale transaction,
  generic outbox rows, ReconnectProvider dispatch, operational cache, session
  permissions, and Convex management mutations. The root/source/data/Convex
  DOX, canonical plan, Goal 06, ledger, and authorities were reread before code.
- Scope remains the shared foundation only: durable management record/operation
  identity, local permission/audit, dependency order, acknowledgement mapping,
  bounded retry/failure state, ordered migration, and focused checks. Domain
  workflows begin only in LOCAL-02/LOCAL-03/STAFF-01.
- Exact next action: preserve the approved plan state, inspect every current
  caller, then implement LOCAL-01 without touching later cards.

### 2026-08-23 — Manual UI polish moved to the final change phase

- The owner requires the manual screen-by-screen critique and individually
  prompted UI polish to happen only after the application is fully functional.
  Reordered Goal 06 so LOCAL-01 through HARD-07 complete functionality,
  offline management, staff/lock/category workflows, reconnect proof,
  navigation/startup performance, recovery, updates, and readiness first.
- POLISH-01 and POLISH-02 now follow HARD-07. HARD-08 remains last because it
  performs final endurance and owner acceptance after the polish is finished.
- Confirmed `OFFLINE_RELIABILITY_PLAN.md` is complete, not abandoned: OFF-01
  through OFF-06 physically proved offline staff access, sales/corrections,
  connection truth, reconnect, exact-once sale upload, and saved screen reads.
  It never covered offline management writes; LOCAL-01 through LOCAL-04 now own
  that separate remaining requirement without rewriting historical evidence.
- No goal/card is active. Exact next action is LOCAL-01 when the owner says to
  begin; early manual polish is explicitly blocked by the revised order.

### 2026-08-23 — Offline management and smooth navigation added to Goal 06

- Corrected the prior online-only management assumption. The owner requires
  every authorized day-to-day café operation to save and remain usable without
  internet, survive app/tablet restart, and synchronize exactly once after
  reconnect. PRODUCT, ARCHITECTURE, PLAN, DESIGN, and Goal 06 now agree; current
  application code remains unchanged.
- Added LOCAL-01 through LOCAL-04 for the shared local management/outbox
  foundation, catalog/recipes, stock/costs, protected offline staff/PIN setup,
  and full flight-mode/restart/reconnect closeout.
- Added NAV-01 for React `Activity`-based visited-screen retention,
  saved-content-first background refresh, state/scroll preservation, hidden
  effect cleanup, lock isolation, and immediate resume clock correction.
  HARD-04 explicitly owns replacement of the current 1408 by 768 card artwork
  with measured right-sized assets. A loading GIF/fake delay and new cache/state
  framework remain excluded.
- Goal 06 remains planned with no active card. Exact next action remains the
  normal owner-led POLISH-01 screen review; implementation follows the revised
  order and cannot skip the new local-first/navigation cards.

### 2026-08-23 — Offline reliability closeout complete

- Completed OFF-01 through OFF-06 with physical SM-X115 evidence, including
  two-profile offline access, lockout isolation, native network state,
  exact-once reconnect, saved-data management/report screens, credential
  revision enforcement, final APK/build/checks, and clean application logs.
- The reliability work is closed. Goal 06 remains the next normal collaborative
  phase, beginning with the owner-led POS review and no autonomous `/goal`.

### 2026-08-23 — OFF-05 exact-once reconnect accepted

- Centralized all automatic and manual synchronization in one authenticated,
  bounded worker. Automatic reconnect retains business failures and retries
  only pending or known connection-failure work.
- The same SM-X115 proved one isolated offline sale synchronized once, updated
  Orders/menu state, and stayed single-effect across a second reconnect with
  clean logs. The temporary Android user was removed and owner data is intact.
- OFF-06 is now the only reliability card. Next: the final complete device,
  regression, documentation, commit, and push closeout.

### 2026-08-23 — OFF-04 shared connection truth accepted

- The installed tablet now has one Android-validated online/offline state for
  Lock, POS, and Settings, including live Wi-Fi changes and resume after sleep.
  Separate screen listeners were deleted and no state package or polling was
  added.
- OFF-05 is the only card in progress. Next: replace scattered sync attempts
  with one bounded worker that never duplicates local or cloud effects.

### 2026-08-23 — OFF-03 physical offline sale accepted

- Completed, corrected, and repeated the physical offline sale path without
  restoring Wi-Fi. The accepted receipt survives restart and remains pending
  with exact local receipt, stock, print, and audit identity evidence.
- Removed the fixed development cashier label from new sales and local Orders;
  the already-available signed-in staff name now owns the immutable receipt and
  stock audit. Focused sale/Orders/POS/printing checks, build, Android beta,
  install-over-data, offline restart, database comparison, and clean logs pass.
- OFF-04 is now the only reliability card in progress. Next: one truthful
  application-wide connection state, tested by changing Wi-Fi while Lock and
  POS remain open.

### 2026-08-23 — Recurring tablet scale moved to Android WebView

- The owner required primary-source research after the fourth intermittent
  oversized launch. Android's native wide-viewport overview mode now fits the
  fixed 1340-pixel page before load; React no longer measures or changes zoom.
- The checked beta is installed over existing SM-X115 data. Six cold launches,
  screen-off resume, and background memory-pressure resume preserve the fitted
  viewport with clean focused logs. OFF-03 remains the sole reliability card;
  Wi-Fi and the pre-sale database/outbox baseline remain unchanged.
- Exact next action: owner unlocks privately, then continue OFF-03's labeled
  offline sale and restart proof before restoring connectivity.

### 2026-08-23 — Extra branches removed; main-only workflow adopted

- Verified every non-main local and remote branch had zero commits absent from
  `main`, then deleted all seven local branches and all seven corresponding
  GitHub branches. `main` is the only remaining branch on both sides.
- Updated the operating instructions, delivery plan, and Goal 06 workflow so
  future work commits and pushes directly to `origin/main`. Historical branch
  names remain only as audit evidence of where old commits were first made.

### 2026-08-23 — Cashier lock and client update delivery journaled

- Recorded the cashier's inability to reach Lock application because Settings
  is owner-only. The approved future behavior is a shared role-safe Lock /
  Switch staff action; no application behavior changed now.
- Recorded the need to deliver signed fixes remotely after the tablet and
  printer are handed to the café. The private source repository cannot serve
  the APK directly without exposing a credential, so Goal 06 now carries the
  separate download-channel and guided Android installation decision.
- Reminder list now includes both items and must be returned with the earlier
  owner follow-ups whenever requested.

### 2026-08-22 — Goal 06 changed to normal owner-led collaboration

- Goal 06 will start from a normal handoff prompt rather than `/goal`.
- The owner and agent will review one screen at a time, beginning with POS
  unless the owner chooses otherwise.
- No card, implementation branch, or code change starts until the owner approves
  the current screen's decisions.

### 2026-08-22 — Production hardening confirmed as next goal

- Goal 05 remains the most recently completed goal.
- Production hardening is Goal 06 and remains inactive. The exact next step is
  the normal POLISH-01 owner review, not an implementation-card activation.

### 2026-08-22 — Goal 05 activated; POLICY-01 started

- Confirmed the completed Goal 04 branch and remote at
  `92cc41f882743fcab9a447ef98e865fc5d1f4a5b`, created and pushed
  `codex/goal-05-policy-identity-permissions` from that state, then
  fast-forwarded and pushed `main` to the same completed baseline.
- Queried the current Graphify map before resuming. It identifies the existing
  saved-receipt, Orders, and print-state boundaries that Goal 05 must retain.
- Marked POLICY-01 as the sole in-progress card. Awaiting the owner's explicit
  legal-receipt, tax, payment, language, receipt-numbering, service, stock,
  correction, role, login, and sensitive-data policy decisions; no behavior is
  being inferred or changed before those answers.

### 2026-08-22 — POLICY-01 receipt and payment inputs received

- Confirmed the existing approved Olaso logo remains on receipts. The owner
  does not want a tax line printed on receipts.
- Confirmed cash and card as the only supported payment methods, with split
  payments allowed. The staff application is French/English.
- The receipt number should be small and date-scoped; its exact visible format,
  reset rule, offline behavior, legal header, tax treatment, and receipt
  language remain explicitly undecided. POLICY-01 stays in progress.

### 2026-08-22 — POLICY-01 receipt, tax, and product-split clarification

- The temporary receipt header is the approved Olaso logo only. Address and
  phone details are deliberately deferred until the owner/client requests them.
- Tax is not calculated anywhere in the app. The selected staff-app language
  determines the receipt language.
- A split means sequential product-based checkout: the cashier selects a
  customer's products from one order, records that payment, and leaves all
  unpaid products visible for subsequent customers. It is not a split-tender
  flow.
- Confirmed receipt number format: `MMYY-0001`, for example `0826-0001`.
  Its number increments without duplication during the month and resets to
  `0001` in the following month.

### 2026-08-22 — POLICY-01 service, stock, and correction inputs received

- Removed online from scope. The café uses only take-away and dine-in service;
  the small number of tables does not change that service distinction.
- Each ingredient has an operator-selected low-stock threshold. Low stock is a
  daily staff warning/review workflow, not a sale-blocking rule.
- A completed sale is never deleted. A cancellation records its reason as an
  append-only correction. Card corrections record the business correction only;
  no card-terminal or bank reversal is attempted.
- Dine-in is a service label only: the café's two-table setup does not use a
  table selector. Customer details are not collected. Any cashier may cancel a
  completed sale with a reason.
- Cashiers can cancel while offline. A cancellation is whole-sale only and must
  occur on the same local business day; the cashier re-enters any replacement
  order. The correction remains append-only and reverses only the original
  saved effects, including its stock and cost snapshots.

### 2026-08-22 — POLICY-01 role hierarchy approved

- Roles are cumulative: manager includes all cashier abilities, and owner
  includes all manager and cashier abilities.
- Cashier: POS, product-based split checkout, reprint, same-day whole-sale
  correction, and low-stock warnings. Manager: cashier access plus products,
  stock, expenses, and operational sales reports. Owner: all manager/cashier
  access plus staff, identity recovery, profitability, and individual
  compensation. Sensitive owner-only data is never returned to lower roles.

### 2026-08-22 — POLICY-01 PIN and offline-session inputs received

- Every owner, manager, and cashier receives a separate six-digit PIN. A lock
  screen supports handoff to another staff member, and application/tablet
  restart always returns locked.
- Auto-lock defaults to five idle minutes and is owner-configurable in Settings.
  Five failed PIN attempts impose a five-minute local lockout.
- A registered staff PIN remains usable offline without a 24-hour reconnect
  deadline, including a multi-day outage. A remotely revoked worker therefore
  becomes blocked on the tablet's next successful synchronization; it cannot be
  revoked instantly while the tablet has no network.
- The owner accepts physical custody of the tablet as the first-release
  lost-device control and does not want a remote lost-device workflow. If an
  owner forgets a PIN, verified support resets the existing owner identity
  through the protected backend administration boundary; no temporary profile,
  plaintext PIN, or development authorization bypass is created.
### 2026-08-22 — POLICY-01 final approval

- The owner approved the remaining recommendations: visible `Dine-in` / `Sur
  place` labels, no customer/table fields, same-calendar-day corrections
  through 23:59 Africa/Casablanca, and the logo-only receipt header as an
  explicit temporary rule.
- Separate discounts and refunds remain unavailable rather than guessed. The
  confirmed supported correction is the cashier-authorized, offline,
  whole-sale cancellation with a required reason and no card/bank reversal.
- Updated PRODUCT, ARCHITECTURE, DESIGN, BRAND, PLAN, and Goal 05 ownership
  documents. POLICY-01 is ready for documentation validation and commit.

### 2026-08-22 — POLICY-01 complete; ID-01 started

- Committed `POLICY-01: record operating policy` as
  `eafe2d3e6603cbf5957c548b5e83473da05465df`, pushed it to
  `origin/codex/goal-05-policy-identity-permissions`, and verified the remote
  resolves to the same SHA. Documentation-only checks passed: `git diff --check`
  and all 32 local Markdown links.
- POLICY-01 is done. ID-01 is now the only card in progress; next, inspect the
  current staff/auth/terminal-lock boundaries and write the confirmed identity,
  offline-session, revocation, and recovery design before implementation.

### 2026-08-22 — ID-01 identity/session boundary designed

- Current inspection confirms the beta terminal lock is only a SQLite flag and
  existing Convex management/POS authorization has development overrides.
- Chose an opaque per-device server-session boundary with Android Keystore
  storage and protected local offline PIN verification. No raw PIN/token enters
  SQLite, React, logs, source control, or ordinary exports. Offline workers can
  continue through multi-day outages; revoked identity state arrives on next
  successful sync.
- Documented role/session enforcement, lock/switch/restart, five-minute
  monotonic idle and failed-attempt limits, audit identity, support recovery,
  and explicit shared-PIN/clock/database/physical-custody tradeoffs in
  ARCHITECTURE.md. ID-01 remains in progress pending documentation checks,
  commit, and push.

### 2026-08-22 — ID-01 complete; ID-02 started

- Committed `ID-01: define offline staff sessions` as
  `682f64d16f51a0276700eb16f2e6a4b9a07e3cc9`, pushed it to
  `origin/codex/goal-05-policy-identity-permissions`, and verified the remote
  resolves to the same SHA. `git diff --check` and all 32 local Markdown links
  passed.
- ID-01 is done. ID-02 is now the only card in progress. Next: inspect
  migrations, native protected-storage options, Convex function call sites, and
  existing focused checks before implementing the approved session boundary.

### 2026-08-22 — ID-02 protected-storage boundary started

- Added a minimal Android `SecureSession` Capacitor plugin backed by Android
  Keystore AES-GCM storage plus a TypeScript Android-only wrapper. It accepts
  bounded safe keys, stores encrypted values only, and is not yet wired to PIN
  or session flows; SQLite settings remain credential-free.
- Registered the plugin, added a native key-validation check, and updated the
  Android/data DOX contracts. Android static checks, TypeScript, production
  build, and Capacitor sync pass. The standalone Gradle beta build has started
  with the documented project-local Java 21/SDK paths but needs final completion
  evidence. Unrelated uncommitted planning-file changes were found in the
  shared workspace and are preserved outside this card.
- Exact next action: finish native beta evidence, then implement the approved
  credential/session schema and fail-closed Convex boundary without staging the
  unrelated planning files.

### 2026-08-22 — ID-02 credential/session foundation implemented

- Added Convex staff-identity, opaque hashed-session, and per-device failed-PIN
  tables, plus an ordered SQLite migration that keeps only non-secret identity
  revision state locally. The staff role vocabulary now accepts `cashier` while
  retaining `worker` only for legacy migration.
- Added a Web Crypto PBKDF2 sign-in action, five-failure server lockout, opaque
  256-bit session issuance, and a server-secret-gated support PIN reset that
  revokes existing sessions instead of creating a temporary privileged profile.
  The matching client helper stores its session and offline PIN verifier only
  through the Android Keystore bridge.
- Convex typecheck/deploy, TypeScript, local migration checks, and production
  build pass. Exact next action: wire sign-in/lock flow and session use into the
  application, then replace the remaining development authorization overrides.

### 2026-08-22 — ID-02 staff cache and lock flow added

- Extended the bounded operational snapshot/local cache with active staff IDs,
  display names, roles, revisions, and non-secret identity revisions only.
- The lock screen now selects a cached staff profile, accepts a six-digit PIN,
  creates/saves an opaque online session through Android Keystore, and verifies
  the previously provisioned staff PIN locally during an outage. It fails closed
  when no provisioned identity exists.
- Convex typecheck/deploy, local migration checks, TypeScript, and production
  build pass. Exact next action: add startup/idle locking, test the Android
  session path with provisioned credentials, and remove the remaining production
  authorization overrides.

### 2026-08-22 — ID-02 Convex provisioning/sign-in verified

- Configured a rotated server-only recovery code on the active development
  Convex deployment. Provisioned the existing owner identity and verified an
  opaque-session sign-in through the CLI without printing a PIN, recovery code,
  or session token. The support reset invalidates prior owner sessions.
- Exact next action: install the current build, exercise the native PIN flow,
  then remove production authorization overrides and complete the negative
  authorization checks before closing ID-02.

### 2026-08-22 — Deferred owner polish recorded

- Added final-hardening cards for the owner's complete app-wide critique and
  the exact simplification pass that follows it; no screen was changed early.
- Recorded current Settings copy/icons/technical detail as review candidates
  while preserving required printer setup, validation, and recovery behavior.
- Added a bundled category-art gallery plus neutral fallback, compact app-icon
  approval, and optional measured startup motion. GIF, video, vector/CSS, and
  animated-image delivery remain candidates until physical startup evidence.
- Updated PLAN, Goal 06, PRODUCT, ARCHITECTURE, DESIGN, and BRAND only. Goal 05
  remains the exact next implementation goal.

### 2026-08-22 — Goal 04 activated; COST-01 started

- Created and pushed `codex/goal-04-costs-profitability` from clean synchronized
  `main` before making branch changes.
- Read the governing authorities and Goal 04 plan, queried the existing
  Graphify map, and marked COST-01 as the only card in progress.
- Next: read the applicable source and Convex DOX chain, then implement the
  cost foundation only.

### 2026-08-22 — COST-01 foundation implemented; Android gate blocked

- Added integer-centime BigInt allocation, valuation receive/consume,
  incomplete-cost propagation, margin, and monthly-recurrence primitives with
  the ten-carton milk fixture (`10,000 ml`, `20,000` centimes).
- Added ordered SQLite version-6 migration fields/tables/indexes and matching
  Convex cost, purchase, staff, compensation, and expense shapes/indexes.
  Existing local/unknown ingredient values migrate as explicitly incomplete.
- Extended deterministic development fixtures with complete valuation cases and
  an intentionally incomplete brioche case; focused cost/local/inventory/
  Convex/TypeScript/production-build checks pass and the Convex development
  deployment was updated.
- `npm run android:sync` passed, but `npm run android:beta` cannot invoke Gradle:
  no Java 21/JAVA_HOME is available. `adb` is also absent, preventing APK
  installation and required physical smoke/logcat evidence. COST-01 remains the
  only card in progress and is intentionally uncommitted/unpushed.
- Graphify refreshed after the structural change (2,441 nodes, 5,603 edges).
- Next: restore Java 21 and Android platform tools, complete the Android/Tablet
  gate, then record SHA/remote branch and advance to COST-02.

### 2026-08-22 — COST-01 Android/tablet gate passed

- Located the existing project-local toolchain at
  `tmp/android-toolchain`: Temurin OpenJDK `21.0.11+10`, Android SDK platform
  tools, and a connected Samsung SM-X115 (`R8YX91AKWXJ`).
- `npm run android:beta` passed all 140 Gradle tasks after Android sync; the
  debug APK installed successfully over the existing app.
- On the unlocked physical tablet, a cold app launch filled the exact 1340 ×
  800 activity and the Stock workspace rendered its inventory/detail panels
  without clipping or overflow. Focused post-launch and Stock logcat filtering
  found no Capacitor-console errors, uncaught exceptions, or crash records.
- COST-01 is ready for the required implementation commit and push; it remains
  the only card in progress until that SHA is recorded.

### 2026-08-22 — COST-01 complete; COST-02 started

- Committed `COST-01: add exact cost foundation` as
  `9750fbc299f9b9b1770fd021352a3708b29dd7ba`, pushed it to
  `origin/codex/goal-04-costs-profitability`, and verified the remote resolves
  to the same full SHA.
- COST-01 is done only after focused checks, production build, Android sync and
  beta build, physical SM-X115 install/Stock smoke, clean relevant logcat, and
  Graphify evidence passed.
- COST-02 is now the only card in progress. Next: inspect the established
  inventory mutation/history ownership and implement package receiving with
  append-only weighted-average valuation.

### 2026-08-22 — COST-02 implementation and verification complete

- Added an owner/manager package-receipt mutation that records package count,
  base-unit quantity per package, integer-centime package price, date, optional
  supplier/note, purchase history, stock movement, and valuation as one
  idempotent mutation.
- Added append-only correction reversal/replacement history and deterministic
  current-carrying-value effects. A correction cannot reverse stock no longer on
  hand; a repeated request returns its original result without duplicate effects.
- Physical-count losses consume current carrying value; known count increases use
  the current average, while ordinary unpriced receives and unvalued increases
  remain explicitly incomplete instead of claiming zero cost.
- Focused verification proves ten one-litre cartons at 20 MAD add 10,000 ml and
  20,000 centimes, retries remain single-effect, correction history is appended,
  and count effects reconcile. Convex/type/build/Android beta pass; the current
  APK installed on SM-X115 and POS/Stock cold-launch smoke at 1340 × 800 is clean.
- Graphify refreshed to 2,451 nodes and 5,623 edges. COST-02 remains in progress
  only until its commit is pushed and the SHA is recorded.

### 2026-08-22 — COST-02 complete; COST-03 started

- Committed `COST-02: add package valuation receipts` as
  `6b2a0208254f03327cbb84aa6f5f9e36b4cdf018`, pushed it to
  `origin/codex/goal-04-costs-profitability`, and verified the remote resolves
  to the same full SHA.
- COST-03 is now the only card in progress. Next: inspect the Stock component and
  application-data chain, then connect package receiving and valuation history
  without adding a second inventory screen.

### 2026-08-22 — COST-03 Stock workflow implementation started

- Extended the bounded ingredient detail query with indexed recent purchases;
  the Stock data hook maps valuation fields and purchase records into plain
  feature contracts.
- Added one `PurchaseDialog` under the existing Stock feature and routed the
  existing receive action to its retry-safe package-receipt mutation. The
  existing adjustment action remains separate.
- The selected-item panel now states complete/incomplete cost status and shows
  inventory carrying value plus average cost when known. TypeScript,
  inventory, production build, and structural Graphify checks pass.
- Next: inspect the interaction at 1340 × 800 and on SM-X115, then complete the
  card verification/commit/push sequence.

### 2026-08-22 — COST-03 complete; COST-04 started

- Committed `COST-03: add stock purchase workflow` as
  `bfe73a67062e95de0127fe0ea42b0a981bb15314`, pushed it to
  `origin/codex/goal-04-costs-profitability`, and verified the remote resolves
  to the same full SHA.
- Browser 1340 × 800 and unlocked SM-X115 package-receipt tests confirmed
  package math, inventory value, average cost, distinct purchase history, and
  clean relevant console/logcat output.
- COST-04 is now the only card in progress. Next: calculate and present current
  active-recipe/product cost, gross profit, margin, and missing-cost ingredients.

### 2026-08-22 — COST-04 domain calculation started

- Added and deployed one bounded active-recipe cost query that reads the current
  carrying value only, allocates direct ingredient cost deterministically, and
  returns explicit incompleteness rather than zero for missing cost inputs.
- Modifier additions/substitutions are returned as separate exact-cost effects;
  Cappuccino verifies at 504 centimes direct cost with checked option effects.
- Next: map the query into the existing product-editor presentation and verify
  the complete/incomplete margin states at browser and tablet reference sizes.

### 2026-08-22 — COST-04 product-cost presentation implemented

- Mapped the bounded active-recipe cost query into the existing Products data
  hook and editor. The editor now presents selling price, direct ingredient
  cost, gross profit, margin, and an explicit missing-cost count.
- No compensation, rent, utilities, or arbitrary overhead is included in the
  per-product measure. TypeScript and production build pass; Graphify refreshed
  to 2,462 nodes and 5,639 edges.
- Next: browser/tablet verification of complete and incomplete product-cost
  states, then COST-04 commit/push closeout.

### 2026-08-22 — COST-04 complete; COST-05 started

- Committed `COST-04: add product cost margins` as
  `551856a3c3e35c057ca70d91e23667831a33c2a5`, pushed it to
  `origin/codex/goal-04-costs-profitability`, and verified the remote SHA.
- Browser and unlocked SM-X115 Products evidence confirms complete direct cost,
  gross profit, margin, and no layout/logcat regression.
- COST-05 is now the only card in progress. Next: inspect local sale transaction,
  sync payload, and cloud acceptance boundaries for immutable cost snapshots.

### 2026-08-22 — Goal 03 handoff audited

- Independently re-ran the focused printing, endurance, POS, local, sales,
  Orders, Settings, Android, receipt-lab, management, inventory, Dashboard,
  Reports, Convex, production-build, Android-beta, and dependency-audit checks;
  all pass when shared Convex mutation checks run sequentially.
- Confirmed the completed Goal 03 branch is clean and synchronized, corrected
  the stale active-goal wording, and fast-forwarded `main` to the completed
  handoff without changing application behavior.
- Goal 04 remains inactive. Its reviewed start prompt is the exact next action
  after explicit user activation.

### 2026-08-21 — PRINT-08 and Goal 03 complete

- Committed `PRINT-08: complete printing closeout` as
  `1c1a34706154b3e6b93e92f4a83f9cc1a10493d9`, pushed it, and confirmed the
  remote branch resolves to the same SHA.
- Marked PRINT-08 and Goal 03 done only after full automated/cloud/build/audit/
  endurance/browser/tablet/printer/database/Graphify/documentation evidence
  passed.
- Next work is Goal 04, which remains inactive until explicit user activation.

### 2026-08-21 — PRINT-08 ready to push

- Completed 20-sale/5-reprint restart/failure endurance with exact receipt,
  stock, outbox, and print-attempt reconciliation in a real temporary SQLite
  database, avoiding unnecessary paper volume while retaining the accepted
  physical checkout/reprint paths.
- Passed every focused local/cloud/native/build check sequentially where shared
  Convex mutation isolation required it. Audits report zero vulnerabilities.
- Final browser and installed-tablet POS/Orders/Settings geometry and logs are
  clean; accepted lab hashes, Graphify, authorities, and evidence are current.
- PRINT-08 is ready for commit/push and final clean-worktree audit.

### 2026-08-21 — PRINT-07 complete; PRINT-08 started

- Committed `PRINT-07: add safe receipt reprinting` as
  `5e93dd7858d693867a6ed7482131eb202e598a18`, pushed it, and confirmed the
  remote branch resolves to the same SHA.
- Marked PRINT-07 done after invariant/browser/APK/wrong-address/rapid-tap/app-
  restart/tablet-restart/log/recovery evidence passed.
- Marked PRINT-08 as the only card in progress. It owns final regression,
  endurance, documentation, and clean synchronized closeout.

### 2026-08-21 — PRINT-07 recovery QA complete

- Added local print state to Orders without allowing cloud history to overwrite
  it, plus one saved-snapshot Reprint action that never enters checkout logic.
- Wrong address, rapid repeated taps, app restart, tablet restart, endpoint
  correction, and successful recovery all preserve sale/item/stock/outbox
  counts exactly. Only print attempt state changed.
- Browser and physical 1340 by 800 Orders layouts fit three actions cleanly;
  logs remain free of new warning/error. One recovery write reused the accepted
  787-byte receipt stream without additional logo testing.

### 2026-08-21 — PRINT-06 complete; PRINT-07 started

- Committed `PRINT-06: print committed sales once` as
  `9602fed94f5d49f552527275c5c704a2e21c6906`, pushed it, and confirmed the
  remote branch resolves to the same SHA.
- Marked PRINT-06 done only after focused/build/APK/browser/tablet/offline/
  restart/sync/log/database/paper evidence passed.
- Marked PRINT-07 as the only card in progress. Reprint will reuse the saved
  snapshot and current settings without entering checkout logic.

### 2026-08-21 — PRINT-06 checkout and recovery QA complete

- Added schema version 5 print state and one background post-commit attempt.
  Fixed the prior post-commit menu-reload hazard so no refresh/print/sync error
  can make a committed sale appear unsaved or leave a duplicate-retry cart.
- Browser configuration failure and physical offline/restart/Wi-Fi recovery
  preserve exactly-once sale, item, movement, and outbox effects.
- One online checkout wrote a 787-byte receipt in 6 ms and produced the single
  expected paper. Restart preserved printed/failed attempts without another
  print.
- Corrected the Android 16 landscape evidence by targeting API 35 while
  compiling with API 36; a truly locked-portrait physical launch now forces the
  approved full landscape layout.

### 2026-08-21 — PRINT-05 complete; PRINT-06 started

- Committed `PRINT-05: add resident logo setup` as
  `eb00d2f92094c60adbd6cdc68e877f1a9e790959`, pushed it, and confirmed the
  remote branch resolves to the same SHA.
- Marked PRINT-05 done from the accepted exact-payload physical baseline plus
  current byte identity, APK, setup, restart, tablet, browser, and log evidence.
- Marked PRINT-06 as the only card in progress. No more logo-only output will
  be sent; this card owns post-commit first printing and persisted state.

### 2026-08-21 — Incorrect PRINT-05 pause corrected

- The user correctly rejected the repeated logo printing and the decision to
  pause while they were away. Six bare recalls were excessive; one current
  app-path confirmation was sufficient because the exact payload, orientation,
  and power-cycle persistence were already accepted in PRINT-01.
- Accepted existing physical baseline plus exact byte identity and current
  installed-app setup/recall/restart evidence. No further logo print will be
  sent. Goal 03 is active and PRINT-05 is ready for closeout.

### 2026-08-21 — PRINT-05 blocked at physical printer gate

- This pause was later found unnecessary: it failed to reuse the already
  accepted exact-payload power-cycle/orientation baseline and over-weighted new
  bare recall repetition. The user corrected it before any partial commit or
  later-card work occurred.

### 2026-08-21 — PRINT-05 software, restart, and orientation QA reached

- Bundled the accepted pre-rasterized logo unchanged as one Android raw asset;
  no image dependency or runtime rasterizer was added.
- Added a warning-gated Settings restore action. The real tablet wrote 2,441
  setup bytes and repeated the exact 16-byte recall after app, tablet, and
  printer network-module restarts while remaining honest about paper/storage.
- Diagnosed the user's repeat oversized layout as Android 16 API-36 large-screen
  orientation override, not a receipt change. Added the official compatibility
  opt-out and reapplied the existing scale after resize/orientation changes.
  Forced-portrait-system launch and three cold-start measurements now pass.
- Physical logo-slip inspection and a true printer power cycle remain before
  PRINT-05 can close.

### 2026-08-21 — PRINT-04 complete; PRINT-05 started

- Committed `PRINT-04: add deterministic receipt encoder` as
  `9c87c625a1f379e7307ec0c167b5002c0ec5e8dc`, pushed it, and confirmed the
  remote branch resolves to the same SHA.
- Marked PRINT-04 done only after focused/build/Android/browser/tablet/log/
  Graphify checks and the user's exact paper comparison passed.
- Marked PRINT-05 as the only card in progress. Normal receipts remain a short
  resident-logo recall; this card owns only deliberate setup/restoration.

### 2026-08-21 — PRINT-04 closeout checks complete

- Re-ran receipt golden, sale, Orders, POS, local database, Settings,
  TypeScript, production-build, Android identity/sync/native-test/assembly, and
  whitespace checks successfully.
- Installed and cold-launched the rebuilt APK on the connected Galaxy Tab. The
  1340 by 800 POS still fills the screen, and the Orders receipt preview shows
  the saved cashier without clipping or internal overflow.
- Browser logs and application-generated tablet logs remain clean; Graphify
  refreshed to 2,335 nodes and 5,332 edges. PRINT-04 is ready to commit/push.

### 2026-08-21 — Application receipt paper accepted

- The user confirmed the 941-byte TypeScript-encoder receipt matches the
  previously accepted receipt perfectly on the WD8260.
- Clarified that this physical test validated a new production encoder without
  receiptline, rather than repeating the already-proven laboratory generator.
- Frozen SHA-256
  `8C8C109B9A4F884D44819A55099C7D88FA7B005927FD5BB4767734E79EF6B1AE`
  as the paper-approved application golden and strengthened no-raster/no-QR
  byte sequence checks.

### 2026-08-21 — PRINT-04 model and encoder reached paper QA

- Traced the immutable local/cloud snapshot and added only optional cashier
  preservation required by the receipt; no current menu/recipe lookup or
  checkout print call was introduced.
- Implemented pure validation/modeling plus deterministic WD8260 encoding with
  saved centimes, fixed café timezone, CP858, wrapping, exact columns, four
  separators, resident-logo recall, emphasis, footer, and partial cut.
- Added `check:printing` covering snapshot/totals/payment validation, maximum
  identifiers, optional context, long line/modifier wrapping, quantity 100,
  large totals, CP858 accents, unsupported replacement, absent QR/raster logo,
  and final cut bytes. Sales/Orders/TypeScript checks remain green.
- Matched the accepted baseline text columns and sent the 941-byte application
  stream from the physical tablet to TCP 9100; exit 0. Awaiting paper comparison
  before freezing its SHA as the reviewed application golden.

### 2026-08-21 — PRINT-03 complete; PRINT-04 started

- Committed `PRINT-03: add LAN printer settings test` as
  `c41e29c75c1a340519c6d217e220ed7f84723f76`, pushed it, and confirmed the
  remote branch resolves to the same SHA.
- Marked PRINT-03 done only after native unit/build, browser/tablet geometry,
  Settings persistence, first and recovery paper, restart, wrong-address,
  clean expected-failure/success console/logcat, Graphify, and documentation
  evidence passed.
- Marked PRINT-04 as the only card in progress. Checkout printing and print
  state remain untouched until the independent model/encoder is proven.

### 2026-08-21 — PRINT-03 physical QA complete

- The user confirmed paper after correcting the endpoint from `.101` to `.100`.
- Force-stopped and relaunched the final synced APK; the corrected endpoint and
  port remain persisted, and the Settings panel still fills the physical tablet
  without clipping or overflow.
- Final Graphify refresh reached 2,295 nodes/5,269 edges. Focused Settings,
  Android, native JVM, TypeScript, production build, checked beta assembly,
  browser, physical tablet, failure/recovery, clean console/logcat, and paper
  verification pass.
- PRINT-03 is ready for closeout review, commit, and push.

### 2026-08-21 — PRINT-03 physical native QA reached

- Synced, built, and installed the Kotlin-enabled APK after all 140 checked
  Gradle tasks passed.
- Entered the measured endpoint through the real tablet Settings UI. It
  persisted across force-stop/relaunch, and the first non-sale diagnostic
  returned 103 bytes/6 ms with honest paper-unconfirmed feedback; the user
  confirmed paper output.
- Wrong address `.101` returned a bounded connect timeout and clear operator
  message. The first implementation used a rejected native promise, which
  Capacitor logged as an expected console error; replaced expected failures
  with a resolved typed `ok:false` result and retained TypeScript error mapping.
- Rebuilt/resynced/reinstalled and re-ran the wrong-address path: UI feedback
  remained correct with no console/logcat warning/error. Correcting `.100`
  recovered to typed `ok:true`, 103 bytes in 6 ms, `paperConfirmed:false`.
- Awaiting the final recovery paper confirmation before Graphify/final checks
  and card commit/push.

### 2026-08-21 — PRINT-03 native transport and Settings implemented

- Added the officially compatible Kotlin 2.3.21/AGP 8.13.2 compiler pair and
  kept the implementation on standard sockets with no printer SDK/dependency.
- Added one registered Capacitor plugin plus bounded native writer. It validates
  IPv4/port/base64/timeouts/payload size, times connect/write, maps observable
  failure stages, and always returns `paperConfirmed: false`.
- Added pure JVM tests proving exact socket bytes and closed-endpoint mapping;
  the checked beta workflow now runs unit tests before APK assembly.
- Persisted validated printer IPv4/port through existing generic
  `device_settings`; no schema migration was needed. Added an Android-only
  non-sale Test printer action and actionable error copy.
- Browser QA at 1340 by 800 passed layout, touch-target, persistence,
  empty/invalid and Android-only states, overflow, and console checks.
- Checkout, saved receipts, logo provisioning, and order reprint remain outside
  PRINT-03. Exact next action is physical APK/native test and recovery QA.

### 2026-08-21 — PRINT-02 complete; PRINT-03 started

- Committed `PRINT-02: prove LAN printer endpoint` as
  `5cb5da399900f6d2aca22bd4ecd341844884d78c`, pushed it, and confirmed the
  remote branch resolves to the same SHA.
- Marked PRINT-02 done with the actual shared-router power-cycle limitation
  explicit and no home-lab address hardcoded into tooling or application code.
- Marked PRINT-03 as the only card in progress. Next action is complete
  ownership/caller inspection before adding the minimal native transport and
  Settings test action.

### 2026-08-21 — PRINT-02 closeout checks complete

- Re-ran the versioned receipt and LAN probe checks; all golden bytes,
  validation, connection-failure, and honest-result assertions pass.
- `npm run android:beta` passed Android identity, production build, Capacitor
  sync, and all 126 Gradle tasks using the existing Java 21/SDK 36 toolchain.
- Reinstalled the current APK on the connected SM-X115, cold-launched it at
  1340 by 800 landscape bounds, and found no WebView console warning/error.
- Browser regression reports viewport/body/document exactly 1340 by 800 and no
  warning/error logs. Graphify refreshed to 2,228 nodes and 5,128 edges;
  whitespace checks pass.
- PRINT-02 is ready for card commit/push. The shared-router reboot limitation
  remains explicit and is not represented as tested.

### 2026-08-21 — PRINT-02 physical path accepted

- The user confirmed paper after tablet Wi-Fi restoration, accepting client
  network-loss and recovery behavior.
- Recorded `192.168.11.100` as home-lab evidence, not a permanent production
  default. The client/router administrator owns reserving/excluding the chosen
  café printer address from DHCP and later router changes.
- Actual shared-router power-off remains explicitly untested because the user
  could not disrupt the connected household. Accepted separate printer cable
  loss and tablet Wi-Fi loss/recovery as the non-disruptive network-path proof.
- PRINT-02 remains in progress only until final checks, commit/push, and SHA
  recording complete.

### 2026-08-21 — Tablet network outage and recovery measured

- The user could not power-cycle the shared household router without disrupting
  everyone. Stopped the local router monitor and did not alter router state.
- Disabled Wi-Fi only on the physical Galaxy Tab. The local route disappeared,
  ping failed, and Android netcat returned `Network is unreachable`, exit 1.
- Re-enabled Wi-Fi; the tablet regained `192.168.11.225/24` in 2,293 ms, and
  printer ping plus TCP 9100 recovered with exit 0.
- Sent the same labeled tablet diagnostic after recovery; socket exit 0 and the
  temporary device file was removed. Paper confirmation is pending.
- This client-side outage plus the accepted printer Ethernet cable-loss cycle
  covers both sides of network-path interruption. Actual router power-off is
  explicitly untested due the user's household constraint.

### 2026-08-21 — Ethernet reconnect paper confirmed

- The user confirmed the post-reconnect `OLASO LAN TABLET TEST` paper printed.
- Accepted Ethernet cable loss, bounded failure, cable restore, socket recovery,
  and physical paper without restarting or reconfiguring the tablet/printer.
- Prepared an ignored ten-minute local ping/TCP monitor for the remaining
  router power-loss test so evidence survives the temporary Wi-Fi outage.

### 2026-08-21 — Ethernet link recovered

- The user reconnected the printer cable, resuming Goal 03.
- Measured ping, TCP 9100, and correct-MAC neighbor recovery without restarting
  the tablet or changing printer settings.
- Sent the labeled 122-byte diagnostic directly from the tablet using the
  verified close-after-EOF path; exit 0 in 135 ms. Awaiting paper confirmation.

### 2026-08-21 — PRINT-02 paused for Ethernet reconnection

- Ethernet link-loss behavior is measured and recorded, but the printer cable
  remained disconnected across the user-triggered test turn and two automatic
  continuations.
- TCP 9100 remains unreachable. PRINT-02 cannot prove reconnect/paper or proceed
  to router-off behavior until the physical cable is restored.
- Goal 03 is blocked without discarding the current worktree. Exact resume
  action: reconnect the printer Ethernet cable and report `cable in`.

### 2026-08-21 — Ethernet link-loss failure measured

- Detected the printer Ethernet link had been removed while both devices
  remained powered.
- Confirmed unreachable ping/neighbor state and a bounded 500 ms
  `CONNECT_TIMEOUT`, exit 1, with no false bytes-written or paper claim.
- Next action is cable reconnection, endpoint recovery timing, and one physical
  diagnostic print.

### 2026-08-21 — Printer restart paper confirmed

- The user confirmed the post-restart tablet LAN diagnostic printed on paper.
- Accepted the printer power-off, bounded failure, power-on, TCP reconnect, and
  physical paper recovery path.
- Next test isolates Ethernet cable loss while both devices remain powered.

### 2026-08-21 — Printer power-on recovery reached

- Detected the powered-on WD8260 without configuration change: ping returned
  and TCP 9100 reopened.
- The first Android netcat recovery write timed out only because it waited for
  the printer to close the socket. Toybox documentation confirmed `-q` is the
  close-after-EOF control; `-q 1 -w 2` then exited 0.
- Sent the same 122-byte labeled diagnostic from the tablet and removed the
  temporary device file. Awaiting user paper confirmation before router/link
  loss testing.

### 2026-08-21 — Printer-off failure measured

- The user powered off only the printer while leaving the router online.
- Confirmed ping loss, incomplete ARP neighbor state, and closed TCP path.
  Windows' default check took 21,127 ms; the product-oriented bounded probe
  stopped in 500 ms with `CONNECT_TIMEOUT`, exit 1, and no bytes-written claim.
- Resumed Goal 03 after the user's physical action. Next action is printer
  power-on, reconnect timing, and a labeled recovery print.

### 2026-08-21 — TCP 9100 paper confirmed

- The user confirmed physical paper output after the workstation golden receipt
  and direct-tablet diagnostic writes.
- Accepted `192.168.11.100:9100` as the measured WD8260 raw endpoint and the
  tablet-to-printer LAN path as proven.
- Printer-off/restart and router/link-off recovery remain before PRINT-02 is
  complete.

### 2026-08-21 — Router and tablet LAN path proven in software

- The user confirmed the self-test address and connected the WD8260 to the
  router. Direct device HTTP readback confirmed its MAC, static IP, mask,
  gateway, and disabled DHCP values.
- Measured successful workstation and tablet ping/TCP paths to
  `192.168.11.100:9100`; HTTP 80 is also reachable.
- Sent the exact accepted 1,814-byte receipt from the workstation LAN probe in
  6 ms total, while retaining honest `paperConfirmed: false` output.
- Pushed a 122-byte labeled diagnostic to the physical Galaxy Tab and sent it
  with Android's native `nc` directly to TCP 9100; the command exited 0 and the
  temporary tablet file was removed.
- Verified an unused wrong address and a wrong port each produce bounded
  connect timeouts with exit 1. Paper confirmation, printer-off/router-off
  recovery, and router address ownership remain before PRINT-02 closeout.

### 2026-08-21 — PRINT-02 paused for physical self-test

- Stored wired IP `192.168.11.100`, mask `255.255.255.0`, and gateway
  `192.168.11.1` were sent through USB without a software error, but the WD8260
  provides no trustworthy USB readback.
- The required power-cycle self-test values remained unanswered across the
  user-triggered configuration turn and two automatic continuations. Without
  that paper, the printer cannot safely be moved to the router or used to prove
  raw TCP 9100.
- Goal 03 is blocked without discarding the current PRINT-02 worktree. Exact
  resume action: provide the self-test IP/netmask/gateway/port (or a photo), then
  move the printer to the router and continue measured LAN tests.

### 2026-08-21 — Printer network values sent over USB

- The user corrected the physical workflow: retain USB locally, write the
  future Ethernet configuration, then disconnect and move the printer to the
  distant router. The vendor manual supports this stored configuration flow.
- Probed candidate `192.168.11.100`; no current ping, ARP neighbor, HTTP, or raw
  print service responded. Router reservation ownership remains open.
- Opened the existing vendor utility with USB and POS-80 selected, entered wired
  IP `192.168.11.100`, mask `255.255.255.0`, and gateway `192.168.11.1`, and
  pressed only the wired `Set above contents` action. No Wi-Fi fields were sent.
- The utility returned no error but provides no verified readback. Exact next
  hardware action: power-cycle with FEED held and inspect the self-test network
  values before moving the printer to the router.
- Added and passed the stdlib-only LAN probe check; it preserves all 1,814
  golden bytes, rejects invalid endpoints, records bounded timing, and never
  claims paper output from a socket write.

### 2026-08-21 — PRINT-02 network baseline measured

- Measured the connected Galaxy Tab A9 at `192.168.11.225/24`, the workstation
  at `192.168.11.222/24`, and the Orange router/gateway at `192.168.11.1`.
- Confirmed the printer's old `192.168.123.100` address is unreachable from the
  active network, as expected while Ethernet is not connected/configured.
- Located and read the existing WD8260 CD IP-configuration, TCP/IP-port, and
  Printer Test V3.2 manuals. They document self-test, MAC-based cross-subnet
  search, IP/mask/gateway configuration, restart/self-test verification, and
  raw TCP 9100 as the expected port.
- Extracted the already-downloaded unsigned Printer Test V3.2.0.1 utility to
  ignored `tmp/`, recorded SHA-256
  `881BE70C2AF3C6CE1AA3148089D2F9DB4ADEBDE8CA44A38D805330A29DD53393`,
  and did not run or install it before the Ethernet cable is connected.
- Exact next action: the user connects the printer Ethernet jack to a router LAN
  port while leaving USB available; then run MAC search, choose a collision-safe
  router-owned address, save/restart, self-test, and prove TCP with real paper.

### 2026-08-21 — PRINT-01 complete; PRINT-02 started

- Final receipt-lab, Android, production-build, Graphify, golden-hash,
  whitespace, staged-scope, forbidden-artifact, and local-queue checks passed.
- Committed `PRINT-01: preserve receipt baseline` as
  `a1bca7fc2df4c0f2b718e7bf46956a2301ee75ea`, pushed it, and confirmed the
  remote branch resolves to the same SHA.
- Marked PRINT-01 done only after the user confirmed both the corrected physical
  tablet layout and accepted USB paper receipt.
- Marked PRINT-02 as the only card in progress. No LAN port or permanent
  printer address is assumed; physical Ethernet/router setup comes first.

### 2026-08-21 — PRINT-01 physical confirmation received

- The user confirmed the installed corrected APK now fits the Galaxy Tab A9 as
  intended with no horizontal or vertical scrolling.
- The user confirmed the USB-printed receipt matches the accepted paper
  baseline, including the resident OLASO logo, layout, separators, MAD heading,
  bilingual footer, and partial cut.
- Restored Goal 03 to active. PRINT-01 remains in progress only until its final
  checks, commit, push, and SHA recording complete.

### 2026-08-21 — PRINT-01 paused for physical confirmation

- Automated receipt, golden-byte, build, browser, Graphify, Android, live
  WebView, repeated cold-start, USB spooler, and external-lab integrity evidence
  is complete.
- The card contract still requires inspection of actual paper. The same request
  for confirmation remained unanswered across three consecutive goal turns;
  starting PRINT-02 or committing PRINT-01 would violate the sequential card
  and physical-evidence gates.
- Goal 03 is blocked without discarding the current worktree. Exact resume
  action: the user confirms whether the installed app fills the tablet without
  scrolling and whether the printed receipt preserves the resident logo, four
  separators, one MAD heading, bilingual footer, and partial cut.

### 2026-08-21 — Physical tablet viewport QA corrected

- Corrected the earlier false claim that the first ADB capture represented a
  passing tablet layout. The user observed the app visibly shrunken with a large
  empty area; activity bounds alone were not valid visual evidence.
- Traced the failure to `ANDROID-01` commit `00b04bfb`: native zoom read
  `window.outerWidth` once before landscape orientation reliably settled. The
  existing Android check explicitly enforced that fragile implementation.
- Rejected `innerWidth` after a physical intermediate build proved it exposes
  the fixed 1340-pixel meta viewport and causes an oversized, scrollable app.
- Queried the live WebView through its debugging boundary: settled values are
  outer/screen `1007 by 601`, inner meta viewport `1340 by 801`, and device pixel
  ratio `1.33125`.
- Replaced the race with the orientation-independent long CSS-screen edge,
  updated the focused Android regression check and authority/DOX wording, built
  and installed the APK, and verified zoom `0.751493` plus document
  `1007 by 602` on three consecutive cold starts with no scroll overflow or
  WebView console warning/error.
- Refreshed the structural Graphify graph and re-ran receipt-lab, Android, build,
  sync, Gradle, and whitespace checks successfully. PRINT-01 remains in progress
  pending the user's visible tablet and paper confirmation.

### 2026-08-21 — Goal 03 and PRINT-01 activated

- Reconstructed the project from the complete DOX, ledger, plan, authority,
  completed Goal 01/02, Goal 03, and existing Graphify evidence before edits.
- Confirmed a clean synchronized `main`, inspected the external receipt lab
  without modifying it, recorded SHA-256 baselines, found both USB printer
  queues available, and confirmed the physical Galaxy Tab A9 is connected.
- Activated Goal 03 with only PRINT-01 in progress. No application, Android,
  checkout, printer-transport, or external-lab behavior changed.
- Preserved the accepted lab in isolated version-controlled tooling with exact
  receiptline/sharp/imagetracer versions, black logo inputs, USB RAW sender,
  resident-logo generator, and five reviewed golden fixtures.
- `npm run check:receipt-lab` regenerated all accepted binary/text fixtures
  byte-for-byte; the nested audit found zero vulnerabilities and no local queue
  name is versioned.
- `npm run android:beta` passed after supplying the existing project-local Java
  21/SDK 36 paths. All 126 Gradle tasks passed, the APK installed on the
  connected SM-X115, and the awake cold launch used a 1340 by 800 landscape
  activity with no WebView console warning/error introduced by the card.
- Browser QA at 1340 by 800 found exact body/document bounds, no overflow, and
  no warning/error console entries. `graphify update .` refreshed the code
  graph to 2,190 nodes and 5,090 edges; the mixed semantic command remains
  unavailable without an external model key.
- Sent the exact 1,814-byte accepted receipt through the available USB queue.
  The external lab hashes remain unchanged. PRINT-01 awaits only visual paper
  confirmation before commit and push.

### 2026-08-21 — Canonical production plan established

- Replaced the competing delivery-order notes with one root PLAN.md containing
  every remaining goal/card and one physical-device completion gate.
- Made production Android LAN ESC/POS printing Goal 03, kept the approved cost
  system as Goal 04, grouped business policy/identity/permissions into Goal 05,
  and moved measured startup work into the final Goal 06 hardening pass.
- Inspected the actual standalone receipt lab and preserved its accepted 48
  column CP858 layout, normal separators, bilingual footer, absent QR/example
  URL, partial cut, and power-cycle-surviving resident logo as Goal 03 inputs.
- Added the user's requirement that every implementation card be tested on the
  connected physical Galaxy Tab rather than waiting for final goal closeout.
- Created a 720 by 196 true-RGBA Operational Green wordmark derivative for the
  later cream startup surface. Pixel validation confirmed alpha 0 through 255,
  a single visible RGB value of 0/106/43, preserved source proportions, and
  SHA-256 `78D9AA90AFE0124D8BBCA298B9CC994A82FE05820116D4A0B00F5DF4154F120B`.
- Queried the existing Graphify graph before inspection. An incremental refresh
  after the documentation renames was attempted but the installed CLI requires
  an external semantic-extraction API key for this mixed code/document/image
  corpus; no structural application code changed, so the existing graph was
  retained and the new PLAN.md remains an explicit mandatory read.
- Verified every local Markdown link, removed stale goal references, passed
  `git diff --check`, and passed `npm run build`. The build retained its known
  jeep-sqlite browser-externalization and large-initial-chunk warnings; this
  planning/asset change added no application import or runtime behavior.
- No React, data, Convex, or Android application behavior changed and no goal
  was activated.

### 2026-08-25 — HARD-06 signed release and upgrade

- Official Android PackageInstaller + app-signing research: durable upload
  keystore in secrets; same application ID and cert for upgrades; HTTPS
  APK+manifest without embedding GitHub credentials; operator Update with
  user confirmation; rollback by rebuilding known-good with a higher
  versionCode.
- Implemented release signing env, GitHub Actions workflow, AppUpdatePlugin,
  Settings About Check/Update/Later, custody docs, check:release, version
  4 / 0.1.0-rc.2.
- Physical Tab A9: signed v3 install then v4 install-over-upgrade kept
  firstInstallTime and signing digest; lastUpdateTime advanced.
- Follow-up `f1f3168c927fae74c47d4d9353e556b7f8fe4870`: shop versions 1.0/1.1,
  About without versionCode, public `olaso-pos-releases` channel with
  private/no-update UX, Tab A9 Settings→Update 1.0→1.1 proven, Install
  unknown apps once, release debuggable for adb WebView QA.
- Remaining owner ops: production keystore CI secrets, Android developer
  verification registration.

### 2026-08-25 — HARD-07 readiness review started

- Owner authorized push of HARD-06 follow-up then HARD-07. Exact next action:
  secrets/overrides/unbounded reads/index/permission/privacy/deps/Android/
  logs/support review with required checks and tablet smoke.

### 2026-08-25 — HARD-07 readiness review complete

- Research: Android production release should not be debuggable; Keystore for
  credentials; no secrets in APK; PackageInstaller user confirmation already
  used. Keep existing Capacitor/SQLite/Keystore boundary; no Play Integrity.
- Fixed release `debuggable false`. Documented first-week monitoring in
  ARCHITECTURE.md. Accepted: unencrypted SQLite on owned tablet; sql.js pin;
  defer Cap/Convex patch bumps.
- Physical: non-DEBUGGABLE 1.1 APK; About `Version 1.1`; unlock + Settings OK.
- Exact next action after push: OPTIONS-01 when owner asks.

## Completed Goals

- [Goal 01 — Functional POS Interactions](goals/GOAL-01-FUNCTIONAL-POS.md)
- [Goal 02 — Functional Full Application Beta](goals/GOAL-02-FUNCTIONAL-APPLICATION-BETA.md)
- [Goal 03 — Production Checkout and Android LAN ESC/POS Printing](goals/GOAL-03-PRINTING-INTEGRATION.md)
