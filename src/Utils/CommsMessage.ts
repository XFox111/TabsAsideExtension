import { SaveActions } from "../Models/Data/SettingsTypes";

export class CommsMessage
{
	public static readonly THUMBNAIL_ACQUIRED: string = "thumbnail_acquired";
	public static readonly SCROLL_REPORTED: string = "scroll_reported";
	public static readonly SAVE_TABS_REQUESTED: string = "save_tabs_requested";

	public Command: string;
	public Values: Record<string, string>;

	constructor(command: string)
	{
		this.Command = command;
		this.Values = { };
	}
}

export class ThumbnailAcquiredMessage extends CommsMessage
{
	constructor(url: string, thumbnail: string)
	{
		super(CommsMessage.THUMBNAIL_ACQUIRED);

		this.Values["url"] = url;
		this.Values["image"] = thumbnail;
	}

	public static GetUrl(msg: CommsMessage): string
	{
		return msg.Values["url"];
	}

	public static GetImage(msg: CommsMessage): string
	{
		return msg.Values["image"];
	}
}

export class SaveTabsRequestedMessage extends CommsMessage
{
	constructor(action: SaveActions)
	{
		super(CommsMessage.SAVE_TABS_REQUESTED);

		this.Values["action"] = action;
	}

	public static GetAction(msg: CommsMessage): SaveActions
	{
		return msg.Values["action"] as SaveActions;
	}
}
