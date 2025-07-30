import { useDialog } from "@/contexts/DialogProvider";
import WelcomeDialog from "../components/WelcomeDialog";
import { showWelcomeDialog } from "../utils/showWelcomeDialog";

export default function useWelcomeDialog(): void
{
	const dialog = useDialog();

	useEffect(() =>
	{
		showWelcomeDialog.getValue().then(showWelcome =>
		{
			if (showWelcome || import.meta.env.DEV)
				dialog.pushCustom(<WelcomeDialog />, undefined, () => showWelcomeDialog.removeValue());
		});
	}, []);
}
