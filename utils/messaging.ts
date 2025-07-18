import { trackError } from "@/features/analytics";
import { GraphicsStorage } from "@/models/CollectionModels";
import { defineExtensionMessaging, ExtensionMessagingConfig, ExtensionMessenger, ExtensionSendMessageArgs, GetDataType, GetReturnType } from "@webext-core/messaging";

type ProtocolMap =
	{
		addThumbnail(data: { url: string; thumbnail: string; }): void;
		getGraphicsCache(): GraphicsStorage;
		refreshCollections(): void;
	};

function defineMessaging(config?: ExtensionMessagingConfig): ExtensionMessenger<ProtocolMap>
{
	const { onMessage, sendMessage, removeAllListeners }: ExtensionMessenger<ProtocolMap> = defineExtensionMessaging<ProtocolMap>(config);

	return {
		onMessage,
		removeAllListeners,
		async sendMessage<TType extends keyof ProtocolMap>(
			type: TType,
			data: GetDataType<ProtocolMap[TType]>,
			...args: ExtensionSendMessageArgs
		): Promise<GetReturnType<ProtocolMap[TType]>>
		{
			try
			{
				return await sendMessage(type, data, ...args);
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
