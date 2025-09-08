import { githubLinks } from "@/data/links";
import { analyticsPermission } from "@/features/analytics";
import extLink from "@/utils/extLink";
import * as fui from "@fluentui/react-components";
import { settingsForReview } from "../utils/showSettingsReviewDialog";
import { reviewSettings } from "../utils/setSettingsReviewNeeded";
import { Unwatch } from "wxt/storage";
import { thumbnailCaptureEnabled } from "@/features/collectionStorage";

export default function SettingsReviewDialog(): React.ReactElement
{
	const [allowAnalytics, setAllowAnalytics] = useState<boolean | null>(null);
	const [captureThumbnails, setCaptureThumbnails] = useState<boolean | null>(null);
	const [needsReview, setNeedsReview] = useState<string[]>([]);
	const cls = useStyles();

	useEffect(() =>
	{
		analyticsPermission.getValue().then(setAllowAnalytics);
		thumbnailCaptureEnabled.getValue().then(setCaptureThumbnails);
		settingsForReview.getValue().then(setNeedsReview);

		const unwatchAnalytics: Unwatch = analyticsPermission.watch(setAllowAnalytics);
		const unwatchThumbnails: Unwatch = thumbnailCaptureEnabled.watch(setCaptureThumbnails);

		return () =>
		{
			unwatchAnalytics();
			unwatchThumbnails();
		};
	}, []);

	const updateAnalytics = (enabled: boolean): void =>
	{
		setAllowAnalytics(null);
		analyticsPermission.setValue(enabled);
	};

	const updateThumbnails = (enabled: boolean): void =>
	{
		setCaptureThumbnails(null);
		thumbnailCaptureEnabled.setValue(enabled);
	};

	return (
		<fui.DialogSurface>
			<fui.DialogBody>
				<fui.DialogTitle>{ i18n.t("features.settingsReview.title") }</fui.DialogTitle>
				<fui.DialogContent className={ cls.content }>
					{ needsReview.includes(reviewSettings.THUMBNAILS) &&
						<div className={ cls.section }>
							<fui.Switch
								label={ i18n.t("options_page.storage.thumbnail_capture") }
								checked={ captureThumbnails ?? true }
								disabled={ captureThumbnails === null }
								onChange={ (_, e) => updateThumbnails(e.checked as boolean) } />

							<fui.MessageBar layout="multiline">
								<fui.MessageBarBody className={ cls.msgBarBody }>
									<fui.MessageBarTitle>
										{ i18n.t("options_page.storage.thumbnail_capture_notice1") }
									</fui.MessageBarTitle>
									<fui.Text as="p">
										{ i18n.t("options_page.storage.thumbnail_capture_notice2") }
									</fui.Text>
								</fui.MessageBarBody>
							</fui.MessageBar>
						</div>
					}
					{ needsReview.includes(reviewSettings.ANALYTICS) &&
						<div className={ cls.section }>
							<fui.Switch
								label={ i18n.t("options_page.general.options.allow_analytics") }
								checked={ allowAnalytics ?? true }
								disabled={ allowAnalytics === null }
								onChange={ (_, e) => updateAnalytics(e.checked as boolean) } />

							<fui.MessageBar layout="multiline">
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
						</div>
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
		gap: fui.tokens.spacingVerticalL
	},
	section:
	{
		display: "flex",
		flexFlow: "column",
		gap: fui.tokens.spacingVerticalXS
	},
	msgBarBody:
	{
		display: "flex",
		flexFlow: "column",
		gap: fui.tokens.spacingVerticalXS,
		marginBottom: fui.tokens.spacingVerticalXS
	}
});
