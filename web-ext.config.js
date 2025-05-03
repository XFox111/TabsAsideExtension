import { defineRunnerConfig } from "wxt";

export default defineRunnerConfig({
	binaries:
	{
		edge: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
	},
	chromiumArgs: [
		"--lang=en-US"
	]
});
