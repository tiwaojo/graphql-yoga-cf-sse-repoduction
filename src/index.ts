import { createYoga, createSchema, createPubSub } from "graphql-yoga";
import { createContext } from "./utils/context";
import { ResolverContext } from "./types/types";
import { GraphQLError } from "graphql";
import { useGraphQLSSE } from "@graphql-yoga/plugin-graphql-sse";
import {
  preExecRule,
  postExecRule,
  directiveTypeDefs,
} from "@graphql-authz/core";
import { authZEnvelopPlugin } from "@graphql-authz/envelop-plugin";
import {
  authZDirective,
  authZGraphQLDirective,
} from "@graphql-authz/directive";

const { authZDirectiveTransformer } = authZDirective();

interface IContext {
  user?: {
    id: string;
    role: string;
  };
}

// rules
const IsAuthenticated = preExecRule({
  error: "User is not authenticated",
})((context: IContext) => !!context.user);

const IsAdmin = preExecRule({
  error: "User is not admin",
})((context: IContext) => context.user?.role === "Admin");

const authZRules = {
  IsAuthenticated,
  IsAdmin,
} as const;

const directive = authZGraphQLDirective(authZRules);
const authZDirectiveTypeDefs = directiveTypeDefs(directive);

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    // Create a Yoga instance with your schema
    const yoga = createYoga<ResolverContext>({
      context: createContext,
      schema: authZDirectiveTransformer(
        createSchema({
          typeDefs: /* GraphQL */ `
            ${authZDirectiveTypeDefs}
            type Query {
              message: String
            }
            type Mutation {
              createMessage(text: String!): String
            }
            type Subscription {
              newMessage: String
            }

            type User {
              id: ID!
              username: String!
              email: String! @authz(rules: [IsAdmin])
              posts: [Post!]!
            }

            type Post @authz(rules: [CanReadPost]) {
              id: ID!
              title: String!
              body: String!
              status: Status!
              author: User!
            }

            enum Status {
              draft
              public
            }

            type Query {
              users: [User!]! @authz(rules: [IsAuthenticated])
              posts: [Post!]!
              post(id: ID!): Post
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
                subscribe: async function* (
                  parent: unknown,
                  args: {},
                  context: ResolverContext
                ) {
                  const res = context.pubSub.subscribe("newMessage");
                  yield* res;
                },
                resolve: (payload: { text: string }) => {
                  return payload.text;
                },
              },
            },
          },
        })
      ),
      graphiql: { subscriptionsProtocol: "GRAPHQL_SSE" },
      plugins: [
        authZEnvelopPlugin({
          rules: authZRules,
        }),
        useGraphQLSSE({}),
      ],
    });

    return yoga.fetch(request);
  },
};
