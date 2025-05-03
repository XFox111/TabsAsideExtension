import { CloudStorageIssueType, getCollections, graphics as graphicsStorage, saveCollections } from "@/features/collectionStorage";
import useSettings from "@/hooks/useSettings";
import { CollectionItem, GraphicsStorage, GroupItem } from "@/models/CollectionModels";
import getLogger from "@/utils/getLogger";
import { onMessage } from "@/utils/messaging";
import { createContext } from "react";
import mergePinnedGroups from "../utils/mergePinnedGroups";

const logger = getLogger("CollectionsProvider");

const CollectionsContext = createContext<CollectionsContextType>(null!);

export const useCollections = () => useContext<CollectionsContextType>(CollectionsContext);

export default function CollectionsProvider({ children }: React.PropsWithChildren): React.ReactElement
{
	const [collections, setCollections] = useState<CollectionItem[]>(null!);
	const [cloudIssue, setCloudIssue] = useState<CloudStorageIssueType | null>(null);
	const [graphics, setGraphics] = useState<GraphicsStorage>({});
	const [tilesView] = useSettings("tilesView");

	useEffect(() =>
	{
		refreshCollections();
		onMessage("refreshCollections", refreshCollections);
	}, []);

	const refreshCollections = async (): Promise<void> =>
	{
		const [result, issues] = await getCollections();
		setCloudIssue(issues);
		setCollections(result);
		setGraphics(await graphicsStorage.getValue());
	};

	const updateStorage = async (collectionList: CollectionItem[]): Promise<void> =>
	{
		logger("save");
		collectionList.forEach(mergePinnedGroups);
		setCollections([...collectionList]);
		await saveCollections(collectionList, cloudIssue === null);
		setGraphics(await graphicsStorage.getValue());
	};

	const addCollection = (collection: CollectionItem): void =>
	{
		updateStorage([collection, ...collections]);
	};

	const removeItem = (...indices: number[]): void =>
	{
		if (indices.length > 2)
			(collections[indices[0]].items[indices[1]] as GroupItem).items.splice(indices[2], 1);
		else if (indices.length > 1)
			collections[indices[0]].items.splice(indices[1], 1);
		else
			collections.splice(indices[0], 1);

		updateStorage(collections);
	};

	const updateCollections = (collectionList: CollectionItem[]): void =>
	{
		updateStorage(collectionList);
	};

	const updateCollection = (collection: CollectionItem, index: number): void =>
	{
		collections[index] = collection;
		updateStorage(collections);
	};

	const updateGroup = (group: GroupItem, collectionIndex: number, groupIndex: number): void =>
	{
		collections[collectionIndex].items[groupIndex] = group;
		updateStorage(collections);
	};

	const ungroup = (collectionIndex: number, groupIndex: number): void =>
	{
		const group = collections[collectionIndex].items[groupIndex] as GroupItem;
		collections[collectionIndex].items.splice(groupIndex, 1, ...group.items);
		updateStorage(collections);
	};

	return (
		<CollectionsContext.Provider
			value={ {
				collections, cloudIssue, graphics, tilesView: tilesView!,
				refreshCollections, removeItem, ungroup,
				updateCollections, updateCollection, updateGroup, addCollection
			} }
		>
			{ children }
		</CollectionsContext.Provider>
	);
}

export type CollectionsContextType =
	{
		collections: CollectionItem[] | null;
		cloudIssue: CloudStorageIssueType | null;
		graphics: GraphicsStorage;
		tilesView: boolean;

		refreshCollections: () => Promise<void>;
		addCollection: (collection: CollectionItem) => void;

		updateCollections: (collections: CollectionItem[]) => void;
		updateCollection: (collection: CollectionItem, index: number) => void;
		updateGroup: (group: GroupItem, collectionIndex: number, groupIndex: number) => void;
		ungroup: (collectionIndex: number, groupIndex: number) => void;

		removeItem: (...indices: number[]) => void;
	};
