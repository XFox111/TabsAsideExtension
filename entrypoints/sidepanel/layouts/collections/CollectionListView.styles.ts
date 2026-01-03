import { makeStyles, tokens } from "@fluentui/react-components";

export const useStyles_CollectionListView = makeStyles({
	root:
	{
		display: "flex",
		flexFlow: "column",
		gap: tokens.spacingVerticalM,
		padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalS}`,
		overflowX: "hidden",
		overflowY: "auto"
	},
	collectionList:
	{
		display: "flex",
		flexFlow: "column",
		gap: tokens.spacingVerticalM
	},
	searchBar:
	{
		boxShadow: tokens.shadow2
	},
	emptySearch:
	{
		display: "flex",
		flexFlow: "column",
		flexGrow: 1,
		alignItems: "center",
		justifyContent: "center",
		gap: tokens.spacingVerticalS
	},
	empty:
	{
		display: "flex",
		flexFlow: "column",
		alignItems: "center",
		justifyContent: "center",
		gap: tokens.spacingVerticalS,
		padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalM}`,
		color: tokens.colorNeutralForeground2
	},
	msgBar:
	{
		flex: "none"
	},
	listView:
	{
		display: "grid",

		"@media screen and (min-width: 360px)":
		{
			gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))"
		}
	},
	compactList:
	{
		alignItems: "baseline"
	}
});
