import sendNotification from "./sendNotification";
import { settings } from "./settings";

export default async function sendPartialSaveNotification(): Promise<void>
{
	if (await settings.showPartialSaveNotification.getValue())
		await sendNotification({
			title: i18n.t("notifications.partial_save.title"),
			message: i18n.t("notifications.partial_save.message"),
			icon: "/notification_icons/save_warning.png"
		});
}
