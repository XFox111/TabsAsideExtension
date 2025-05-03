import { makeStyles, tokens } from "@fluentui/react-components";

export const useDangerStyles = makeStyles({
	menuItem:
	{
		color: tokens.colorStatusDangerForeground1 + " !important",

		"& .fui-MenuItem__icon":
		{
			color: tokens.colorStatusDangerForeground1 + " !important"
		}
	},
	buttonPrimary:
	{
		backgroundColor: tokens.colorStatusDangerBackground3,
		color: tokens.colorNeutralForegroundStaticInverted,

		"&:hover":
		{
			backgroundColor: tokens.colorStatusDangerBackground3Hover,

			"&:active":
			{
				backgroundColor: tokens.colorStatusDangerBackground3Pressed
			}
		}
	}
});
