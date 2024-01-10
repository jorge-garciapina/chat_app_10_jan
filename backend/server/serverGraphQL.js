// Importing necessary libraries and modules
const express = require("express");
const {ApolloServer, execute, subscribe} = require("apollo-server-express");
const http = require("http");
const ws = require("ws");
const {useServer} = require("graphql-ws/lib/use/ws");
const {makeExecutableSchema} = require("@graphql-tools/schema");
const {merge} = require("lodash");
const {mergeTypeDefs} = require("@graphql-tools/merge");
const cookieParser = require("cookie-parser"); // Include cookie-parser

// Importing Schemas, Resolvers, and DataSources
const authSchemas = require("./graphql/schemas/authSchemas.js");
const authResolvers = require("./graphql/resolvers/authResolvers.js");
const AuthService = require("./graphql/dataSources/authAPI.js");

const userSchemas = require("./graphql/schemas/userSchemas.js");
const userResolvers = require("./graphql/resolvers/userResolvers.js");
const UserService = require("./graphql/dataSources/userAPI.js");

const conversationSchemas = require("./graphql/schemas/conversationSchemas.js");
const conversationResolvers = require("./graphql/resolvers/conversationResolvers.js");
const ConversationService = require("./graphql/dataSources/conversationAPI.js");

// Import new Subscription related files
const subscriptionSchemas = require("./graphql/schemas/subscriptionSchemas.js");
const subscriptionResolvers = require("./graphql/resolvers/subscriptionResolvers.js");

// Creating an Executable Schema
// The schema is the cornerstone of any GraphQL API.
// Now includes SubscriptionSchemas and SubscriptionResolvers
const schema = makeExecutableSchema({
  typeDefs: mergeTypeDefs([
    authSchemas,
    userSchemas,
    conversationSchemas,
    subscriptionSchemas,
  ]),

  resolvers: merge(
    authResolvers,
    userResolvers,
    conversationResolvers,
    subscriptionResolvers,
  ),
});

// Initializing ApolloServer
// Now includes SubscriptionService in dataSources
const server = new ApolloServer({
  schema,
  context: ({req, res, connection}) => {
    // For WebSocket subscriptions, the context is different, so we check if it exists.
    if (connection) {
      return connection.context;
    } else {
      const token = req.cookies.authToken || "";

      return {res, req, token};
    }
  },
  dataSources: () => {
    return {
      authAPI: new AuthService(),
      userAPI: new UserService(),
      conversationAPI: new ConversationService(),
    };
  },
  formatError: (err) => {
    return {message: err.message};
  },
});
const startServer = async () => {
  // Starting the Server
  // This function initializes and starts both the HTTP and WebSocket servers.
  const app = express(); // Creating an instance of the Express application
  app.use(cookieParser()); // Use cookie-parser middleware
  await server.start(); // Starting the Apollo Server
  server.applyMiddleware({app, path: "/graphql"});

  // Creating an HTTP Server
  const httpServer = http.createServer(app);

  // Creating a WebSocket Server
  const wsServer = new ws.Server({
    server: httpServer, // Associating the WebSocket server with the HTTP server
    path: "/graphql", // Specifying the path for WebSocket connections
  });

  // Enabling GraphQL Subscriptions through WebSocket
  useServer(
    {
      schema,
      execute,
      subscribe,
      onConnect: (ctx) => console.log("Connected:", ctx),
      onDisconnect: (ctx) => console.log("Disconnected:", ctx),
    },
    wsServer,
  );

  // Starting the HTTP and WebSocket Servers
  const port = 4000;
  httpServer.listen({port: port}, () =>
    console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`),
  );
};

// Invoking the startServer function to start the server
startServer();
