import App from "@/App.tsx";
import "@/assets/global.css";
import { useLocalMigration } from "@/features/migration";
import useWelcomeDialog from "@/features/v3welcome/hooks/useWelcomeDialog";
import { Divider, makeStyles } from "@fluentui/react-components";
import ReactDOM from "react-dom/client";
import CollectionsProvider from "./contexts/CollectionsProvider";
import CollectionListView from "./layouts/collections/CollectionListView";
import Header from "./layouts/header/Header";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<App>
		<MainPage />
	</App>
);

document.title = i18n.t("manifest.name");
analytics.page("collection_list");

function MainPage(): React.ReactElement
{
	const cls = useStyles();

	useLocalMigration();
	useWelcomeDialog();

	return (
		<CollectionsProvider>
			<main className={ cls.main }>
				<Header />
				<Divider />
				<CollectionListView />
			</main>
		</CollectionsProvider>
	);
}

const useStyles = makeStyles({
	main:
	{
		display: "grid",
		gridTemplateRows: "auto auto 1fr",
		height: "100vh"
	}
});
