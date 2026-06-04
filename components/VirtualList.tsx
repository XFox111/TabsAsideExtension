export default function VirtualList<T>(props: VirtualListProps<T>): React.ReactElement
{
	const [columns, setColumns] = useState<number>(1);
	const [rowsToRender, setRowsToRender] = useState<number>(0);
	const [rowIndex, setRowIndex] = useState<number>(0);
	const additionalRows = 3;

	const heights: number[] = useMemo(() =>
	{
		if (typeof props.itemHeight === "number")
			return props.items.map(() => props.itemHeight as number);

		return props.items.map(props.itemHeight);
	}, [props.items, props.itemHeight]);
	const minHeight: number = Math.min(...heights);

	const totalRows: number = Math.ceil(props.items.length / columns);
	const takeCount: number = rowsToRender * columns;

	const renderStartIndex: number = rowIndex * columns;
	const paddingTop: number = calculateHeight(heights, 0, rowIndex, columns);
	const paddingBottom: number = calculateHeight(heights, rowIndex + rowsToRender, totalRows, columns);

	const renderedItems = props.items.slice(renderStartIndex, renderStartIndex + takeCount);

	useEffect(() =>
	{
		const container = document.querySelector(props.containerSelector);

		const handleResize = (): void =>
		{
			if (!container)
				return;

			const newRowsToRender: number = Math.ceil(container.clientHeight / minHeight) + additionalRows;

			setRowsToRender(newRowsToRender);

			if (!props.columnMinWidth)
			{
				setColumns(1);
				return;
			}

			const newColumns: number = Math.floor((container.clientWidth - (props.horizontalOffset ?? 0)) / (props.columnMinWidth));
			setColumns(Math.max(1, newColumns));
		};
		handleResize();

		const handleScroll = (e: Event): void =>
		{
			const target = e.target as HTMLElement;
			const topOffset: number = target.scrollHeight - calculateHeight(heights, 0, totalRows, columns);
			const scrollTop: number = Math.max(0, target.scrollTop - topOffset);

			const newIndex: number = Math.floor(scrollTop / minHeight - Math.floor(additionalRows / 2));
			console.log("scroll", scrollTop, newIndex);
			setRowIndex(Math.max(0, newIndex));
		};
		container?.addEventListener("scroll", handleScroll);
		window.addEventListener("resize", handleResize);

		return () =>
		{
			container?.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", handleResize);
		};
	}, [totalRows, props.columnMinWidth, props.horizontalOffset, heights, columns]);

	return (
		<section tabIndex={ 0 } style={ { paddingTop, paddingBottom } } className={ props.className }>
			{ renderedItems.map((item, index) => props.itemRenderer(item, rowIndex * columns + index)) }
		</section>
	);
}

export type VirtualListProps<T> = {
	className?: string;
	itemHeight: number | ((item: T, index: number) => number);
	containerSelector: string;
	horizontalOffset?: number;
	columnMinWidth?: number;
	items: T[];
	itemRenderer: (item: T, index: number) => React.ReactElement;
};

function calculateHeight(heights: number[], rowStart: number, rowEnd: number, columns: number): number
{
	let height = 0;

	for (let i = rowStart; i < rowEnd; i++)
	{
		const rowHeights = heights.slice(i * columns, (i + 1) * columns);
		height += Math.max(...rowHeights);
	}

	return height;
}
