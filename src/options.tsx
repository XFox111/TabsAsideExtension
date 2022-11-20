import ReactDOM from 'react-dom/client';
import App from './App';
import { SettingsView } from "./Pages";

ReactDOM
	.createRoot(document.querySelector("#root") as HTMLElement)
	.render(
		<App>
			<SettingsView />
		</App>
	);
