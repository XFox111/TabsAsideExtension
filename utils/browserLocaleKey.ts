const browserLocaleKey: "firefox" | "edge" | "chrome" =
	import.meta.env.FIREFOX ?
		"firefox" :
		import.meta.env.EDGE ?
			"edge" :
			"chrome";

export default browserLocaleKey;
