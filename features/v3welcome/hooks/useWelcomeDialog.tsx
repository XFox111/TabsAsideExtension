import { DialogContextType } from "@/contexts/DialogProvider";
import WelcomeDialog from "../components/WelcomeDialog";
import { showWelcomeDialog } from "../utils/showWelcomeDialog";

export default function useWelcomeDialog(dialog: DialogContextType): Promise<void>
{
	return new Promise<void>(res =>
	{
		showWelcomeDialog.getValue().then(showWelcome =>
		{
			if (showWelcome || import.meta.env.DEV)
				dialog.pushCustom(
					<WelcomeDialog />,
					undefined,
					() =>
					{
						showWelcomeDialog.removeValue();
						res();
					}
				);
			else
				res();
		});
	});
}
