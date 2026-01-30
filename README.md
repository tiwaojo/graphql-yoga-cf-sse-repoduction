# GQL-CF-SSE-Reproduction

## Getting Started

- Launch the workspace in VSCode via devcontainers. 
- Install dependencies via `pnpm i`
- Launch application via terminal. 
    ```bash
    pnpm run dev
    ``` 
- In 2 different browser tabs, navigate to `http://localhost:8787/graphql`
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