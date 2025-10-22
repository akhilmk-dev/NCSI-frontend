const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // Disable rules you intentionally want to bypass
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
      "react/jsx-key": "off",
      "@next/next/no-css-tags": "off",          // Disable warning for <link> in _document.js
      "@next/next/no-sync-scripts": "off",      // Disable error for synchronous <script>
    },
  },
];
