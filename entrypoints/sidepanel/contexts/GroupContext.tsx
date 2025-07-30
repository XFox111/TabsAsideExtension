import { GroupItem } from "@/models/CollectionModels";
import { createContext } from "react";

const GroupContext = createContext<GroupContextType>(null!);

export default GroupContext;

export type GroupContextType =
	{
		group: GroupItem;
		indices: number[];
	};
