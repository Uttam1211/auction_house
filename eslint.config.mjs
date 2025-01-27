import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import ts from "@typescript-eslint/eslint-plugin"; // Import the TypeScript plugin

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Add "parser" explicitly for TypeScript support
  {
    languageOptions: {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 2020, // Specify the ECMAScript version
        sourceType: "module", // Use ES modules
        project: "./tsconfig.json", // Specify the path to your tsconfig.json
      },
    },
    plugins: {
      "@typescript-eslint": ts, // Use the imported TypeScript plugin
    },
  },

  // Include Next.js and TypeScript configurations
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Add custom rules
  {
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react/no-unescaped-entities": "off",
    },
  },
  {
    ignores: [
      "node_modules/",
      ".next/",
      ".env",
      ".env.local",
      ".env.development.local",
      ".env.test.local",
      ".env.production.local",
      "**/*.mjs",
    ],
  },
];

export default eslintConfig;
