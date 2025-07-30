import { trackError } from "@/features/analytics";
import { PublicPath } from "wxt/browser";

export default async function sendNotification(props: NotificationProps): Promise<void>
{
	try
	{
		await browser.notifications.create({
			type: "basic",
			title: props.title,
			message: props.message,
			iconUrl: browser.runtime.getURL(props.icon)
		});
	}
	catch (ex)
	{
		console.error("Error while showing notification (probably because of user restrictions)");
		console.error(ex);
		trackError("notification_error", ex as Error);
	}
}

export type NotificationProps =
	{
		title: string;
		message: string;
		icon: PublicPath;
	};
