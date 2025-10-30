import resolveConflict from "@/features/collectionStorage/utils/resolveConflict";
import { Button, MessageBar, MessageBarActions, MessageBarBody, MessageBarProps, MessageBarTitle } from "@fluentui/react-components";
import { ArrowDownload20Regular, ArrowUpload20Regular, CloudArrowDown20Regular, Wrench20Regular } from "@fluentui/react-icons";
import { useCollections } from "../../../contexts/CollectionsProvider";
import exportData from "@/entrypoints/options/utils/exportData";

export default function CloudIssueMessages(props: MessageBarProps): React.ReactElement
{
	const { cloudIssue, refreshCollections } = useCollections();

	const overrideStorageWith = async (source: "local" | "sync") =>
	{
		await resolveConflict(source);
		await refreshCollections();
	};

	return (
		<>
			{ cloudIssue === "parse_error" &&
				<MessageBar intent="error" layout="multiline" { ...props }>
					<MessageBarBody>
						<MessageBarTitle>{ i18n.t("parse_error_message.title") }</MessageBarTitle>
						{ i18n.t("parse_error_message.message") }
					</MessageBarBody>
					<MessageBarActions>
						<Button icon={ <Wrench20Regular /> } onClick={ () => overrideStorageWith("local") }>
							{ i18n.t("parse_error_message.action") }
						</Button>
					</MessageBarActions>
				</MessageBar>
			}

			{ cloudIssue === "merge_conflict" &&
				<MessageBar intent="warning" layout="multiline" { ...props }>
					<MessageBarBody>
						<MessageBarTitle>{ i18n.t("merge_conflict_message.title") }</MessageBarTitle>
						{ i18n.t("merge_conflict_message.message") }
					</MessageBarBody>
					<MessageBarActions>
						<Button icon={ <ArrowDownload20Regular /> } onClick={ exportData }>
							{ i18n.t("options_page.storage.export") }
						</Button>
						<Button icon={ <ArrowUpload20Regular /> } onClick={ () => overrideStorageWith("local") }>
							{ i18n.t("merge_conflict_message.accept_local") }
						</Button>
						<Button icon={ <CloudArrowDown20Regular /> } onClick={ () => overrideStorageWith("sync") }>
							{ i18n.t("merge_conflict_message.accept_cloud") }
						</Button>
					</MessageBarActions>
				</MessageBar>
			}
		</>
	);
}
