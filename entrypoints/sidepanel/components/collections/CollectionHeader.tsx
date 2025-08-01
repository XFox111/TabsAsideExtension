import { getCollectionTitle } from "@/entrypoints/sidepanel/utils/getCollectionTitle";
import getSelectedTabs from "@/entrypoints/sidepanel/utils/getSelectedTabs";
import useSettings from "@/hooks/useSettings";
import { GroupItem, TabItem } from "@/models/CollectionModels";
import { Button, Caption1, makeStyles, mergeClasses, Subtitle2, tokens, Tooltip } from "@fluentui/react-components";
import { Add20Filled, Add20Regular, bundleIcon } from "@fluentui/react-icons";
import CollectionContext, { CollectionContextType } from "../../contexts/CollectionContext";
import { useCollections } from "../../contexts/CollectionsProvider";
import CollectionMoreButton from "./CollectionMoreButton";
import OpenCollectionButton from "./OpenCollectionButton";
import saveTabsToCollection from "@/utils/saveTabsToCollection";

export default function CollectionHeader({ dragHandleRef, dragHandleProps }: CollectionHeaderProps): React.ReactElement
{
	const [contextOpen, setContextOpen] = useState<boolean>(false);
	const [listLocation] = useSettings("listLocation");
	const isTab: boolean = listLocation === "tab" || listLocation === "pinned";
	const { updateCollection } = useCollections();
	const { tabCount, collection } = useContext<CollectionContextType>(CollectionContext);
	const [alwaysShowToolbars] = useSettings("alwaysShowToolbars");

	const AddIcon = bundleIcon(Add20Filled, Add20Regular);

	const handleAddSelected = async () =>
	{
		const newTabs: (TabItem | GroupItem)[] = isTab ?
			(await saveTabsToCollection(false)).items :
			await getSelectedTabs();
		updateCollection({ ...collection, items: [...collection.items, ...newTabs] }, collection.timestamp);
	};

	const cls = useStyles();

	return (
		<div className={ cls.header }>
			<div className={ cls.title } ref={ dragHandleRef } { ...dragHandleProps }>
				<Tooltip
					relationship="description"
					content={ getCollectionTitle(collection) }
					positioning="above-start"
				>
					<Subtitle2 truncate wrap={ false } className={ cls.titleText }>
						{ getCollectionTitle(collection) }
					</Subtitle2>
				</Tooltip>

				<Caption1>
					{ i18n.t("collections.tabs_count", [tabCount]) }
				</Caption1>
			</div>

			<div
				className={
					mergeClasses(
						cls.toolbar,
						"CollectionView__toolbar",
						(alwaysShowToolbars === true || contextOpen) && cls.showToolbar
					) }
			>
				{ tabCount < 1 ?
					<Button icon={ <AddIcon /> } appearance="subtle" onClick={ handleAddSelected }>
						{ isTab ? i18n.t("collections.menu.add_all") : i18n.t("collections.menu.add_selected") }
					</Button>
					:
					<OpenCollectionButton onOpenChange={ (_, e) => setContextOpen(e.open) } />
				}

				<CollectionMoreButton onAddSelected={ handleAddSelected } onOpenChange={ (_, e) => setContextOpen(e.open) } />
			</div>
		</div>
	);
}

export type CollectionHeaderProps =
	{
		dragHandleRef?: React.LegacyRef<HTMLDivElement>;
		dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
	};

const useStyles = makeStyles({
	header:
	{
		color: "var(--border)",
		display: "grid",
		gridTemplateColumns: "1fr auto",
		padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalS}`,
		paddingBottom: tokens.spacingVerticalS
	},
	title:
	{
		display: "flex",
		flexFlow: "column",
		alignItems: "flex-start",
		overflow: "hidden"
	},
	titleText:
	{
		maxWidth: "100%"
	},
	toolbar:
	{
		display: "none",
		gap: tokens.spacingHorizontalS,
		alignItems: "flex-start"
	},
	showToolbar:
	{
		display: "flex"
	}
});
