# Graph Report - Olaso  (2026-07-28)

## Corpus Check
- 88 files · ~507,549 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 665 nodes · 799 edges · 54 communities (43 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `268ed903`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]

## God Nodes (most connected - your core abstractions)
1. `Olaso POS Architecture` - 25 edges
2. `Olaso POS Product Specification` - 19 edges
3. `NavigationPage` - 16 edges
4. `compilerOptions` - 16 edges
5. `Olaso POS Design System` - 15 edges
6. `Task Contracts` - 14 edges
7. `compilerOptions` - 13 edges
8. `Journal` - 13 edges
9. `Olaso Brand Foundation` - 12 edges
10. `Cloud data model` - 11 edges

## Surprising Connections (you probably didn't know these)
- `DashboardScreenProps` --references--> `NavigationPage`  [EXTRACTED]
  src/features/dashboard/DashboardScreen.tsx → src/features/pos/components/TopNavigation/TopNavigation.tsx
- `OrdersScreenProps` --references--> `NavigationPage`  [EXTRACTED]
  src/features/orders/OrdersScreen.tsx → src/features/pos/components/TopNavigation/TopNavigation.tsx
- `PosScreenProps` --references--> `NavigationPage`  [EXTRACTED]
  src/features/pos/PosScreen.tsx → src/features/pos/components/TopNavigation/TopNavigation.tsx
- `HeaderProps` --references--> `NavigationPage`  [EXTRACTED]
  src/features/pos/components/Header/Header.tsx → src/features/pos/components/TopNavigation/TopNavigation.tsx
- `ProductsScreenProps` --references--> `NavigationPage`  [EXTRACTED]
  src/features/products/ProductsScreen.tsx → src/features/pos/components/TopNavigation/TopNavigation.tsx

## Import Cycles
- None detected.

## Communities (54 total, 11 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (55): CategoryCard(), CategoryCardProps, CategoryRow(), CategoryRowProps, categories, Category, CategoryId, americanoOrderImage (+47 more)

### Community 1 - "Community 1"
Cohesion: 0.11
Nodes (17): APK release and update, Backend ownership, Backup and recovery, Failure behavior, Frontend ownership, Initial index plan, Local-first checkout transaction, Locked decisions (+9 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (39): Adding products, Cashier, Completing a sale, Delivery phases, Distribution and updates, Exact deduction, Explicit non-goals for the first release, Low stock (+31 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (36): 2026-07-28 — Goal 01 started, 2026-07-28 — Goal 01 tasks established, 2026-07-28 — Ledger initialized, 2026-07-28 — POS-01 baseline and ownership complete, 2026-07-28 — POS-02 data and pure operations complete, 2026-07-28 — POS-03 menu discovery complete, 2026-07-28 — POS-04 cart and receipt complete, 2026-07-28 — POS-05 order details complete (+28 more)

### Community 4 - "Community 4"
Cohesion: 0.10
Nodes (27): DashboardScreen(), DashboardScreenProps, hourlySales, recentOrders, stockItems, Header(), HeaderProps, IconButton() (+19 more)

### Community 5 - "Community 5"
Cohesion: 0.06
Nodes (33): 10. Approval checklist, 11. Evidence and confidence, 1. Brand snapshot, 2. Brand character, 3. Logo system, 4. Color, 5. Typography, 6. Photography and content (+25 more)

### Community 6 - "Community 6"
Cohesion: 0.06
Nodes (35): 2026-07-28 — APP-00 complete, 2026-07-28 — APP-00 started, 2026-07-28 — APP-01 complete, 2026-07-28 — APP-01 started, 2026-07-28 — APP-02 started, 2026-07-28 — Goal 02 drafted, Active Goal, APP-00 — Baseline and branch (+27 more)

### Community 7 - "Community 7"
Cohesion: 0.07
Nodes (27): dependencies, @astryxdesign/core, convex, @fontsource/dm-sans, @phosphor-icons/react, react, react-dom, devDependencies (+19 more)

### Community 8 - "Community 8"
Cohesion: 0.09
Nodes (22): Accessibility and Operational Safety, Astryx and icon rules, Authority and Change Rules, Colors, Components, CSS ownership, Definition of Done, Do's and Don'ts (+14 more)

### Community 9 - "Community 9"
Cohesion: 0.15
Nodes (15): paymentMethods, reportKpis, salesBars, salesCategories, stockConsumed, topProducts, columns, ProductPerformanceTable() (+7 more)

### Community 10 - "Community 10"
Cohesion: 0.18
Nodes (14): linkedRecipes, StockIconName, stockItems, stockMovements, StockStatus, stockSummaries, StockDetailPanel(), stockLevels (+6 more)

### Community 11 - "Community 11"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib (+9 more)

### Community 12 - "Community 12"
Cohesion: 0.12
Nodes (15): compilerOptions, allowJs, allowSyntheticDefaultImports, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+7 more)

### Community 13 - "Community 13"
Cohesion: 0.19
Nodes (10): CategorySidebar(), icons, productCategories, productOptions, products, ProductCatalogPanel(), optionIcons, ProductEditorPanel() (+2 more)

### Community 14 - "Community 14"
Cohesion: 0.13
Nodes (13): activeStatus, baseUnit, modifierSnapshot, productStatus, receiptLine, recipeStatus, saleStatus, serviceMode (+5 more)

### Community 15 - "Community 15"
Cohesion: 0.14
Nodes (14): Brioche, Coffee, Croissants, Frappes, Hot coffee and V60, Hot drinks, Iced coffee, Iced hojicha and ube (+6 more)

### Community 16 - "Community 16"
Cohesion: 0.15
Nodes (12): Card commits and pushes, Child DOX Index, Closeout, Core Contract, DOX — Olaso POS, Graphify first, Implementation, Project Authorities (+4 more)

### Community 17 - "Community 17"
Cohesion: 0.19
Nodes (9): orders, selectedOrderItems, itemIcons, metadata, OrderDetailPanel(), filters, OrdersListPanel(), columns (+1 more)

### Community 18 - "Community 18"
Cohesion: 0.18
Nodes (11): `categories`, Cloud data model, `dailyMetrics`, Deferred tables, `ingredients`, `modifierGroups` and `modifierOptions`, `products`, `recipeVersions` and `recipeItems` (+3 more)

### Community 19 - "Community 19"
Cohesion: 0.22
Nodes (8): Current status, Documentation, Olaso POS, Planned work, Project structure, Run locally, Stack, Target hardware

### Community 20 - "Community 20"
Cohesion: 0.25
Nodes (7): Child DOX Index, Dashboard Feature DOX, Local Contracts, Ownership, Purpose, Verification, Work Guidance

### Community 21 - "Community 21"
Cohesion: 0.25
Nodes (7): Child DOX Index, Feature DOX, Local Contracts, Ownership, Purpose, Verification, Work Guidance

### Community 22 - "Community 22"
Cohesion: 0.25
Nodes (7): Child DOX Index, Local Contracts, Orders Feature DOX, Ownership, Purpose, Verification, Work Guidance

### Community 23 - "Community 23"
Cohesion: 0.25
Nodes (7): Child DOX Index, Local Contracts, Ownership, POS Feature DOX, Purpose, Verification, Work Guidance

### Community 24 - "Community 24"
Cohesion: 0.25
Nodes (7): Child DOX Index, Local Contracts, Ownership, Products Feature DOX, Purpose, Verification, Work Guidance

### Community 25 - "Community 25"
Cohesion: 0.25
Nodes (7): Child DOX Index, Local Contracts, Ownership, Purpose, Reports Feature DOX, Verification, Work Guidance

### Community 26 - "Community 26"
Cohesion: 0.25
Nodes (7): Child DOX Index, Local Contracts, Ownership, Purpose, Source Application DOX, Verification, Work Guidance

### Community 27 - "Community 27"
Cohesion: 0.25
Nodes (7): Child DOX Index, Local Contracts, Ownership, Purpose, Stock Feature DOX, Verification, Work Guidance

### Community 28 - "Community 28"
Cohesion: 0.29
Nodes (6): Child DOX Index, Convex Backend DOX, Local Contracts, Ownership, Purpose, Verification

### Community 29 - "Community 29"
Cohesion: 0.38
Nodes (4): AppDataProvider(), convexClient, OlasothemeTheme, App()

### Community 30 - "Community 30"
Cohesion: 0.29
Nodes (6): compilerOptions, composite, module, moduleResolution, skipLibCheck, include

### Community 31 - "Community 31"
Cohesion: 0.33
Nodes (5): ActionCtx, DatabaseReader, DatabaseWriter, MutationCtx, QueryCtx

### Community 37 - "Community 37"
Cohesion: 0.06
Nodes (23): categorySeeds, coffeeModifiers, DailyAccumulator, drinkModifiers, IngredientEffectSeed, ingredientSeeds, ModifierChoiceSeed, modifierGroupSeeds (+15 more)

### Community 39 - "Community 39"
Cohesion: 0.40
Nodes (5): APK, Convex, Responsibility of each platform, SQLite, Vercel

### Community 43 - "Community 43"
Cohesion: 0.40
Nodes (5): Create, CRUD behavior, Delete, Read, Update

### Community 44 - "Community 44"
Cohesion: 0.40
Nodes (5): Current scaling limit, Download synchronization, Idempotency, Outbox rule, Synchronization

### Community 50 - "Community 50"
Cohesion: 0.50
Nodes (4): Actions, Convex function rules, Mutations, Queries

### Community 51 - "Community 51"
Cohesion: 0.50
Nodes (4): Hardware tests, Persistence tests, Pure calculation tests, Testing strategy

### Community 52 - "Community 52"
Cohesion: 0.67
Nodes (3): Money, Money and quantity representation, Stock

### Community 53 - "Community 53"
Cohesion: 0.67
Nodes (3): Per-operation budget, Quota and performance budget, Required reviews

## Knowledge Gaps
- **420 isolated node(s):** `OlasothemeTheme`, `components`, `TableNames`, `Doc`, `Id` (+415 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `NavigationPage` connect `Community 4` to `Community 0`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Why does `Olaso POS Architecture` connect `Community 1` to `Community 39`, `Community 43`, `Community 44`, `Community 18`, `Community 50`, `Community 52`, `Community 53`, `Community 51`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Why does `Olaso POS Product Specification` connect `Community 2` to `Community 15`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **What connects `OlasothemeTheme`, `components`, `TableNames` to the rest of the system?**
  _420 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05594679186228482 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._