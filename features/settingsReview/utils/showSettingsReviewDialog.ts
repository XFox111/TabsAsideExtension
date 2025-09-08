export const settingsForReview = storage.defineItem<string[]>(
	"local:settingsForReview",
	{
		fallback: []
	}
);
