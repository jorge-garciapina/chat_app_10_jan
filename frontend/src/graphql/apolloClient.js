// apolloClient.js
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  Observable,
  split,
} from "@apollo/client";
import {createClient} from "graphql-ws";
import {getMainDefinition} from "@apollo/client/utilities";

const API_ENDPOINT = "/graphql"; // Changed to relative path

const httpLink = new HttpLink({
  uri: API_ENDPOINT,
  credentials: "include", // Ensure cookies are sent with requests
});

// WebSocket link setup remains unchanged
const wsClient = createClient({
  url: "ws://localhost:4000/graphql", // This will be the same
  lazy: true,
  reconnect: true,
});

const wsLink = new ApolloLink((operation) => {
  return new Observable((observer) => {
    const dispose = wsClient.subscribe(
      {...operation, query: operation.query.loc?.source.body},
      {
        next: observer.next.bind(observer),
        error: observer.error.bind(observer),
        complete: observer.complete.bind(observer),
      }
    );
    return () => {
      dispose();
    };
  });
});

const splitLink = split(
  ({query}) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
