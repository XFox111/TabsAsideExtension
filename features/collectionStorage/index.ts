import { collectionStorage } from "./utils/collectionStorage";
export * from "./utils/getCollections";

export { default as getCollections } from "./utils/getCollections";
export { default as resoveConflict } from "./utils/resolveConflict";
export { default as saveCollections } from "./utils/saveCollections";
export { default as setCloudStorage } from "./utils/setCloudStorage";

export const collectionCount = collectionStorage.count;
export const graphics = collectionStorage.graphics;

export const cloudDisabled = collectionStorage.disableCloud;
