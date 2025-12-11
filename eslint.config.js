import css from "@eslint/css";
import js from "@eslint/js";
import json from "@eslint/json";
import stylistic from "@stylistic/eslint-plugin";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
	{
		ignores: [".wxt/", ".output/"]
	},
	{ files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], plugins: { js }, extends: ["js/recommended"] },
	{ files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], languageOptions: { globals: globals.browser } },
	{ files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], extends: [tseslint.configs.recommended] },
	{ files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], extends: [pluginReact.configs.flat.recommended] },
	{ files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], extends: [stylistic.configs.recommended] },
	{ files: ["**/*.css"], plugins: { css }, language: "css/css", extends: ["css/recommended"] },
	{
		files: ["**/*.{jsonc,json}"],
		ignores: [".devcontainer/devcontainer.json", "package-lock.json"],
		plugins: { json },
		language: "json/jsonc",
		extends: ["json/recommended"]
	},
	{
		files: ["**/*.json"],
		ignores: [".devcontainer/devcontainer.json", "package-lock.json"],
		plugins: { json },
		language: "json/json",
		extends: ["json/recommended"]
	},
	{
		files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
		settings:
		{
			react:
			{
				version: "detect"
			}
		}
	},
	{
		files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
		plugins: {
			"@stylistic": stylistic
		},
		rules:
		{
			"@stylistic/semi": ["error", "always"],
			"@stylistic/block-spacing": ["warn", "always"],
			"@stylistic/arrow-spacing": ["warn", { before: true, after: true }],
			"@stylistic/indent": ["warn", "tab", { assignmentOperator: "off" }],
			"@stylistic/quotes": ["error", "double"],
			"@stylistic/comma-spacing": ["warn"],
			"@stylistic/comma-dangle": ["warn", "never"],
			"@stylistic/no-tabs": ["warn", { allowIndentationTabs: true }],
			"@stylistic/brace-style": ["warn", "allman", { allowSingleLine: true }],
			"@stylistic/member-delimiter-style": ["error", { multiline: { delimiter: "semi", requireLast: true }, singleline: { delimiter: "semi", requireLast: true } }],
			"@stylistic/jsx-curly-spacing": ["warn", { when: "always", children: true, attributes: true }],
			"react/react-in-jsx-scope": ["off"],
			"@stylistic/jsx-indent-props": ["warn", "tab"],
			"@stylistic/jsx-max-props-per-line": ["off"],
			"@stylistic/indent-binary-ops": ["warn", "tab"],
			"@stylistic/no-multiple-empty-lines": ["warn"],
			"@stylistic/operator-linebreak": ["off"],
			"@stylistic/jsx-wrap-multilines": ["off"],
			"@typescript-eslint/no-explicit-any": ["off"],
			"@stylistic/jsx-curly-newline": ["off"],
			"@stylistic/jsx-tag-spacing":
				[
					"warn",
					{ closingSlash: "never", beforeSelfClosing: "always", afterOpening: "never" }
				],
			"@stylistic/jsx-closing-bracket-location":
				[
					"warn",
					{ nonEmpty: "tag-aligned", selfClosing: "after-props" }
				],
			"@stylistic/jsx-first-prop-new-line": ["warn", "multiline"],
			"@stylistic/jsx-one-expression-per-line": ["off"],
			"@stylistic/jsx-closing-tag-location": ["warn"],
			"@stylistic/arrow-parens": ["off"],
			"@stylistic/quote-props": ["off"],
			"@stylistic/multiline-ternary": ["warn"],
			"@stylistic/no-trailing-spaces": ["warn"],
			"@stylistic/no-mixed-spaces-and-tabs": ["warn"],
			"@typescript-eslint/no-unused-vars": ["warn"],
			"prefer-const": ["warn"],
			"@stylistic/padded-blocks": ["warn"],
			"no-empty": ["off"],
			"@stylistic/eol-last": ["warn"]
		}
	},
	{
		files: ["**/*.css"],
		plugins: { css },
		rules:
		{
			"css/use-baseline": ["off"]
		}
	}
]);
