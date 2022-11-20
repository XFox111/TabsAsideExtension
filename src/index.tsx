import ReactDOM from 'react-dom/client';
import App from './App';
import { MainView } from "./Pages";

ReactDOM
	.createRoot(document.querySelector("#root") as HTMLElement)
	.render(
		<App>
			<MainView />
		</App>
	);
