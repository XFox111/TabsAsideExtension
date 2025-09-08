import { githubLinks } from "@/data/links";
import { checkAnalyticsPermission, setAnalyticsPermission } from "@/features/analytics";
import extLink from "@/utils/extLink";
import * as fui from "@fluentui/react-components";
import { settingsForReview } from "../utils/showSettingsReviewDialog";
import { reviewSettings } from "../utils/setSettingsReviewNeeded";

export default function SettingsReviewDialog(): React.ReactElement
{
	const [allowAnalytics, setAllowAnalytics] = useState<boolean | null>(null);
	const [needsReview, setNeedsReview] = useState<string[]>([]);
	const cls = useStyles();

	useEffect(() =>
	{
		checkAnalyticsPermission().then(setAllowAnalytics);
		settingsForReview.getValue().then(setNeedsReview);
	}, []);

	const updateAnalytics = (enabled: boolean): void =>
	{
		setAllowAnalytics(null);
		setAnalyticsPermission(enabled)
			.then(setAllowAnalytics);
	};

	return (
		<fui.DialogSurface>
			<fui.DialogBody>
				<fui.DialogTitle>{ i18n.t("features.settingsReview.title") }</fui.DialogTitle>
				<fui.DialogContent className={ cls.content }>
					{ needsReview.includes(reviewSettings.ANALYTICS) &&
						<>
							<fui.Switch
								label={ i18n.t("options_page.general.options.allow_analytics") }
								checked={ allowAnalytics ?? true }
								disabled={ allowAnalytics === null }
								onChange={ (_, e) => updateAnalytics(e.checked as boolean) } />

							<fui.MessageBar>
								<fui.MessageBarBody className={ cls.msgBarBody }>
									<fui.MessageBarTitle>
										{ i18n.t("features.settingsReview.analytics.title") }
									</fui.MessageBarTitle>
									<fui.Text as="p">
										{ i18n.t("features.settingsReview.analytics.p1") }
									</fui.Text>
									<fui.Text as="p" weight="semibold">
										{ i18n.t("features.settingsReview.analytics.p2") }
									</fui.Text>
									<fui.Text as="p">
										{ i18n.t("features.settingsReview.analytics.p3_text") } <fui.Link { ...extLink(githubLinks.privacy) }>{ i18n.t("features.settingsReview.analytics.p3_link") }</fui.Link>.
									</fui.Text>
								</fui.MessageBarBody>
							</fui.MessageBar>
						</>
					}
				</fui.DialogContent>
				<fui.DialogActions>
					<fui.Button onClick={ () => browser.runtime.openOptionsPage() }>
						{ i18n.t("features.settingsReview.action") }
					</fui.Button>
					<fui.DialogTrigger>
						<fui.Button appearance="primary">{ i18n.t("common.actions.save") }</fui.Button>
					</fui.DialogTrigger>
				</fui.DialogActions>
			</fui.DialogBody>
		</fui.DialogSurface>
	);
}

const useStyles = fui.makeStyles({
	content:
	{
		display: "flex",
		flexFlow: "column",
		gap: fui.tokens.spacingVerticalM
	},
	msgBarBody:
	{
		display: "flex",
		flexFlow: "column",
		gap: fui.tokens.spacingVerticalSNudge,
		marginBottom: fui.tokens.spacingVerticalXS
	}
});
