import { CracoConfig, CracoContext } from "@craco/craco";
import HtmlWebapckPlugin, { MinifyOptions } from "html-webpack-plugin";
import { Configuration, EntryObject } from "webpack";

// Extension build settings. Modify these as needed.
const extensionBuildConfig : IExtensionBuildConfig =
{
	useOptionsPage: true,
	optionsTemplate: null,	// public/index.html will be used as default template
	backgroundScript: "./src/Services/BackgroundService.ts",
	contentScript: "./src/Services/ContentService.ts",
}

// Craco config file
// Craco is used to separate content and background scripts from the main JS bundle
const cracoConfig : CracoConfig =
{
	webpack:
	{
		configure: (webpackConfig : Configuration, { env, paths } : CracoContext) : Configuration =>
		{
			const isProduction : boolean = env === "production";
			let entry : EntryObject = {};

			if (extensionBuildConfig.useOptionsPage)
				entry.options = "./src/options.tsx";

			if (extensionBuildConfig.backgroundScript)
				entry.background = extensionBuildConfig.backgroundScript;

			if (extensionBuildConfig.contentScript)
				entry.contentScript = extensionBuildConfig.contentScript;

			const config : Configuration =
			{
				...webpackConfig,
				entry:
				{
					main: paths.appIndexJs,
					...entry
				},
				output:
				{
					...webpackConfig.output,
					filename: "static/js/[name].js"
				},
				optimization:
				{
					...webpackConfig.optimization,
					splitChunks: { cacheGroups: { default: false } },
					runtimeChunk: false
				}
			};

			const minifyOptions : MinifyOptions =
			{
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true
			};

			config.plugins = config.plugins?.filter((plugin : any) => plugin.constructor.name !== "HtmlWebpackPlugin") ?? [];

			config.plugins.push(new HtmlWebapckPlugin({
				inject: true,
				chunks: [ "main" ],
				template: paths.appHtml,
				filename: "index.html",
				minify: isProduction && minifyOptions
			}));

			if (extensionBuildConfig.useOptionsPage)
				config.plugins.push(new HtmlWebapckPlugin({
					inject: true,
					chunks: [ "options" ],
					template: extensionBuildConfig.optionsTemplate ?? paths.appHtml,
					filename: "options.html",
					minify: isProduction && minifyOptions
				}));

			return config;
		}
	}
};

export default cracoConfig;

interface IExtensionBuildConfig
{
	useOptionsPage: boolean;
	optionsTemplate?: string | null;
	backgroundScript?: string | null;
	contentScript?: string | null;
}
