/**
 * Creates a logger function for a specific component.
 * The logger prepends a standardized prefix to all log messages,
 * indicating the component name for easier debugging.
 *
 * @param component - The name of the component to include in the log prefix.
 * @returns A logging function that accepts any number of arguments and logs them
 *          to the console with the component-specific prefix.
 */
export default function getLogger(component: string): (...data: any[]) => void
{
	return (...data: any[]): void => console.log(`[TabsAside.${component}]`, ...data);
}
