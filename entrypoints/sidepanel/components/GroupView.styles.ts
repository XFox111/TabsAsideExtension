import { makeStyles, tokens } from "@fluentui/react-components";

export const useStyles_GroupView = makeStyles({
	root:
	{
		display: "flex",
		flexFlow: "column",
		alignSelf: "normal",

		padding: `${tokens.spacingVerticalSNudge} ${tokens.spacingHorizontalS}`,
		paddingBottom: tokens.spacingVerticalNone,
		borderRadius: tokens.borderRadiusLarge,

		"&:hover .GroupView-toolbar, &:focus-within .GroupView-toolbar":
		{
			visibility: "visible"
		},

		"&:hover":
		{
			backgroundColor: tokens.colorNeutralBackground1Hover
		}
	},
	header:
	{
		display: "flex",
		justifyContent: "space-between",
		alignItems: "flex-end",
		gap: tokens.spacingHorizontalM,

		borderBottom: `${tokens.strokeWidthThick} solid var(--border)`,
		borderBottomLeftRadius: tokens.borderRadiusLarge
	},
	verticalHeader:
	{
		borderBottomLeftRadius: tokens.borderRadiusNone
	},
	title:
	{
		display: "grid",
		gridAutoFlow: "column",
		alignItems: "center",
		minHeight: "12px",
		minWidth: "24px",
		gap: tokens.spacingHorizontalXS,
		width: "max-content",
		maxWidth: "160px",

		padding: `${tokens.spacingVerticalXXS} ${tokens.spacingHorizontalS}`,
		paddingBottom: tokens.spacingVerticalXS,
		marginBottom: "-2px",

		border: `${tokens.strokeWidthThick} solid var(--border)`,
		borderRadius: `${tokens.borderRadiusLarge} ${tokens.borderRadiusLarge} ${tokens.borderRadiusNone} ${tokens.borderRadiusLarge}`,
		borderBottom: "none",
		backgroundColor: "var(--border)",
		color: "var(--text)"
	},
	verticalTitle:
	{
		borderBottomLeftRadius: tokens.borderRadiusNone
	},
	pinned:
	{
		backgroundColor: "transparent"
	},
	toolbar:
	{
		display: "flex",
		gap: tokens.spacingHorizontalS,
		visibility: "hidden"
	},
	showToolbar:
	{
		visibility: "visible"
	},
	openAllLink:
	{
		whiteSpace: "nowrap"
	},
	empty:
	{
		display: "flex",
		flexFlow: "column",
		alignItems: "center",
		justifyContent: "center",
		color: tokens.colorNeutralForeground3,
		minWidth: "160px",
		height: "120px",
		marginBottom: tokens.spacingVerticalSNudge
	},
	verticalEmpty:
	{
		height: "auto",
		padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`
	},
	list:
	{
		display: "flex",
		columnGap: tokens.spacingHorizontalS,
		rowGap: tokens.spacingHorizontalSNudge,
		height: "100%",
		position: "relative"
	},
	verticalList:
	{
		flexFlow: "column"
	},
	verticalListCollapsed:
	{
		maxHeight: "136px",
		overflow: "clip"
	},
	horizontalListCollapsed:
	{
		maxWidth: "400px",
		overflow: "clip"
	},
	listContainer:
	{
		padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalXS}`,
		paddingBottom: tokens.spacingVerticalNone,
		height: "100%"
	},
	verticalListContainer:
	{
		borderLeft: `${tokens.strokeWidthThick} solid var(--border)`,
		padding: tokens.spacingVerticalSNudge,
		marginBottom: tokens.spacingVerticalSNudge,
		borderTopLeftRadius: tokens.borderRadiusNone,
		borderBottomLeftRadius: tokens.borderRadiusNone,
		borderTop: "none"
	},
	pinnedColor:
	{
		"--border": tokens.colorNeutralStrokeAccessible,
		"--text": tokens.colorNeutralForeground1
	},
	dragOverlay:
	{
		backgroundColor: tokens.colorNeutralBackground1Hover,
		transform: "scale(1.05)",
		cursor: "grabbing !important",
		boxShadow: `${tokens.shadow16} !important`,
		"& > div":
		{
			pointerEvents: "none"
		}
	},
	dragging:
	{
		visibility: "hidden"
	}
});
