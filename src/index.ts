import { createYoga, createSchema, createPubSub } from "graphql-yoga";
import { createContext } from "./utils/context";
import { ResolverContext } from "./types/types";
import { GraphQLError } from "graphql";
import { useGraphQLSSE } from "@graphql-yoga/plugin-graphql-sse";

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    // Create a Yoga instance with your schema
    const yoga = createYoga<ResolverContext>({
      context: createContext,
      schema: createSchema({
        typeDefs: /* GraphQL */ `
          type Query {
            message: String
          }
          type Mutation {
            createMessage(text: String!): String
          }
          type Subscription {
            newMessage: String!
          }
        `,
        resolvers: {
          Mutation: {
            async createMessage(
              parent: unknown,
              args: { text: string },
              context: ResolverContext
            ) {
              context.pubSub.publish("newMessage", {
                text: args.text,
              });

              return args.text;
            },
          },
          Subscription: {
            newMessage: {
              subscribe: (
                parent: unknown,
                args: {},
                context: ResolverContext
              ) => {
                const res = context.pubSub.subscribe("newMessage");
                return res;
              },
            },
          },
        },
      }),
      graphiql: { subscriptionsProtocol: "GRAPHQL_SSE" },
      plugins: [useGraphQLSSE({})],
    });

    return yoga.fetch(request);
  },
};
