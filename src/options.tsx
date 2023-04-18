import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import SettingsPage from "./Pages/SettingsPage";

ReactDOM
	.createRoot(document.querySelector("#root") as HTMLElement)
	.render(
		<React.StrictMode>
			<App>
				<SettingsPage />
			</App>
		</React.StrictMode>
	);
