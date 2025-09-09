import { DialogContextType } from "@/contexts/DialogProvider";
import SettingsReviewDialog from "../components/SettingsReviewDialog";
import { settingsForReview } from "../utils/showSettingsReviewDialog";

export default function useSettingsReviewDialog(dialog: DialogContextType): Promise<void>
{
	return new Promise<void>(res =>
	{
		settingsForReview.getValue().then(needsReview =>
		{
			if (needsReview.length > 0)
				dialog.pushCustom(
					<SettingsReviewDialog />,
					undefined,
					() =>
					{
						settingsForReview.removeValue();
						res();
					}
				);
			else
				res();
		});
	});
}
