import migrateLocalStorage from "../utils/migrateLocalStorage";

export default function useLocalMigration(): void
{
	useEffect(() =>
	{
		if (globalThis.localStorage?.getItem("sets"))
			migrateLocalStorage().then(() => document.location.reload());
	}, []);
}
