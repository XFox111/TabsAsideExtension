chrome.runtime.onMessage.addListener(function(sender, request, sendResponse)
{
	var pane = document.querySelector("#aside-pane");
	if (pane.style.transform == "translateX(110%)")
	{
		pane.style.transform = "translateX(0%)";
	}
	else
	{
		pane.style.transform = "translateX(110%)";
	}

	UpdateTheme();
	
	sendResponse();
});

var xhr = new XMLHttpRequest();
xhr.open('GET', chrome.extension.getURL("collections.html"), true);
xhr.onreadystatechange = function () 
{
	if (this.status !== 200 || document.querySelector("#aside-pane") != null)
		return;

	document.body.innerHTML += this.responseText.split("%EXTENSION_PATH%").join(chrome.extension.getURL(""));
};
xhr.send();

function UpdateTheme()
{
	var css = document.querySelector("#aside-pane #darkCSS")
	if (window.matchMedia("(prefers-color-scheme: dark)").matches)
	{
		css.removeAttribute("disabled");
	}
	else
	{
		css.setAttribute("disabled", true);
	}
}