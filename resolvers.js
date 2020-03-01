// add to handler.js
import dynamodb              from 'serverless-dynamodb-client';
import AWSSdk                from 'aws-sdk';
import AWSXRay               from 'aws-xray-sdk';

import { GraphQLScalarType } from 'graphql';
import { Kind }              from 'graphql/language';

import Secrets               from './Secrets'

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
//const makeGuess = ({ bee_ltrs, word, user_id }) => (
//  )

const makeProduct = (
  { id, name, description, url, image_url, isKindOf, manufacturer, category, mpn, nsn, gtin, brand}
) => {
  brand = "v1";
  return (
  { id, name, description, url, image_url, isKindOf, manufacturer, category, mpn, nsn, gtin, brand }
); };

const data = {
  bee_update({user_id, bee}) {
  }  
    
  
  product_amz_search({limit, term, nextToken, ...rest}) {
    amzClient.itemSearch({
      director:      'Quentin Tarantino',
      searchIndex:   'DVD',
      responseGroup: 'ItemAttributes,Images',
    }).then(result => {
      console.log("product_amz_search result: ", result);
      return { items: [], }
    }).catch(error => {
      console.log("product_amz_search error: ", error, error.Error[0])
    })
  },

  product_list_page(args) {
    return promisify(callback => {
      console.log("ARGS");
      console.log(args)
      const params = {
        TableName: 'products-dev',
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
        prodList = { products: [], };
      }
      //
      result.Items.forEach((product) => {
        prod_items.push(makeProduct(product));
      });
      //
      prodList.products = prod_items;
      if (result.LastEvaluatedKey) {
        prodList.nextToken = {
          id: result.LastEvaluatedKey.id
        }
      }
      return prodList;
    });
  },


}


// eslint-disable-next-line import/prefer-default-export
export const resolvers = {
  Query: {
    product_list_page: (root, args) => data.product_list_page(args),
    product_amz_search: (root, args) => data.product_amz_search(args),
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
