export default function trackError(name: string, error: Error): void
{
	analytics.track(name, {
		name: error.name,
		message: error.message,
		stack: error.stack ?? "no_stack"
	});
}
