import { pubSub } from "../utils/pubsub";

export interface ResolverContext extends Env {
    pubSub: typeof pubSub
  }