import { track } from "@/features/analytics";
import { TabItem } from "@/models/CollectionModels";
import { Button, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Field, Input, makeStyles, tokens } from "@fluentui/react-components";

export default function TabEditDialog({ tab, onSave }: TabEditDialogProps): React.ReactElement
{
	const cls = useStyles();

	const [title, setTitle] = useState(tab.title ?? "");
	const [url, setUrl] = useState(tab.url);
	const isValid = useMemo(() => url.trim().length > 0, [url]);

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) =>
	{
		e.preventDefault();
		track("item_edited", { type: "tab" });
		onSave({
			...tab,
			title: title.trim().length > 0 ? title : undefined,
			url: url.trim()
		});
	};

	return (
		<DialogSurface>
			<form onSubmit={ onSubmit }>
				<DialogBody>
					<DialogTitle>{ i18n.t("dialogs.edit.title.edit_tab") }</DialogTitle>
					<DialogContent className={ cls.content }>
						<Input
							value={ title } onChange={ (_, e) => setTitle(e.value) }
							placeholder={ i18n.t("dialogs.edit.collection_title") } />
						<Field validationMessage={ isValid ? undefined : i18n.t("dialogs.edit.url_error") }>
							<Input
								value={ url } onChange={ (_, e) => setUrl(e.value) }
								placeholder="URL" />
						</Field>
					</DialogContent>

					<DialogActions>
						<DialogTrigger disableButtonEnhancement>
							<Button disabled={ !isValid } appearance="primary" as="button" type="submit">
								{ i18n.t("common.actions.save") }
							</Button>
						</DialogTrigger>
						<DialogTrigger disableButtonEnhancement>
							<Button appearance="subtle">{ i18n.t("common.actions.cancel") }</Button>
						</DialogTrigger>
					</DialogActions>
				</DialogBody>
			</form>
		</DialogSurface>
	);
}

const useStyles = makeStyles({
	content:
	{
		display: "flex",
		flexFlow: "column",
		gap: tokens.spacingVerticalMNudge
	}
});

export type TabEditDialogProps =
{
	tab: TabItem;
	onSave: (updatedTab: TabItem) => void;
};
