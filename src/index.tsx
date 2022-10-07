import ReactDOM from 'react-dom/client';
import { Routes, Route, HashRouter } from "react-router-dom";
import App from './App';
import FaqView from "./Views/FaqView";
import MainView from "./Views/MainView";

ReactDOM
	.createRoot(document.querySelector("#root") as HTMLElement)
	.render(
		<App>
			<HashRouter>
				<Routes>
					<Route path="faq" element={ <FaqView />} />
					<Route path="*" element={ <MainView /> } />
				</Routes>
			</HashRouter>
		</App>
	);
