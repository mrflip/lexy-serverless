'use strict';

import { ApolloServer } from 'apollo-server-lambda';
import { schema } from './schema';
import { resolvers } from './resolvers';

console.log("********** EnvVars **************************");
console.log(process.env.REACT_APP_GRAPHQL_ENDPOINT);
console.log(process.env.NODE_ENV);
const fs = require('fs'); const path = require('path');
console.log(__dirname);
console.log(fs.readFileSync('./schema.graphql', 'utf8').substring(1,60));
console.log("************************************");

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    formatError: error => {
      console.log(error);
      return error;
    },
    formatResponse: response => {
      console.log(response);
      return response;
    },
    context: ({ event, context }) => ({
      headers: event.headers,
      functionName: context.functionName,
      event,
      context,
    }),
    playground: {
      endpoint: process.env.REACT_APP_GRAPHQL_ENDPOINT
              ? process.env.REACT_APP_GRAPHQL_ENDPOINT
              : '/production/graphql',
    },
    tracing: true,
  });


  exports.graphqlHandler = server.createHandler({
    cors: {
      origin: '*',
    },
  });


  module.exports.hello = async event => {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
