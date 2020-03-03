// add to handler.js
import dynamodbClient        from 'serverless-dynamodb-client';
import AWSSdk                from 'aws-sdk';
import AWSXRay               from 'aws-xray-sdk';

import { GraphQLScalarType } from 'graphql';
import { Kind }              from 'graphql/language';
import { DateTimeResolver, JSONResolver, JSONObjectResolver,
}                            from 'graphql-scalars'
import Secrets               from './Secrets'
import Bee                   from '../lexy/src/lib/Bee'
import _                     from 'lodash'

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
const USER_ID = 'flip'

// add to handler.js
const promisify = foo =>
  new Promise((resolve, reject) => {
    foo((error, result) => {
      if (error) {
        console.log("**** OH NOES ****", error);
        reject(error);
        console.log("================");
      } else {
        resolve(result);
      }
    });
  });

const data = {
  bee_put({ letters, datestr, guesses = [], nogos = [] }) {
    const bee    = {
      user_id: USER_ID, letters, datestr, guesses, nogos
    }
    const params = {
      TableName: BEES_TABLE,
      Key:  { user_id: USER_ID, letters },
      Item: bee,
    }
    return promisify(
      callback => (dynamodb.put(params, callback))
    ).then(result => {
      console.log("bee_put succ: ", result)
      return ({
        success: true,
        message: `Bee '${letters}' saved`,
        bee
      })
    }
    ).catch(error => {
      console.log("bee_put error:", error)
      return ({
        success: false,
        message: `bee_put error: ${JSON.stringify(error)}`,
      })
    })
  },

  bee_del({ letters }) {
    const params = {
      TableName: BEES_TABLE,
      Key: { user_id: USER_ID, letters },
      ReturnValues: 'ALL_OLD',
    }
    return promisify(
      callback => dynamodb.delete(params, callback)
    ).then(result => {
      console.log('bee_del', params, result)
      const { datestr, guesses = [], nogos = [] } = (result.Attributes || {})
      const ret = ({
        success: true,
        message: `Bee '${letters}' removed`,
        bee:     { letters, datestr, guesses, nogos },
      })
      console.log('bd ret', ret)
      return ret
    })
  },

  bee_get({ letters }) {
    const params = {
      TableName: BEES_TABLE,
      KeyConditionExpression: 'user_id = :uid AND letters = :letters', 
      ExpressionAttributeValues: { 
        ':letters': letters,
        ':uid':     USER_ID
      },
      Limit: 1,
      Select: 'ALL_ATTRIBUTES',
    };
    return promisify(
      callback => dynamodb.query(params, callback)
    ).then(result => {
      console.log('bee_get', params, result)
      if (result.Count == 1) {
        const ret = Bee.from(result.Items[0]).serialize()
        console.log('bg ret', ret)
        return ret
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
    if (cursor) {
      params.ExclusiveStartKey = {
        user_id: USER_ID,
        letters: cursor,
      }
    }
    return promisify(callback => dynamodb.scan(params, callback)
    ).then(result => {
      console.log('bee_list post', params, result, cursor)
      let cur_ltrs
      if (result.LastEvaluatedKey) { cur_ltrs = result.LastEvaluatedKey.letters }
      const ret = ({
        bees: result.Items,
        cursor: cur_ltrs,
      })
      return ret        
    }).catch(error => {
      console.log("bee_list error:", error)
      return ({
        success: false,
        message: `bee_list error: ${JSON.stringify(error)}`,
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
    bee_put: (_, args) => data.bee_put(args),
    bee_del: (_, args) => data.bee_del(args),
  },
  DateTime: DateTimeResolver,
  JSON: JSONResolver,
  JSONObject: JSONObjectResolver,
};
