import { BuyMeACoffee20Regular } from "@/assets/BuyMeACoffee20";
import { bskyLink, buyMeACoffeeLink, githubLinks, storeLink, websiteLink } from "@/data/links";
import { useBmcStyles } from "@/hooks/useBmcStyles";
import extLink from "@/utils/extLink";
import { Body1, Button, Caption1, Link, Subtitle1, Text } from "@fluentui/react-components";
import { PersonFeedback20Regular } from "@fluentui/react-icons";
import { useOptionsStyles } from "../hooks/useOptionsStyles";
import Package from "@/package.json";

export default function AboutSection(): React.ReactElement
{
	const cls = useOptionsStyles();
	const bmcCls = useBmcStyles();

	return (
		<>
			<Text as="p">
				<Subtitle1>{ i18n.t("manifest.name") }</Subtitle1>
				<sup><Caption1> v{ Package.version }</Caption1></sup>
			</Text>

			<Body1 as="p">
				{ i18n.t("options_page.about.developed_by") } (<Link { ...extLink(bskyLink) }>@xfox111.net</Link>)<br />
				{ i18n.t("options_page.about.licensed_under") } <Link { ...extLink(githubLinks.license) }>{ i18n.t("options_page.about.mit_license") }</Link>
			</Body1>

			<Body1 as="p">
				{ i18n.t("options_page.about.translation_cta.text") }<br />
				<Link { ...extLink(githubLinks.translationGuide) }>
					{ i18n.t("options_page.about.translation_cta.button") }
				</Link>
			</Body1>

			<Body1 as="p">
				<Link { ...extLink(websiteLink) }>{ i18n.t("options_page.about.links.website") }</Link><br />
				<Link { ...extLink(githubLinks.repo) }>{ i18n.t("options_page.about.links.source") }</Link><br />
				<Link { ...extLink(githubLinks.release) }>{ i18n.t("options_page.about.links.changelog") }</Link>
			</Body1>

			<div className={ cls.horizontalButtons }>
				<Button
					as="a" { ...extLink(storeLink) }
					appearance="primary"
					icon={ <PersonFeedback20Regular /> }
				>
					{ i18n.t("common.cta.feedback") }
				</Button>
				<Button
					as="a" { ...extLink(buyMeACoffeeLink) }
					appearance="primary" className={ bmcCls.button }
					icon={ <BuyMeACoffee20Regular /> }
				>
					{ i18n.t("common.cta.sponsor") }
				</Button>
			</div>
		</>
	);
}
