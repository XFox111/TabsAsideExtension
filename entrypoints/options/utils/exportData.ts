export default async function exportData(): Promise<void>
{
	const data: string = JSON.stringify({
		local: await browser.storage.local.get(null),
		sync: await browser.storage.sync.get(null)
	});

	const element: HTMLAnchorElement = document.createElement("a");
	element.style.display = "none";
	element.href = `data:application/json;charset=utf-8,${data}`;
	element.setAttribute("download", "tabs-aside_data.json");

	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
};
