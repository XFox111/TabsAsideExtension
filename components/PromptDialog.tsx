import { useDangerStyles } from "@/hooks/useDangerStyles";
import { Button, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger } from "@fluentui/react-components";

export default function PromptDialog(props: PromptDialogProps): React.ReactElement
{
	const dangerCls = useDangerStyles();

	return (
		<DialogSurface>
			<DialogBody>

				<DialogTitle>{ props.title }</DialogTitle>

				<DialogContent>
					{ props.content }
				</DialogContent>

				<DialogActions>
					<DialogTrigger disableButtonEnhancement>
						<Button
							appearance="primary"
							className={ props.destructive ? dangerCls.buttonPrimary : undefined }
							onClick={ props.onConfirm }
						>
							{ props.confirmText }
						</Button>
					</DialogTrigger>
					<DialogTrigger disableButtonEnhancement>
						<Button appearance="subtle">
							{ props.cancelText ?? i18n.t("common.actions.cancel") }
						</Button>
					</DialogTrigger>
				</DialogActions>

			</DialogBody>
		</DialogSurface>
	);
}

export type PromptDialogProps =
	{
		title: string;
		content: React.ReactNode;
		confirmText: string;
		cancelText?: string;
		onConfirm: () => void;
		destructive?: boolean;
	};
