import sendNotification from "./sendNotification";

export default async function sendPartialSaveNotification(): Promise<void>
{
	await sendNotification({
		title: i18n.t("notifications.partial_save.title"),
		message: i18n.t("notifications.partial_save.message"),
		icon: "/notification_icons/save_warning.png"
	});
}
