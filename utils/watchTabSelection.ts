import { Unwatch } from "wxt/storage";

export default function watchTabSelection(onChange: TabSelectChangeHandler): Unwatch
{
	const handleTabSelection = async () =>
	{
		const highlightedTabs = await browser.tabs.query({
			currentWindow: true,
			highlighted: true
		});
		onChange(highlightedTabs.length > 1 ? "selected" : "all");
	};

	handleTabSelection();
	browser.tabs.onHighlighted.addListener(handleTabSelection);

	return () => browser.tabs.onHighlighted.removeListener(handleTabSelection);
}

export type TabSelectChangeHandler = (selection: "all" | "selected") => void;
