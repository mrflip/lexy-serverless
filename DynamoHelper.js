import dynamodbClient        from 'serverless-dynamodb-client';
import AWSSdk                from 'aws-sdk';
import AWSXRay               from 'aws-xray-sdk';
//

let dynamodb;
//console.log(process.env);

if (process.env.LOCAL_DYNAMO === 'true') {
  console.log('Using Local Database')
  dynamodb = dynamodbClient.doc;
} else if (process.env.USE_XRAY === 'true') {
  const AWS = AWSXRay.captureAWS(AWSSdk);
  dynamodb = new AWS.DynamoDB.DocumentClient();
} else {
  dynamodb = new AWSSdk.DynamoDB.DocumentClient();
}

export const error_handler = (fn) => (
  (error) => {
    console.warn('Error Handler', error)
    return     ({
      success: false,
      message: `${fn} error: ${error} (${JSON.stringify(error)})`,
    })
  }
)

export class DynamoHelper {
  constructor (tbl) {
    this.table = tbl
  }

  del({ key }) {
    const params = {
      TableName:    this.table,
      Key:          key,
      ReturnValues: 'ALL_OLD',
    }
    return promisify(
      callback => dynamodb.delete(params, callback),
      response => ({
        response,
        obj: (response.Attributes || {})
    }))
  }

  put({ key, item }) {
    const params = {
      TableName: this.table,
      Item: item,
    }
    // console.log('dydb put', key, params)
    return promisify(
      callback => (dynamodb.put(params, callback)),
      response => ({
        response,
        obj: item
      }),
      params
    )
  }

  scan({ limit, cursor, db_index, select = 'ALL_ATTRIBUTES' }) {
    const params = {
      TableName:        this.table,
      Limit:            limit,
      Select:           select,
      IndexName:        db_index,
      ScanIndexForward: false,
    }
    if (cursor) {
      params.ExclusiveStartKey = cursor
    }
    console.log(params)
    return promisify(
      callback => dynamodb.scan(params, callback),
      response => ({
        response,
        items:      response.Items,
        nextCursor: response.LastEvaluatedKey,
      })
    )
  }

  list({ limit, cursor, key, db_index, sortRev, select = 'ALL_ATTRIBUTES' }) {
    const params = {
      TableName:                this.table,
      Limit:                    limit,
      Select:                   select,
      IndexName:                db_index,
      ScanIndexForward:         (! sortRev),
      KeyConditionExpression:   this.key_condition(key),
      ExpressionAttributeValues: this.attribute_values(key),
    }
    if (cursor) {
      params.ExclusiveStartKey = cursor
    }
    console.log(params, cursor)
    return new Promise((resolve, reject) => {
      dynamodb.query(params, (error, response) => {
        if (error) {
          console.log('DynamoHelper.get error:', error, 'key:', key, 'params:', params)
          reject(error)
        } else {
          // console.log(response)
          const resp_obj = {
            response,
            items:      response.Items,
            count:      response.Count,
            nextCursor: response.LastEvaluatedKey,
          }
          resolve(resp_obj)
        }
      })
    })
  }

  get({ key }) {
    const params = {
      TableName: this.table,
      KeyConditionExpression:    this.key_condition(key),
      ExpressionAttributeValues: this.attribute_values(key),
      Limit: 1,
      Select: 'ALL_ATTRIBUTES',
    }
    console.log(params)
    return new Promise((resolve, reject) => {
      dynamodb.query(params, (error, response) => {
        if (error) {
          console.log('DynamoHelper.get error:', error, 'key:', key, 'params:', params)
          reject(error)
        } else {
          const resp_obj = {
            response,
            obj:   response.Items[0],
            count: response.Count,
          }
          resolve(resp_obj)
        }
      })
    })
  }

  key_condition(attrs) {
    return Object.keys(attrs).map(name => `${name} = :${name}`).join(' AND ')
  }

  attribute_values(attrs) {
    return Object.fromEntries(
      Object.entries(attrs).map(([kk, vv]) => [`:${kk}`, vv]))
  }

}

const promisify = (func, fixup, params) =>
  new Promise((resolve, reject) => {
    func((error, result) => {
      if (error) {
        console.log('DynamoHelper error:', error, params)
        reject(error);
      } else {
        resolve(fixup(result));
      }
    });
  });

export default DynamoHelper
