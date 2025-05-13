# GQL-CF-SSE-Reproduction

## Getting Started

- Launch the workspace in VSCode via devcontainers. 
- Install dependencies via `pnpm i`
- Create a db and setup via [Hyperdrive](https://developers.cloudflare.com/hyperdrive/)
    - Add the connection string to `.dev.vars` with a key of `DATABASE_URL` (This is for Kysely Codegen)
- Launch application via terminal. 
    E.g.
    ```bash
    WRANGLER_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE=postgresql://neondb_user:my_password@host/db?sslmode=require pnpm run dev
    ``` 
- In 2 different tabs, navigate to `http://localhost:8787/graphql`
    - Add a subscription with the following in Tab1 and execute the query
    ```graphql
    subscription newmessage {
        newMessage
    }
    ```
    - Add a mutation query with the following in tab2 and execute:
    ```graphql
    mutation my_mutation {
        createMessage(text: "lorem Ipsum")
    }
    ```
    - Observe the error response in tab1 and the terminal with the subscription query