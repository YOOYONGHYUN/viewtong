import { defineConfig } from "orval";

export default defineConfig({
  viewtong: {
    input: { target: "https://staging.viewtongworld.com/docs-json" },
    output: {
      target: "./src/queries/index.ts",
      schemas: "./src/queries/model",
      mock: false,
      override: {
        mutator: {
          path: "src/lib/axios.ts",
          name: "customInstance",
        },
      },
      clean: true,
    },
  },
});
