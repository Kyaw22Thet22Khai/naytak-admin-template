import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-config-prettier";

/**
 * Flat ESLint config.
 *
 * `npm run lint` checks the project; `npm run lint:fix` applies what it can.
 * Formatting rules are deliberately left to Prettier (the `prettier` config at
 * the end switches off everything that would fight it).
 */
export default [
  { ignores: ["dist/**", "coverage/**", "node_modules/**", "public/**"] },

  js.configs.recommended,

  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: { ...globals.browser, ...globals.es2021 },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: "detect" } },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,

      // This project does not use PropTypes; component contracts are
      // documented in the JSDoc above each component.
      "react/prop-types": "off",

      // Unused arguments are often there for signature clarity; only flag
      // unused variables, and allow a leading underscore to opt out.
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // console.warn/error are used deliberately for real failures.
      "no-console": ["warn", { allow: ["warn", "error"] }],

      eqeqeq: ["error", "smart"],
    },
  },

  // Node-side files (Vite config, build plugins).
  {
    files: ["vite.config.js", "plugins/**/*.js", "eslint.config.js"],
    languageOptions: { globals: { ...globals.node } },
  },

  // Tests get the Vitest globals enabled in vite.config.
  {
    files: ["**/*.test.{js,jsx}", "src/setupTests.js"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, ...globals.vitest },
    },
  },

  prettier,
];
