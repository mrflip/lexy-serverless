import dynamodb   from 'serverless-dynamodb-client';
import AWSSdk  from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk';

let docClient;
if (process.env.NODE_ENV === 'production') {
  const AWS = AWSXRay.captureAWS(AWSSdk);
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
  console.log(["!!!!!!!", this]);
  const dbParams = {
    TableName: 'Products',
    Item: product,
  };
  docClient.put(dbParams, (err, data) => {
    if (err) {
      console.error('Unable to add product', product.name, '. Error JSON:', JSON.stringify(err, null, 2));
    } else {
      console.log('PutItem succeeded:', product.name);
    }
  });
};

ProductDynamo.dumpProducts = () => {
  console.log("########");
  
  let params = {
    TableName: 'Products',
    Limit:     23,
    Select:    'ALL_ATTRIBUTES',
  };
  docClient.scan(params, function(err, data) {
    if (err) console.log(err); // an error occurred
    else console.log(data); // successful response
  });
}

export default ProductDynamo;
