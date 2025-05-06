import { trackError } from "@/features/analytics";
import { GraphicsStorage } from "@/models/CollectionModels";
import { defineExtensionMessaging, ExtensionMessagingConfig, ExtensionMessenger } from "@webext-core/messaging";

type ProtocolMap =
	{
		addThumbnail(data: { url: string; thumbnail: string; }): void;
		getGraphicsCache(): GraphicsStorage;
		refreshCollections(): void;
	};

function defineMessaging(config?: ExtensionMessagingConfig): ExtensionMessenger<ProtocolMap>
{
	const { onMessage, sendMessage, removeAllListeners } = defineExtensionMessaging<ProtocolMap>(config);

	return {
		onMessage,
		removeAllListeners,
		sendMessage: async (type, data, args): Promise<any> =>
		{
			try
			{
				return await sendMessage(type, data, args);
			}
			catch (ex)
			{
				console.error(ex);
				trackError("messaging_error", ex as Error);
				return undefined!;
			}
		}
	};
}

export const { onMessage, sendMessage } = defineMessaging({ logger: console });
