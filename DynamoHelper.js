import dynamodbClient        from 'serverless-dynamodb-client';
import AWSSdk                from 'aws-sdk';
import AWSXRay               from 'aws-xray-sdk';
//
import Secrets               from './Secrets'

let dynamodb;
//console.log(process.env);

if (process.env.NODE_ENV === 'production') {
  const AWS = AWSXRay.captureAWS(AWSSdk);
  dynamodb = new AWS.DynamoDB.DocumentClient();
} else {
  dynamodb = dynamodbClient.doc;
}

class DynamoHelper {
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
    console.log('dydb put', key, item, params)
    return promisify(
      callback => (dynamodb.put(params, callback)),
      response => ({
        response,
        obj: item
      })
    )
  }

  list({ limit, cursor, select = 'ALL_ATTRIBUTES' }) {
    const params = {
      TableName:        this.table,
      Limit:            limit,
      Select:           select,
    }
    if (cursor) {
      params.ExclusiveStartKey = cursor
    }
    return promisify(
      callback => dynamodb.scan(params, callback),
      response => ({
        response,
        items:      response.Items,
        nextCursor: response.LastEvaluatedKey,
      })
    )
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

const promisify = (func, fixup) =>
  new Promise((resolve, reject) => {
    func((error, result) => {
      if (error) {
        console.log('DynamoHelper error:', error)
        reject(error);
      } else {
        resolve(fixup(result));
      }
    });
  });

export default DynamoHelper
