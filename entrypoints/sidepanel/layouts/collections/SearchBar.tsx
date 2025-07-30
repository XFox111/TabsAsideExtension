import { Button, Input, makeStyles, tokens, Tooltip } from "@fluentui/react-components";
import { ArrowUndo20Filled, ArrowUndo20Regular, bundleIcon, Search20Regular } from "@fluentui/react-icons";
import { CollectionFilterType } from "../../utils/filterCollections";
import { CollectionSortMode } from "../../utils/sortCollections";
import FilterCollectionsButton from "./FilterCollectionsButton";
import SortCollectionsButton from "./SortCollectionsButton";

export default function SearchBar(props: SearchBarProps): React.ReactElement
{
	const cls = useStyles();

	const ResetIcon = bundleIcon(ArrowUndo20Filled, ArrowUndo20Regular);

	return (
		<Input
			className={ cls.root }
			appearance="filled-lighter"
			contentBefore={ <Search20Regular /> }
			placeholder={ i18n.t("main.list.searchbar.title") }
			value={ props.query } onChange={ (_, e) => props.onQueryChange?.(e.value) }
			contentAfter={
				<>
					{ (props.query || (props.filter && props.filter.length > 0)) &&
						<Tooltip relationship="label" content={ i18n.t("common.actions.reset_filters") }>
							<Button appearance="subtle" icon={ <ResetIcon /> } onClick={ props.onReset } />
						</Tooltip>
					}
					<FilterCollectionsButton value={ props.filter } onChange={ props.onFilterChange } />
					<SortCollectionsButton value={ props.sort } onChange={ props.onSortChange } />
				</>
			} />
	);
}

export type SearchBarProps =
	{
		query?: string;
		onQueryChange?: (query: string) => void;
		filter?: CollectionFilterType["colors"];
		onFilterChange?: (filter: CollectionFilterType["colors"]) => void;
		sort?: CollectionSortMode;
		onSortChange?: (sort: CollectionSortMode) => void;
		onReset?: () => void;
	};

const useStyles = makeStyles({
	root:
	{
		boxShadow: tokens.shadow2
	}
});
