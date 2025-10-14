/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as applications from "../applications.js";
import type * as companies from "../companies.js";
import type * as fileStorage from "../fileStorage.js";
import type * as fileUploads from "../fileUploads.js";
import type * as jobs from "../jobs.js";
import type * as migrations from "../migrations.js";
import type * as savedJobs from "../savedJobs.js";
import type * as seedData from "../seedData.js";
import type * as testJobs from "../testJobs.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  applications: typeof applications;
  companies: typeof companies;
  fileStorage: typeof fileStorage;
  fileUploads: typeof fileUploads;
  jobs: typeof jobs;
  migrations: typeof migrations;
  savedJobs: typeof savedJobs;
  seedData: typeof seedData;
  testJobs: typeof testJobs;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
