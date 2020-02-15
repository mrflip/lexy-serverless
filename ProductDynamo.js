import dynamodb   from 'serverless-dynamodb-client';
import AWS  from 'aws-sdk';
// import AWSXRay from 'aws-xray-sdk';

// AWS.config.update({ region: 'us-east-1' });

console.log('Using dynamo in mode', process.env.NODE_ENV);
let docClient;
if (process.env.NODE_ENV === 'production') {
  // const AWS = AWSXRay.captureAWS(AWSSdk);
  docClient = new AWS.DynamoDB.DocumentClient();
} else if (process.env.NODE_ENV === 'development') {
  // const AWS = AWSXRay.captureAWS(AWSSdk);
  docClient = new AWS.DynamoDB.DocumentClient();
} else {
  docClient = dynamodb.doc;
}

const ProductDynamo = (
  { id, name, description, url, image_url, isKindOf, manufacturer, brand, brand_code, model_num, mpn, category, unspsc, nsn, gtin, upc, asin, condition, price}
) => { return (
  { id, name, description, url, image_url, isKindOf, manufacturer, brand, brand_code, model_num, mpn, category, unspsc, nsn, gtin, upc, asin, condition, price}
);
};

ProductDynamo.putProduct = (product) => {
  const dbParams = {
    TableName: 'Products',
    Item: product,
  };
  docClient.put(dbParams, (err, data) => {
    if (err) {
      console.error('Unable to add product', product.name, '. Error JSON:', JSON.stringify(err, null, 2));
    } else {
      console.log('PutItem succeeded:', process.env.NODE_ENV , product.name);
    }
  });
};

ProductDynamo.dumpProducts = () => {
  let params = {
    TableName: 'Products',
    Limit:     23,
    Select:    'ALL_ATTRIBUTES',
  };
  docClient.scan(params, function(err, data) {
    if (err) console.log(err); // an error occurred
    else     console.log(data); // successful response
  });
}

export default ProductDynamo;
