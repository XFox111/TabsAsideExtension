import DialogProvider from "@/contexts/DialogProvider";
import ThemeProvider from "@/contexts/ThemeProvider";

const App: React.FC<React.PropsWithChildren> = ({ children }: React.PropsWithChildren) =>
	<ThemeProvider>
		<DialogProvider>
			{ children }
		</DialogProvider>
	</ThemeProvider>;

export default App;
