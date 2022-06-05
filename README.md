### To use in SvelteKit project:

- Add as submodule to `packages/wp` folder.

  ```shell
  git submodule add git@github.com:nelson-tech/svelte-headless-wp.git packages/wp
  ```

- Add an API route

  ```typescript
  // src/routes/api/graphql.ts
  import type { RequestHandler } from "@sveltejs/kit"

  import proxy from "$wp/lib/proxy"

  export const post: RequestHandler = async (event) => await proxy(event)
  ```

- Add codegen scripts to `package.json`

  ```json
    "scripts": {
      ...
      "schema": "graphql-codegen --require dotenv/config --config ./packages/wp/graphql/getSchema.yaml",
      "gen": "graphql-codegen --config ./packages/wp/graphql/codegen.yaml",
      ...
    },
  ```

- Add dependencies

  ```shell
  yarn add -D @kitql/client @kitql/graphql-codegen dotenv
  ```

- Add `tsconfig.json` path alias
  ```json
  "compilerOptions": {
    "paths": {
      "$wp/*": ["packages/wp/*"]
    }
  }
  ```
- Add `svelte.config.js` path alias

  ```javascript
  import path from "path"
  ...
  export default {
    kit: {
      adapter: adapter(),
      vite: {
        resolve: {
          alias: {
            $wp: path.resolve("packages/wp"),
          },
        },
      },
    },
  }
  ```

- Call `apiInit` function from `$wp/lib/init.ts` in `__layout`

  ```html
  <!-- src/routes/__layout.svelte -->
  <script lang="ts" context="module">
  	...
  	import apiInit from "$wp/lib/init"

  	apiInit()
  	...
  </script>
  ```

- Add `.env` file with API host and url
  ```
  VITE_API_HOST=api.example.com
  VITE_API_URL=https://api.example.com/graphql
  ```
- Re-export KitQL Client for generated stores
  ```typescript
  // src/lib/api/kitQLClient.ts
  export { kitQLClient } from "$wp/client"
  ```
- _(Optional)_ Add ability to auto generate stores when `.gql` files are changed
  - Install plugin `yarn add -D @kitql/vite-plugin-watch-and-run`
  - Add config to `svelte.config.js`
    ```javascript
    import watchAndRun from "@kitql/vite-plugin-watch-and-run"
    ...
    export default {
      kit: {
        adapter: adapter(),
        vite: {
          plugins: [
            watchAndRun([
              {
                watch: "**/*.(gql|graphql)",
                run: "npm run gen",
              },
            ]),
          ],
        },
      },
    }
    ```
