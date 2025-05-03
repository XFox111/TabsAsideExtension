import { GraphicsStorage } from "@/models/CollectionModels";
import { defineExtensionMessaging, ExtensionMessenger } from "@webext-core/messaging";

type ProtocolMap =
	{
		addThumbnail(data: { url: string; thumbnail: string; }): void;
		getGraphicsCache(): GraphicsStorage;
		refreshCollections(): void;
	};

const protocol: ExtensionMessenger<ProtocolMap> = defineExtensionMessaging<ProtocolMap>();

export const onMessage = protocol.onMessage;

export const sendMessage: ExtensionMessenger<ProtocolMap>["sendMessage"] = async (...args) =>
{
	try
	{
		return await protocol.sendMessage(...args);
	}
	catch (ex)
	{
		console.error(ex);
		return undefined!;
	}
};
