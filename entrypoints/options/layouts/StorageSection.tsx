import { useDialog } from "@/contexts/DialogProvider";
import { clearGraphicsStorage, cloudDisabled, setCloudStorage, thumbnailCaptureEnabled } from "@/features/collectionStorage";
import { useDangerStyles } from "@/hooks/useDangerStyles";
import useStorageInfo from "@/hooks/useStorageInfo";
import { Button, Field, InfoLabel, LabelProps, MessageBar, MessageBarBody, MessageBarTitle, ProgressBar, Switch } from "@fluentui/react-components";
import { ArrowDownload20Regular, ArrowUpload20Regular } from "@fluentui/react-icons";
import { Unwatch } from "wxt/utils/storage";
import { useOptionsStyles } from "../hooks/useOptionsStyles";
import exportData from "../utils/exportData";
import importData from "../utils/importData";

export default function StorageSection(): React.ReactElement
{
	const { bytesInUse, storageQuota, usedStorageRatio } = useStorageInfo();
	const [importResult, setImportResult] = useState<boolean | null>(null);
	const [isCloudDisabled, setCloudDisabled] = useState<boolean>(null!);
	const [isThumbnailCaptureEnabled, setThumbnailCaptureEnabled] = useState<boolean | null>(null);

	const dialog = useDialog();
	const cls = useOptionsStyles();
	const dangerCls = useDangerStyles();

	useEffect(() =>
	{
		thumbnailCaptureEnabled.getValue().then(setThumbnailCaptureEnabled);
		cloudDisabled.getValue().then(setCloudDisabled);

		const unwatchCloud: Unwatch = cloudDisabled.watch(setCloudDisabled);
		const unwatchThumbnails: Unwatch = thumbnailCaptureEnabled.watch(setThumbnailCaptureEnabled);

		return () =>
		{
			unwatchCloud();
			unwatchThumbnails();
		};
	}, []);

	const handleSetThumbnailCapture = (enabled: boolean): void =>
	{
		setThumbnailCaptureEnabled(null);
		thumbnailCaptureEnabled.setValue(enabled)
			.catch(() => setThumbnailCaptureEnabled(!enabled));
	};

	const handleClearThumbnails = (): void =>
		dialog.pushPrompt({
			title: i18n.t("options_page.storage.clear_thumbnails.title"),
			content: i18n.t("options_page.storage.clear_thumbnails.prompt"),
			confirmText: i18n.t("common.actions.delete"),
			destructive: true,
			onConfirm: () => clearGraphicsStorage()
		});

	const handleImport = (): void =>
		dialog.pushPrompt({
			title: i18n.t("options_page.storage.import_prompt.title"),
			confirmText: i18n.t("options_page.storage.import_prompt.proceed"),
			onConfirm: () => importData().then(setImportResult),
			content: (
				<MessageBar intent="warning">
					<MessageBarBody>
						<MessageBarTitle>{ i18n.t("options_page.storage.import_prompt.warning_title") }</MessageBarTitle>

						{ i18n.t("options_page.storage.import_prompt.warning_text") }
					</MessageBarBody>
				</MessageBar>
			)
		});

	const handleDisableCloud = (): void =>
		dialog.pushPrompt({
			title: i18n.t("options_page.storage.disable"),
			content: i18n.t("options_page.storage.disable_prompt.text"),
			confirmText: i18n.t("options_page.storage.disable_prompt.action"),
			destructive: true,
			onConfirm: () => setCloudStorage(false)
		});

	return (
		<>
			<div className={ cls.group }>
				<Switch
					checked={ isThumbnailCaptureEnabled ?? true }
					disabled={ isThumbnailCaptureEnabled === null }
					onChange={ (_, e) => handleSetThumbnailCapture(e.checked as boolean) }
					label={ {
						children: (_: any, props: LabelProps) =>
							<InfoLabel
								{ ...props }
								label={ i18n.t("options_page.storage.thumbnail_capture") }
								info={
									<p>
										{ i18n.t("options_page.storage.thumbnail_capture_notice1") }<br /><br />
										{ i18n.t("options_page.storage.thumbnail_capture_notice2") }
									</p>
								} />
					} } />

				<Button onClick={ handleClearThumbnails } className={ dangerCls.buttonSubtle } appearance="subtle">
					{ i18n.t("options_page.storage.clear_thumbnails.action") }
				</Button>
			</div>

			{ isCloudDisabled === false &&
				<Field
					label={ i18n.t("options_page.storage.capacity.title") }
					hint={ i18n.t("options_page.storage.capacity.description", [(bytesInUse / 1024).toFixed(1), storageQuota / 1024]) }
					validationState={ usedStorageRatio >= 0.8 ? "error" : undefined }
				>
					<ProgressBar value={ usedStorageRatio } thickness="large" />
				</Field>
			}

			{ isCloudDisabled === true &&
				<Button appearance="primary" onClick={ () => setCloudStorage(true) }>
					{ i18n.t("options_page.storage.enable") }
				</Button>
			}

			<div className={ cls.horizontalButtons }>
				<Button icon={ <ArrowDownload20Regular /> } onClick={ exportData }>
					{ i18n.t("options_page.storage.export") }
				</Button>
				<Button icon={ <ArrowUpload20Regular /> } onClick={ handleImport }>
					{ i18n.t("options_page.storage.import") }
				</Button>
			</div>

			{ importResult !== null &&
				<MessageBar intent={ importResult ? "success" : "error" }>
					<MessageBarBody>
						{ importResult === true ?
							i18n.t("options_page.storage.import_results.success") :
							i18n.t("options_page.storage.import_results.error")
						}
					</MessageBarBody>
				</MessageBar>
			}

			{ isCloudDisabled === false &&
				<div className={ cls.horizontalButtons }>
					<Button
						appearance="subtle" className={ dangerCls.buttonSubtle }
						onClick={ handleDisableCloud }
					>
						{ i18n.t("options_page.storage.disable") }
					</Button>
				</div>
			}
		</>
	);
}
