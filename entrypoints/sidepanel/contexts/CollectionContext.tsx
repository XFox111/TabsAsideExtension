import { CollectionItem } from "@/models/CollectionModels";
import { createContext } from "react";

const CollectionContext = createContext<CollectionContextType>(null!);

export default CollectionContext;

export type CollectionContextType =
	{
		collection: CollectionItem;
		tabCount: number;
		hasPinnedGroup: boolean;
	};
