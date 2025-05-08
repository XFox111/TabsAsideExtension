export default async function exportData(): Promise<void>
{
	const data: string = JSON.stringify({
		local: await browser.storage.local.get(null),
		sync: await browser.storage.sync.get(null)
	});
	const blob: Blob = new Blob([data], { type: "application/json" });

	const element: HTMLAnchorElement = document.createElement("a");
	element.style.display = "none";
	element.href = URL.createObjectURL(blob);
	element.setAttribute("download", "tabs-aside_data.json");

	document.body.appendChild(element);
	element.click();

	URL.revokeObjectURL(element.href);
	document.body.removeChild(element);
};
