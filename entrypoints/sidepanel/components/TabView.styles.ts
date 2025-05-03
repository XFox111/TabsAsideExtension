import { makeStyles, tokens } from "@fluentui/react-components";

export const useStyles_TabView = makeStyles({
	root:
	{
		display: "grid",
		position: "relative",

		width: "160px",
		height: "120px",
		marginBottom: tokens.spacingVerticalSNudge,

		border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke3}`,
		borderRadius: tokens.borderRadiusMedium,
		backgroundColor: tokens.colorNeutralBackground1,

		cursor: "pointer",
		textDecoration: "none !important",
		userSelect: "none",

		"&:hover button, &:focus-within button":
		{
			display: "inline-flex"
		},

		"&:hover":
		{
			boxShadow: tokens.shadow4
		},

		"&:focus-visible":
		{
			outline: `2px solid ${tokens.colorStrokeFocus2}`
		}
	},
	listView:
	{
		width: "100%",
		height: "min-content",
		marginBottom: tokens.spacingVerticalNone
	},
	image:
	{
		zIndex: 0,
		position: "absolute",
		height: "100%",
		width: "100%",

		borderRadius: tokens.borderRadiusMedium,
		objectFit: "cover"
	},
	header:
	{
		zIndex: 1,
		alignSelf: "end",
		minHeight: "32px",

		display: "grid",
		gridTemplateColumns: "auto 1fr auto",
		alignItems: "center",
		gap: tokens.spacingHorizontalSNudge,
		paddingLeft: tokens.spacingHorizontalS,

		borderBottomLeftRadius: tokens.borderRadiusMedium,
		borderBottomRightRadius: tokens.borderRadiusMedium,

		backgroundColor: tokens.colorSubtleBackgroundLightAlphaHover,
		color: tokens.colorNeutralForeground1,
		"-webkit-backdrop-filer": "blur(4px)",
		backdropFilter: "blur(4px)"
	},
	icon:
	{
		cursor: "grab",

		"&:active":
		{
			cursor: "grabbing"
		}
	},
	title:
	{
		overflowX: "hidden",
		justifySelf: "start",
		maxWidth: "100%"
	},
	deleteButton:
	{
		display: "none",

		"@media (pointer: coarse)":
		{
			display: "inline-flex"
		}
	},
	showDeleteButton:
	{
		display: "inline-flex"
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
	dragging:
	{
		visibility: "hidden"
	}
});
