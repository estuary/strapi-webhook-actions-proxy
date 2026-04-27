const js = require("@eslint/js");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const prettierPlugin = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");

module.exports = [
    js.configs.recommended,
    {
        files: ["src/**/*.ts"],
        languageOptions: {
            parser: tsParser,
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
            prettier: prettierPlugin,
        },
        rules: {
            ...tsPlugin.configs["eslint-recommended"].overrides[0].rules,
            ...tsPlugin.configs.recommended.rules,
            ...prettierConfig.rules,
            "prettier/prettier": "error",
        },
    },
    {
        ignores: ["build/**"],
    },
];
