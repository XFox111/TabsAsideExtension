import { Browser } from "webextension-polyfill";

const ext: Browser | null = (process.env.NODE_ENV !== "development") ? require("webextension-polyfill") : null;
export default ext;
