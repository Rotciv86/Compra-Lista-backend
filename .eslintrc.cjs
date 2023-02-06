module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["xo", "prettier"],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      extends: ["xo-typescript", "prettier"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      rules: {
        "no-implicit-coercion": "off",
        "@typescript-eslint/indent": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/consistent-type-definitions": [
          "error",
          {
            interface: "never",
          },
        ],
        "no-unused-vars": ["error"],
      },
    },
    {
      files: ["src/**/models/**/*.ts"],
      rules: {
        "@typescript-eslint/naming-convention": "off",
      },
    },
  ],
  parser: "babel-eslint",
  rules: {
    "no-implicit-coercion": "off",
  },
};
