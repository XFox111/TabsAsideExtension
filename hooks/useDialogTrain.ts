import { DialogContextType, useDialog } from "@/contexts/DialogProvider";

export default function useDialogTrain(...dialogs: ((dialog: DialogContextType) => Promise<void>)[]): void
{
	const dialog = useDialog();

	useEffect(() =>
	{
		(async () =>
		{
			for (const item of dialogs)
			{
				await item(dialog);
				await new Promise(res => setTimeout(res, 250));
			}
		})();
	}, []);
}
