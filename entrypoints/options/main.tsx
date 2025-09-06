import App from "@/App.tsx";
import "@/assets/global.css";
import { trackPage } from "@/features/analytics";
import { Tab, TabList } from "@fluentui/react-components";
import ReactDOM from "react-dom/client";
import { useOptionsStyles } from "./hooks/useOptionsStyles.ts";
import AboutSection from "./layouts/AboutSection.tsx";
import ActionsSection from "./layouts/ActionsSection.tsx";
import GeneralSection from "./layouts/GeneralSection.tsx";
import StorageSection from "./layouts/StorageSection.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<App>
		<OptionsPage />
	</App>
);

trackPage("options_page");

function OptionsPage(): React.ReactElement
{
	const [selection, setSelection] = useState<SelectionType>("general");
	const cls = useOptionsStyles();

	return (
		<main className={ cls.main }>
			<TabList
				className={ cls.tabList }
				selectedValue={ selection }
				onTabSelect={ (_, data) => setSelection(data.value as SelectionType) }
			>
				<Tab value="general">{ i18n.t("options_page.general.title") }</Tab>
				<Tab value="actions">{ i18n.t("options_page.actions.title") }</Tab>
				<Tab value="storage">{ i18n.t("options_page.storage.title") }</Tab>
				<Tab value="about">{ i18n.t("options_page.about.title") }</Tab>
			</TabList>

			<article className={ cls.article }>
				{ selection === "general" && <GeneralSection /> }
				{ selection === "actions" && <ActionsSection /> }
				{ selection === "storage" && <StorageSection /> }
				{ selection === "about" && <AboutSection /> }
			</article>
		</main>
	);
}

type SelectionType = "general" | "actions" | "storage" | "about";
