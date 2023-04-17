import ReactDOM from 'react-dom/client';
import App from './App';
import MainPage from "./Pages/MainPage";

ReactDOM
	.createRoot(document.querySelector("#root") as HTMLElement)
	.render(
		<App>
			<MainPage />
		</App>
	);
