import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Add "parser" explicitly for TypeScript support
  {
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 2020, // Specify the ECMAScript version
      sourceType: "module", // Use ES modules
      project: "./tsconfig.json", // Specify the path to your tsconfig.json
    },
    plugins: ["@typescript-eslint"], // Enable the TypeScript plugin
  },

  // Include Next.js and TypeScript configurations
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Add custom rules
  {
    rules: {
      "no-unused-vars": "off", // Disable no-unused-vars for JavaScript/TypeScript
      "@typescript-eslint/no-unused-vars": [
        "warn", // Use the TypeScript-specific rule for unused variables
        { vars: "all", args: "after-used", ignoreRestSiblings: true },
      ],
    },
  },
];

export default eslintConfig;
