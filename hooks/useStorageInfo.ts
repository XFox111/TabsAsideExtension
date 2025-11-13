export default function useStorageInfo(): StorageInfoHook
{
	const [bytesInUse, setBytesInUse] = useState<number>(0);

	useEffect(() =>
	{
		const updateValue = async () =>
			setBytesInUse(await browser.storage.sync.getBytesInUse());

		updateValue();
		browser.storage.sync.onChanged.addListener(updateValue);
		return () => browser.storage.sync.onChanged.removeListener(updateValue);
	}, []);

	return {
		bytesInUse,
		storageQuota: browser.storage.sync.QUOTA_BYTES ?? 102400,
		usedStorageRatio: bytesInUse / (browser.storage.sync.QUOTA_BYTES ?? 102400)
	};
}

export type StorageInfoHook =
	{
		bytesInUse: number;
		storageQuota: number;
		usedStorageRatio: number;
	};
