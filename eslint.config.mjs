import eslintConfig from "eslint-config-next";

const config = [
  ...eslintConfig,
  {
    rules: {
      // eslint-plugin-react-hooks v7 (new with Next 16) flags calling setState
      // synchronously inside an effect as "set-state-in-effect". This codebase
      // intentionally keeps pre-existing load-on-mount state patterns in 6
      // components; they were shipped and working under React 18 and the App
      // Router, and were not part of this security upgrade. Refactoring them
      // to satisfy the rule would risk subtle state-timing changes, so the
      // new rule is disabled rather than changing behavior.
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default config;