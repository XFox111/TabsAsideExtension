import { settings } from "@/utils/settings";

export default function useSettings<K extends keyof typeof settings>(key: K): SettingsHook<K>
{
	const [value, setValue] = useState<SettingsValue<K> | null>(null);

	useEffect(() =>
	{
		settings[key].getValue()
			.then(value => setValue(value as SettingsValue<K>));

		const unwatch = settings[key].watch(value => setValue(value as SettingsValue<K>));

		return () => unwatch();
	}, [key]);

	return [value, settings[key].setValue] as SettingsHook<K>;
}

export type SettingsValue<K extends keyof typeof settings> =
	typeof settings[K] extends { fallback: infer T; } ? T : never;

export type SettingsHook<K extends keyof typeof settings> =
	[SettingsValue<K> | null, (newValue: SettingsValue<K>) => Promise<void>];
