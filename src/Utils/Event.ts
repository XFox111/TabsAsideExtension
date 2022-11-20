export type EventHandler<S, T> = (sender: S, args: T) => void;

export default class Event<S = any, T = any>
{
	private _handlers: EventHandler<S, T>[] = [];

	public AddListener(handler: EventHandler<S, T>): void
	{
		this._handlers.push(handler);
	}

	public RemoveListener(handler: EventHandler<S, T>): void
	{
		this._handlers = this._handlers.filter(i => i !== handler);
	}

	public Invoke(sender: S, args: T): void
	{
		this._handlers.forEach(i => i(sender, args));
	}
}
