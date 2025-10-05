import useStorageInfo from "@/hooks/useStorageInfo";
import { MessageBar, MessageBarBody, MessageBarProps, MessageBarTitle } from "@fluentui/react-components";

export default function StorageCapacityIssueMessage(props: MessageBarProps): React.ReactElement
{
	const { usedStorageRatio } = useStorageInfo();

	if (usedStorageRatio < 0.8)
		return <></>;

	return (
		<MessageBar intent="warning" layout="multiline" { ...props }>
			<MessageBarBody>
				<MessageBarTitle>
					{ i18n.t("storage_full_message.title", [(usedStorageRatio * 100).toFixed(1)]) }
				</MessageBarTitle>
				{ i18n.t("storage_full_message.message") }
			</MessageBarBody>
		</MessageBar>
	);
}
