import { useDialog } from "@/contexts/DialogProvider";
import { useCollections } from "@/entrypoints/sidepanel/contexts/CollectionsProvider";
import { Button, makeStyles, tokens, Tooltip } from "@fluentui/react-components";
import { CollectionsAddRegular } from "@fluentui/react-icons";
import { ReactElement } from "react";
import EditDialog from "../../components/EditDialog";
import ActionButton from "./ActionButton";
import MoreButton from "./MoreButton";

export default function Header(): ReactElement
{
	const { addCollection } = useCollections();
	const dialog = useDialog();
	const cls = useStyles();

	const handleCreateCollection = () =>
		dialog.pushCustom(
			<EditDialog
				type="collection"
				onSave={ addCollection } />
		);

	return (
		<header className={ cls.header }>
			<ActionButton />

			<div className={ cls.headerSecondary }>
				<MoreButton />
				<Tooltip relationship="label" content={ i18n.t("main.header.create_collection") }>
					<Button
						appearance="subtle"
						icon={ <CollectionsAddRegular /> }
						onClick={ handleCreateCollection } />
				</Tooltip>
			</div>
		</header>
	);
}

const useStyles = makeStyles({
	header:
	{
		display: "flex",
		justifyContent: "space-between",
		padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalS}`,
		gap: tokens.spacingHorizontalS
	},
	headerSecondary:
	{
		display: "flex",
		gap: tokens.spacingHorizontalXS
	}
});
