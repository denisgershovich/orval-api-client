import { defineConfig } from "orval";

export default defineConfig({
  project: {
    input: {
      target: "./swagger.yaml",
    },
    output: {
      target: "src/api/project/index.ts",
      schemas: "src/api/project/schemas",
      client: "react-query",
      httpClient: "axios",
      mode: "tags-split",
      override: {
        mutator: {
          path: "./src/lib/axios/axiosMutator.ts",
          name: "axiosMutator",
        },
        query: {
          useQuery: true,
          useInfinite: true,
          options: {
            staleTime: 10000,
          },
        },
      },
    },
  },
});
