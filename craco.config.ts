// Craco config file
// Craco is used to separate content and background scripts from the main JS bundle

export default
{
	webpack:
	{
		configure: (webpackConfig : any, { env, paths } : IEnvironment) =>
		{
			return {
				...webpackConfig,
				entry:
				{
					main: [ env === "development" && require.resolve("react-dev-utils/webpackHotDevClient"), paths.appIndexJs ].filter(Boolean),
					background: "./src/Services/BackgroundService.ts",
					contentScript: "./src/Services/ContentService.ts"
				},
				output:
				{
					...webpackConfig.output,
					filename: "static/js/[name].js",
				}
			}
		}
	}
}

interface IEnvironment
{
	env: string;
	paths:
	{
		[key: string]: string | string[]
	};
}
