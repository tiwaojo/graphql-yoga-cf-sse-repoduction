import { createDb } from "./db";
import { YogaInitialContext } from "graphql-yoga";
import { ResolverContext } from "../types/types";
import { pubSub } from "./pubsub";

export async function createContext(
  context: YogaInitialContext & ResolverContext
): Promise<YogaInitialContext & ResolverContext> {
  context.pubSub = pubSub;
  return context;
}