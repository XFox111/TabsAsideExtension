import { makeStyles, tokens } from "@fluentui/react-components";

export const useGroupColors: () => Record<`${Browser.tabGroups.Color}`, string> = makeStyles({
	blue:
	{
		"--border": tokens.colorPaletteBlueBorderActive,
		"--text": tokens.colorNeutralForegroundInverted
	},
	cyan:
	{
		"--border": tokens.colorPaletteTealBorderActive,
		"--text": tokens.colorNeutralForegroundInverted
	},
	green:
	{
		"--border": tokens.colorPaletteGreenBorderActive,
		"--text": tokens.colorNeutralForegroundInverted
	},
	grey:
	{
		"--border": tokens.colorPalettePlatinumBorderActive,
		"--text": tokens.colorNeutralForegroundInverted
	},
	orange:
	{
		"--border": tokens.colorPalettePeachBorderActive,
		"--text": tokens.colorNeutralForegroundInverted
	},
	pink:
	{
		"--border": tokens.colorPalettePinkBorderActive,
		"--text": tokens.colorNeutralForegroundInverted
	},
	purple:
	{
		"--border": tokens.colorPalettePurpleBorderActive,
		"--text": tokens.colorNeutralForegroundStaticInverted
	},
	red:
	{
		"--border": tokens.colorPaletteRedBackground3,
		"--text": tokens.colorNeutralForegroundStaticInverted
	},
	yellow:
	{
		"--border": tokens.colorPaletteYellowBorderActive,
		"--text": tokens.colorNeutralForeground1Static
	}
});
