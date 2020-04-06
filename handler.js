'use strict';

import { ApolloServer } from 'apollo-server-lambda';
import { schema } from './schema';
import { resolvers } from './resolvers';

/* console.log("********** EnvVars **************************");
 * console.log(process.env.REACT_APP_GRAPHQL_ENDPOINT);
 * console.log(process.env.NODE_ENV);
 * console.log("************************************");
 *  */
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  //
  formatError: error => {
    console.log(error);
    return error;
  },
  //
  formatResponse: response => {
    return response;
  },
  //
  context: ({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context,
  }),
  playground: {
    endpoint: process.env.ENDPOINT
            ? process.env.ENDPOINT
            : '/prod/graphql',
  },
  tracing: true,
});


exports.graphqlHandler = server.createHandler({
  cors: {
    origin: '*',
  },
});
