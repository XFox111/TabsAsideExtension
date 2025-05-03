import { FluentProvider, Theme, webDarkTheme, webLightTheme } from "@fluentui/react-components";
import { createContext } from "react";

const ThemeContext = createContext<ThemeContextType>({ theme: webLightTheme, isDark: false });
const media: MediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");

export default function ThemeProvider(props: React.PropsWithChildren): React.ReactElement
{
	const [isDark, setIsDark] = useState<boolean>(media.matches);
	const theme = useMemo(() => isDark ? webDarkTheme : webLightTheme, [isDark]);

	useEffect(() =>
	{
		const updateTheme = (args: MediaQueryListEvent) => setIsDark(args.matches);
		media.addEventListener("change", updateTheme);

		return () => media.removeEventListener("change", updateTheme);
	}, []);

	return (
		<ThemeContext.Provider value={ { theme, isDark } }>
			<FluentProvider theme={ theme }>
				{ props.children }
			</FluentProvider>
		</ThemeContext.Provider>
	);
}

export const useTheme = (): ThemeContextType => useContext(ThemeContext);

export type ThemeContextType =
	{
		theme: Theme;
		isDark: boolean;
	};
