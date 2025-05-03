import { collectionStorage } from "./utils/collectionStorage";
export * from "./utils/getCollections";

export { default as getCollections } from "./utils/getCollections";
export { default as resoveConflict } from "./utils/resolveConflict";
export { default as saveCollections } from "./utils/saveCollections";

export const collectionCount = collectionStorage.count;
export const graphics = collectionStorage.graphics;
