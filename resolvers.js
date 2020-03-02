// add to handler.js
import dynamodbClient        from 'serverless-dynamodb-client';
import AWSSdk                from 'aws-sdk';
import AWSXRay               from 'aws-xray-sdk';

import { GraphQLScalarType } from 'graphql';
import { Kind }              from 'graphql/language';
import { DateTimeResolver, JSONResolver, JSONObjectResolver,
}                            from 'graphql-scalars'
import Secrets               from './Secrets'
import Bee                   from '../lexy/lib/Bee'

let dynamodb;
// console.log(process.env.NODE_ENV);
// console.log(process.env);
if (process.env.NODE_ENV === 'production') {
  const AWS = AWSXRay.captureAWS(AWSSdk);
  dynamodb = new AWS.DynamoDB.DocumentClient();
} else {
  dynamodb = dynamodbClient.doc;
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

const data = {
  bee_update({ letters, datestr, guesses, nogos, ...rest }) {
    const bee =  { user_id: 'flip', letters, datestr, guesses, nogos }
    const params = {
      TableName: 'bees-dev',
      Key:  { user_id: 'flip', letters, },
      Item: bee,
    }
    console.log(params, rest)
    return promisify(
      callback => (dynamodb.put(params, callback))
    ).then(result => {
      console.log("bee_update succ: ", result)
      // const bee = { ...result.Attributes, letters, datestr, guesses, nogos }
      const ret = ({
        success: true,
        message: `Bee '${letters}' saved`,
        bee
      })
      console.log(ret)
      return ({ bee_update: ret, ...ret })
    }
    ).catch(error => {
      console.log("bee_update error:", error)
      return ({
        success: false,
        message: `bee_update error: ${JSON.stringify(error)}`,
      })
    })
  },

  bee_get({ letters }) {
    var params = {
      TableName: 'bees-dev',
      KeyConditionExpression: 'user_id = :uid AND letters = :letters', 
      ExpressionAttributeValues: { 
        ':letters': letters,
        ':uid':     'flip'
      },
      Limit: 1,
      Select: 'ALL_ATTRIBUTES',
    };
    return promisify(
      callback => dynamodb.query(params, callback)
    ).then(result => {
      console.log('bee_get', params, result)
      console.log(result.Items)
      return Bee.from(result.Items[0])
    });
  },

}


// eslint-disable-next-line import/prefer-default-export
export const resolvers = {
  Query: {
    bee_get:    (_, args) => data.bee_get(args),
  },
  Mutation: {
    bee_update: (_, args) => data.bee_update(args),
  },
  DateTime: DateTimeResolver,
  JSON: JSONResolver,
  JSONObject: JSONObjectResolver,
};
