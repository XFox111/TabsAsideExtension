import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useStyles_EditDialog = makeStyles({
	surface:
	{
		"--border": tokens.colorTransparentStroke,
		...shorthands.borderWidth(tokens.strokeWidthThick),
		...shorthands.borderColor("var(--border)")
	},
	content:
	{
		display: "flex",
		flexFlow: "column",
		gap: tokens.spacingVerticalS
	},
	colorPicker:
	{
		display: "flex",
		flexWrap: "wrap",
		rowGap: tokens.spacingVerticalS,
		columnGap: tokens.spacingVerticalS
	},
	colorButton:
	{
		"&[aria-pressed=true]":
		{
			color: "var(--text) !important",
			backgroundColor: "var(--border) !important",

			"& .fui-Button__icon":
			{
				color: "var(--text)"
			}
		}
	},
	colorButton_icon:
	{
		color: "var(--border)"
	}
});
