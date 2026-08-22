/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as categories from "../categories.js";
import type * as dashboard from "../dashboard.js";
import type * as expenses from "../expenses.js";
import type * as identity from "../identity.js";
import type * as identityInternal from "../identityInternal.js";
import type * as inventory from "../inventory.js";
import type * as lib_management from "../lib/management.js";
import type * as lib_operational from "../lib/operational.js";
import type * as lib_session from "../lib/session.js";
import type * as modifiers from "../modifiers.js";
import type * as products from "../products.js";
import type * as recipes from "../recipes.js";
import type * as reports from "../reports.js";
import type * as sales from "../sales.js";
import type * as seed from "../seed.js";
import type * as staff from "../staff.js";
import type * as sync from "../sync.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  categories: typeof categories;
  dashboard: typeof dashboard;
  expenses: typeof expenses;
  identity: typeof identity;
  identityInternal: typeof identityInternal;
  inventory: typeof inventory;
  "lib/management": typeof lib_management;
  "lib/operational": typeof lib_operational;
  "lib/session": typeof lib_session;
  modifiers: typeof modifiers;
  products: typeof products;
  recipes: typeof recipes;
  reports: typeof reports;
  sales: typeof sales;
  seed: typeof seed;
  staff: typeof staff;
  sync: typeof sync;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
