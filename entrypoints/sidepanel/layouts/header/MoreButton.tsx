import { BuyMeACoffee20Filled, BuyMeACoffee20Regular } from "@/assets/BuyMeACoffee20";
import { buyMeACoffeeLink, githubLinks, storeLink } from "@/data/links";
import { track } from "@/features/analytics";
import useSettings from "@/hooks/useSettings";
import extLink from "@/utils/extLink";
import sendNotification from "@/utils/sendNotification";
import * as fui from "@fluentui/react-components";
import * as ic from "@fluentui/react-icons";
import { ReactElement } from "react";

export default function MoreButton(): ReactElement
{
	const [tilesView, setTilesView] = useSettings("tilesView");
	const [compactView, setCompactView] = useSettings("compactView");

	const SettingsIcon: ic.FluentIcon = ic.bundleIcon(ic.Settings20Filled, ic.Settings20Regular);
	const GridIcon: ic.FluentIcon = ic.bundleIcon(ic.GridKanban20Filled, ic.GridKanban20Regular);
	const CompactIcon: ic.FluentIcon = ic.bundleIcon(ic.ArrowMinimizeVerticalFilled, ic.ArrowMinimizeVerticalRegular);
	const FeedbackIcon: ic.FluentIcon = ic.bundleIcon(ic.PersonFeedback20Filled, ic.PersonFeedback20Regular);
	const LearnIcon: ic.FluentIcon = ic.bundleIcon(ic.QuestionCircle20Filled, ic.QuestionCircle20Regular);
	const BmcIcon: ic.FluentIcon = ic.bundleIcon(BuyMeACoffee20Filled, BuyMeACoffee20Regular);

	const checkedValues = useMemo(() => ({
		view: [
			tilesView ? "tiles" : "",
			compactView ? "compact" : ""
		]
	}), [tilesView, compactView]);

	const onCheckedValueChange = (_: unknown, e: fui.MenuCheckedValueChangeData) =>
	{
		setTilesView(e.checkedItems.includes("tiles"));
		setCompactView(e.checkedItems.includes("compact"));
	};

	return (
		<fui.Menu
			hasIcons hasCheckmarks
			checkedValues={ checkedValues } onCheckedValueChange={ onCheckedValueChange }
		>
			<fui.Tooltip relationship="label" content={ i18n.t("common.tooltips.more") }>
				<fui.MenuTrigger disableButtonEnhancement>
					<fui.Button appearance="subtle" icon={ <ic.MoreVerticalRegular /> } />
				</fui.MenuTrigger>
			</fui.Tooltip>

			<fui.MenuPopover>
				<fui.MenuList>

					<fui.MenuItem icon={ <SettingsIcon /> } onClick={ () => browser.runtime.openOptionsPage() }>
						{ i18n.t("options_page.title") }
					</fui.MenuItem>
					<fui.MenuItemCheckbox name="view" value="tiles" icon={ <GridIcon /> }>
						{ i18n.t("main.header.menu.tiles_view") }
					</fui.MenuItemCheckbox>
					<fui.MenuItemCheckbox name="view" value="compact" icon={ <CompactIcon /> }>
						{ i18n.t("main.header.menu.compact_view") }
					</fui.MenuItemCheckbox>

					<fui.MenuDivider />

					<fui.MenuItemLink icon={ <BmcIcon /> } { ...extLink(buyMeACoffeeLink) } onClick={ () => track("feedback_clicked") }>
						{ i18n.t("common.cta.sponsor") }
					</fui.MenuItemLink>
					<fui.MenuItemLink icon={ <FeedbackIcon /> } { ...extLink(storeLink) } onClick={ () => track("bmc_clicked") }>
						{ i18n.t("common.cta.feedback") }
					</fui.MenuItemLink>
					<fui.MenuItemLink icon={ <LearnIcon /> } { ...extLink(githubLinks.release) } >
						{ i18n.t("main.header.menu.changelog") }
					</fui.MenuItemLink>

					{ import.meta.env.DEV &&
						<fui.MenuGroup>
							<fui.MenuGroupHeader>Dev tools</fui.MenuGroupHeader>
							<fui.MenuItem
								icon={ <ic.ArrowClockwise20Regular /> }
								onClick={ () => document.location.reload() }
							>
								Reload page
							</fui.MenuItem>
							<fui.MenuItem
								icon={ <ic.Open20Regular /> }
								onClick={ () => browser.tabs.create({ url: browser.runtime.getURL("/sidepanel.html"), active: true }) }
							>
								Open in tab
							</fui.MenuItem>
							<fui.MenuItem
								icon={ <ic.Alert20Regular /> }
								onClick={ async () => await sendNotification({
									icon: "/notification_icons/cloud_error.png",
									message: "Notification message",
									title: "Notification title"
								}) }
							>
								Show test notification
							</fui.MenuItem>
						</fui.MenuGroup>
					}
				</fui.MenuList>
			</fui.MenuPopover>
		</fui.Menu>
	);
}
