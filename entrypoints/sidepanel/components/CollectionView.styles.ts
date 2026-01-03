import { makeStyles, tokens } from "@fluentui/react-components";

export const useStyles_CollectionView = makeStyles({
	root:
	{
		backgroundColor: tokens.colorNeutralBackground1,
		border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
		borderRadius: tokens.borderRadiusLarge,
		display: "flex",
		flexFlow: "column",

		"--border": tokens.colorNeutralForeground1,

		"&:hover .CollectionView__toolbar, &:focus-within .CollectionView__toolbar":
		{
			display: "flex"
		},

		"&:hover":
		{
			boxShadow: tokens.shadow4
		},

		"&:not(:focus-within) .compact":
		{
			display: "none"
		}
	},
	color:
	{
		border: `${tokens.strokeWidthThick} solid var(--border)`
	},
	verticalRoot:
	{
		maxHeight: "560px"
	},
	empty:
	{
		display: "flex",
		flexFlow: "column",
		flexGrow: 1,
		margin: `${tokens.spacingVerticalNone} ${tokens.spacingHorizontalSNudge}`,
		marginBottom: tokens.spacingVerticalSNudge,
		alignItems: "center",
		justifyContent: "center",
		gap: tokens.spacingVerticalS,
		padding: `${tokens.spacingVerticalXL} ${tokens.spacingHorizontalL}`,
		color: tokens.colorNeutralForeground3,
		height: "144px"
	},
	emptyText:
	{
		display: "flex",
		flexFlow: "column",
		alignItems: "center",
		gap: tokens.spacingVerticalXS
	},
	emptyCaption:
	{
		display: "flex",
		flexWrap: "wrap",
		alignItems: "center",
		justifyContent: "center",
		columnGap: tokens.spacingHorizontalXS
	},
	list:
	{
		display: "grid",
		padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
		columnGap: tokens.spacingHorizontalS,
		rowGap: tokens.spacingHorizontalSNudge,
		overflowX: "auto",
		alignItems: "flex-end",
		alignSelf: "flex-start",
		maxWidth: "100%",
		gridAutoFlow: "column"
	},
	verticalList:
	{
		gridAutoFlow: "row",
		width: "100%",
		paddingBottom: tokens.spacingVerticalS,
		gridAutoRows: import.meta.env.FIREFOX ? "min-content" : undefined
	},
	dragOverlay:
	{
		cursor: "grabbing !important",
		transform: "scale(1.05)",
		boxShadow: `${tokens.shadow16} !important`,
		"& > div":
		{
			pointerEvents: "none"
		}
	},
	sorting:
	{
		pointerEvents: "none"
	},
	dragging:
	{
		visibility: "hidden"
	},
	draggingOver:
	{
		backgroundColor: tokens.colorBrandBackground2
	}
});
