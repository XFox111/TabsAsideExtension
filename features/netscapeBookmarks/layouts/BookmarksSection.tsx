import { useDialog } from "@/contexts/DialogProvider";
import { Body1, Button, makeStyles, MessageBar, MessageBarBody, Subtitle2, tokens } from "@fluentui/react-components";
import { ArrowDownload20Regular, ArrowUpload20Regular } from "@fluentui/react-icons";
import importBookmarks from "../utils/importBookmarks";
import exportBookmarks from "../utils/exportBookmarks";

export default function BookmarksSection(): React.ReactElement
{
	const cls = useStyles();
	const dialog = useDialog();

	const [importResult, setImportResult] = useState<number | null>(null);

	const handleImport = (): void =>
		dialog.pushPrompt({
			title: i18n.t("features.netscape_bookmarks.import_dialog.title"),
			confirmText: i18n.t("options_page.storage.import_prompt.proceed"),
			onConfirm: () => importBookmarks().then(setImportResult),
			content: (
				<Body1 as="p">
					{ i18n.t("features.netscape_bookmarks.import_dialog.content") }
				</Body1>
			)
		});

	return (
		<div className={ cls.root }>
			<Subtitle2>{ i18n.t("features.netscape_bookmarks.title") }</Subtitle2>

			{ importResult !== null &&
				<MessageBar intent={ importResult >= 0 ? "success" : "error" } layout="multiline">
					<MessageBarBody>
						{ importResult >= 0 ?
							i18n.t("features.netscape_bookmarks.import_result.success", [importResult]) :
							i18n.t("features.netscape_bookmarks.import_result.error")
						}
					</MessageBarBody>
				</MessageBar>
			}

			<div className={ cls.buttons }>
				<Button icon={ <ArrowDownload20Regular /> } onClick={ exportBookmarks }>
					{ i18n.t("features.netscape_bookmarks.export") }
				</Button>
				<Button icon={ <ArrowUpload20Regular /> } onClick={ handleImport }>
					{ i18n.t("features.netscape_bookmarks.import") }
				</Button>
			</div>
		</div>
	);
}

const useStyles = makeStyles({
	root:
	{
		display: "flex",
		flexFlow: "column",
		gap: tokens.spacingVerticalMNudge
	},
	buttons:
	{
		display: "flex",
		flexWrap: "wrap",
		gap: tokens.spacingVerticalSNudge
	}
});
