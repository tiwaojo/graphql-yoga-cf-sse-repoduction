import { createPubSub } from "graphql-yoga";

export type PubSubChannels = {
  newMessage: [
    payload: {
      text: string;
    },
  ];
};

export const pubSub = createPubSub<PubSubChannels>();