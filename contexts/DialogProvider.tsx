import { Dialog, DialogModalType } from "@fluentui/react-components";
import { createContext, PropsWithChildren, ReactElement } from "react";
import PromptDialog, { PromptDialogProps } from "@/components/PromptDialog";

const DialogContext = createContext<DialogContextType>(null!);

export default function DialogProvider(props: PropsWithChildren): ReactElement
{
	const [dialog, setDialog] = useState<ReactElement | null>(null);
	const [modalType, setModalType] = useState<DialogModalType | undefined>(undefined);
	const [onDismiss, setOnDismiss] = useState<(() => void) | undefined>(undefined);

	const pushPrompt = (props: PromptDialogProps): void =>
		setDialog(
			<PromptDialog { ...props } />
		);

	const pushCustom = (dialogSurface: ReactElement, modalType?: DialogModalType, onDismiss?: () => void): void =>
	{
		setDialog(dialogSurface);
		setModalType(modalType);
		setOnDismiss(() => onDismiss);
	};

	const handleOpenChange = () =>
	{
		onDismiss?.();
		setOnDismiss(undefined);
		setTimeout(() => setDialog(null), 200);
	};

	return (
		<DialogContext.Provider value={ { pushPrompt, pushCustom } }>
			{ props.children }

			{ dialog &&
				<Dialog defaultOpen onOpenChange={ handleOpenChange } modalType={ modalType }>
					{ dialog }
				</Dialog>
			}
		</DialogContext.Provider>
	);
}

export const useDialog = () => useContext<DialogContextType>(DialogContext);

export type DialogContextType =
	{
		pushPrompt(props: PromptDialogProps): void;
		pushCustom(dialogSurface: ReactElement, modalType?: DialogModalType, onDismiss?: () => void): void;
	};
