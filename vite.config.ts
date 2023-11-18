import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

import codegen from "vite-plugin-graphql-codegen";

import configCodegen from "./codegen";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      codegen({
        enableWatcher: true,
        config: {
          ...configCodegen,
          schema: [
            {
              [env.VITE_URL_GRAPHQL]: {
                headers: {
                  apiKey: env.VITE_KEY_PUBLIC,
                },
              },
            },
          ],
        },
      }),
      react({
        babel: {
          plugins: [
            [
              "babel-plugin-styled-components",
              {
                displayName: true,
                fileName: false,
              },
            ],
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        src: "/src",
      },
    },
  };
});
