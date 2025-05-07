import { useTheme } from "@/contexts/ThemeProvider";
import { v3blogPost } from "@/data/links";
import { track } from "@/features/analytics";
import extLink from "@/utils/extLink";
import * as fui from "@fluentui/react-components";

export default function WelcomeDialog(): React.ReactElement
{
	const { isDark } = useTheme();
	const cls = useStyles();

	return (
		<fui.DialogSurface>
			<fui.DialogBody>
				<fui.DialogContent className={ cls.root }>
					<img alt="" src={ browser.runtime.getURL(isDark ? "/promo/dark.webp" : "/promo/light.webp") } />

					<fui.Title2>{ i18n.t("features.v3welcome.title") }</fui.Title2>

					<fui.Body1 as="p">
						{ i18n.t("features.v3welcome.text1") }
					</fui.Body1>
					<fui.Body1 as="p">
						{ i18n.t("features.v3welcome.text2") }
					</fui.Body1>
					<ul>
						<li>{ i18n.t("features.v3welcome.list.item1") }</li>
						<li>{ i18n.t("features.v3welcome.list.item2") }</li>
						<li>{ i18n.t("features.v3welcome.list.item3") }</li>
						<li>{ i18n.t("features.v3welcome.list.item4") }</li>
						<li>{ i18n.t("features.v3welcome.list.item5") }</li>
					</ul>
					<fui.Body1>
						{ i18n.t("features.v3welcome.text3") }
					</fui.Body1>

				</fui.DialogContent>

				<fui.DialogActions>
					<fui.DialogTrigger disableButtonEnhancement>
						<fui.Button
							appearance="primary" as="a" { ...extLink(v3blogPost) }
							onClick={ () => track("visit_blog_button_click") }
						>
							{ i18n.t("features.v3welcome.actions.visit_blog") }
						</fui.Button>
					</fui.DialogTrigger>
					<fui.DialogTrigger disableButtonEnhancement>
						<fui.Button appearance="subtle">
							{ i18n.t("common.actions.close") }
						</fui.Button>
					</fui.DialogTrigger>
				</fui.DialogActions>
			</fui.DialogBody>
		</fui.DialogSurface>
	);
}

const useStyles = fui.makeStyles({
	root:
	{
		display: "flex",
		flexFlow: "column",
		gap: fui.tokens.spacingVerticalS
	},
	image:
	{
		display: "contents"
	}
});
