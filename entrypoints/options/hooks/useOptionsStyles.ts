import { makeStyles, tokens } from "@fluentui/react-components";

export const useOptionsStyles = makeStyles({
	main:
	{
		display: "grid",
		gridTemplateRows: "auto 1fr",
		height: "100%"
	},
	tabList:
	{
		flexWrap: "wrap"
	},
	article:
	{
		display: "flex",
		flexFlow: "column",
		gap: tokens.spacingVerticalMNudge,
		padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
		overflowY: "auto"
	},
	section:
	{
		display: "flex",
		flexFlow: "column",
		alignItems: "flex-start"
	},
	buttonFix:
	{
		minHeight: "32px"
	},
	horizontalButtons:
	{
		display: "flex",
		flexWrap: "wrap",
		gap: tokens.spacingHorizontalS
	},
	group:
	{
		display: "flex",
		flexFlow: "column",
		alignItems: "flex-start",
		gap: tokens.spacingVerticalSNudge
	},
	messageBar:
	{
		flexShrink: 0
	}
});
