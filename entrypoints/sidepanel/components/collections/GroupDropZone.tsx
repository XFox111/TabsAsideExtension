import { useDroppable } from "@dnd-kit/core";
import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import GroupContext, { GroupContextType } from "../../contexts/GroupContext";

export default function GroupDropZone({ disabled, ...props }: DropZoneProps): React.ReactElement
{
	const { group, indices } = useContext<GroupContextType>(GroupContext);
	const id: string = indices.join("/") + "_dropzone";
	const { isOver, setNodeRef, active } = useDroppable({ id, data: { indices, item: group }, disabled });

	const isDragging = !disabled && active !== null;
	const cls = useStyles();

	return (
		<div
			ref={ isDragging ? setNodeRef : undefined } { ...props }
			className={ mergeClasses(cls.root, isDragging && cls.dragging, isOver && cls.over, props.className) }
		>
			{ props.children }
		</div>
	);
}

export type DropZoneProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
	& {
		disabled?: boolean;
	};

const useStyles = makeStyles({
	root:
	{
		borderRadius: tokens.borderRadiusLarge,
		borderTopRightRadius: tokens.borderRadiusNone,
		border: `${tokens.strokeWidthThin} solid transparent`
	},
	over:
	{
		backgroundColor: tokens.colorBrandBackground2,
		border: `${tokens.strokeWidthThin} solid ${tokens.colorBrandStroke1}`
	},
	dragging:
	{
		border: `${tokens.strokeWidthThin} dashed ${tokens.colorNeutralStroke1}`
	}
});
