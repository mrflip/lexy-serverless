// add to handler.js
import dynamodb              from 'serverless-dynamodb-client';
import AWSSdk  from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk';

import { GraphQLScalarType } from 'graphql';
import { Kind }              from 'graphql/language';

let docClient;

// console.log(process.env.NODE_ENV);
// console.log(process.env);

if (process.env.NODE_ENV === 'production') {
  const AWS = AWSXRay.captureAWS(AWSSdk);
  docClient = new AWS.DynamoDB.DocumentClient();
} else {
  docClient = dynamodb.doc;
}

// add to handler.js
const promisify = foo =>
  new Promise((resolve, reject) => {
    foo((error, result) => {
      if (error) {
        console.log("**** OH NOES ****");
        reject(error);
        console.log("================");
      } else {
        resolve(result);
      }
    });
  });

const makeProduct = (
  { id, name, description, url, image_url, isKindOf, manufacturer, category, mpn, nsn, gtin, brand}
) => { return (
  { id, name, description, url, image_url, isKindOf, manufacturer, category, mpn, nsn, gtin, brand}
); };

const data = {
  getProducts(args) {
    return promisify(callback => {
      console.log("ARGS");
      console.log(args)
      const params = {
        TableName: 'Products',
        Limit: args.limit,
        Select: 'ALL_ATTRIBUTES',
      };
      console.log("HERE!!!!!");
      docClient.scan(params, callback);
    }).then(result => {
      const prod_items = [];
      let prodList;
      //
      if (result.Items.length >= 1) {
        prodList = { items: [], };
      }
      //
      result.Items.forEach((product) => {
        prod_items.push(makeProduct(product));
      });
      //
      prodList.items = prod_items;
      if (result.LastEvaluatedKey) {
        prodList.nextToken = {
          id: result.LastEvaluatedKey.id
        }
      }
      return prodList;
    });
  },

  getPaginatedTweets(handle, args) {
    return promisify(callback => {
      const params = {
        TableName: 'Tweets',
        KeyConditionExpression: 'handle = :v1',
        ExpressionAttributeValues: {
          ':v1': handle,
        },
        IndexName: 'tweet-index',
        Limit: args.limit,
        ScanIndexForward: false,
      };

      if (args.nextToken) {
        params.ExclusiveStartKey
        = {
          tweet_id: args.nextToken.tweet_id,
          created_at: args.nextToken.created_at,
          handle: handle,
        };
      }

      docClient.query(params, callback);
    }).then(result => {
      const tweets = [];
      let listOfTweets;

      console.log(result);

      if (result.Items.length >= 1) {
        listOfTweets = {
          items: [],
        };
      }

      for (let i = 0; i < result.Items.length; i += 1) {
        tweets.push({
          tweet_id: result.Items[i].tweet_id,
          created_at: result.Items[i].created_at,
          handle: result.Items[i].handle,
          tweet: result.Items[i].tweet,
          retweet_count: result.Items[i].retweet_count,
          retweeted: result.Items[i].retweeted,
          favorited: result.Items[i].favorited,
        });
      }

      listOfTweets.items = tweets;

      if (result.LastEvaluatedKey) {
        listOfTweets.nextToken = {
          tweet_id: result.LastEvaluatedKey.tweet_id,
          created_at: result.LastEvaluatedKey.created_at,
          handle: result.LastEvaluatedKey.handle,
        };
      }

      return listOfTweets;
    });
  },

  getUserInfo(args) {
    return promisify(callback =>
      docClient.query(
        {
          TableName: 'Users',
          KeyConditionExpression: 'handle = :v1',
          ExpressionAttributeValues: {
            ':v1': args.handle,
          },
        },
        callback
      )
    ).then(result => {
      let listOfTweets;

      if (result.Items.length >= 1) {
        listOfTweets = {
          name: result.Items[0].name,
          handle: result.Items[0].handle,
          location: result.Items[0].location,
          description: result.Items[0].description,
          followers_count: result.Items[0].followers_count,
          friends_count: result.Items[0].friends_count,
          favourites_count: result.Items[0].favourites_count,
          following: result.Items[0].following,
        };
      }
      return listOfTweets;
    });
  },
};
// eslint-disable-next-line import/prefer-default-export
export const resolvers = {
  Query: {
    getUserInfo: (root, args) => data.getUserInfo(args),
    getProducts: (root, args) => data.getProducts(args),
  },
  User: {
    tweets: (obj, args) => data.getPaginatedTweets(obj.handle, args),
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value) // ast value is always in string format
      }
      return null;
    },
  }),
};
