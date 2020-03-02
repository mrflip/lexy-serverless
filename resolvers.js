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
//console.log(process.env);

if (process.env.NODE_ENV === 'production') {
  const AWS = AWSXRay.captureAWS(AWSSdk);
  dynamodb = new AWS.DynamoDB.DocumentClient();
} else {
  dynamodb = dynamodbClient.doc;
}

const BEES_TABLE    = (process.env.beesTable || 'BEES_TABLE_NOT_IN_ENV')
const GUESSES_TABLE = (process.env.beesTable || 'BEES_TABLE_NOT_IN_ENV')

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
  bee_update({ letters, datestr, guesses, nogos }) {
    const bee    = {
      user_id: 'flip', letters, datestr, guesses, nogos
    }
    const params = {
      TableName: BEES_TABLE,
      Key:  { user_id: 'flip', letters },
      Item: bee,
    }
    return promisify(
      callback => (dynamodb.put(params, callback))
    ).then(result => {
      console.log("bee_update succ: ", result)
      return ({
        success: true,
        message: `Bee '${letters}' saved`,
        bee
      })
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
    const params = {
      TableName: BEES_TABLE,
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
      if (result.Count == 1) {
        return Bee.from(result.Items[0])
      } else {
        return null
      }
    });
  },

  bee_list({ limit, cursor }) {
    const params = {
      TableName:        BEES_TABLE,
      Limit:            limit,
      Select:           'ALL_ATTRIBUTES',
    }
    return promisify(callback => dynamodb.scan(params, callback)
    ).then(result => {
      console.log('bee_list', params, result)
      return ({
        bees: result.Items,
        cursor: result.LastEvaluatedKey,
      })
    })
  }
}


// eslint-disable-next-line import/prefer-default-export
export const resolvers = {
  Query: {
    bee_get:    (_, args) => data.bee_get(args),
    bee_list:   (_, args) => data.bee_list(args),
  },
  Mutation: {
    bee_update: (_, args) => data.bee_update(args),
  },
  DateTime: DateTimeResolver,
  JSON: JSONResolver,
  JSONObject: JSONObjectResolver,
};
