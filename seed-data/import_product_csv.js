import Papa from 'papaparse';
import fs from 'fs';
import ProductDynamo from "../ProductDynamo.js";

const affiliate_code = "mrflip-20";

// Clean up numbers-in-string-fields
const equals_stripper_re = /^="(.*)"$/;
const equals_stripper = (str) => {
  if (!(typeof(str) === 'string')) { return str; };
  return str.replace(equals_stripper_re, (mm, value) => value);
}

// Extract fields
const makeProduct = (order_item) => {
  Object.entries(order_item).forEach(([kk, vv], ii) => {
    order_item[kk] = equals_stripper(vv);
  });
  const prod = {};
  prod.id           = order_item['ASIN'];
  prod.name         = order_item['Title'];
  prod.asin         = order_item['ASIN'];
  prod.url          = `https://www.amazon.com/dp/${prod.asin}/?tag=${affiliate_code}`;
  prod.manufacturer = order_item['Manufacturer'];
  prod.brand        = order_item['Brand'];
  prod.brand_code   = order_item['Brand Code'];
  prod.mpn          = order_item['Part number'];
  prod.unspsc       = order_item['UNSPSC'];
  prod.nsn          = order_item['National Stock Number'];
  prod.model_num    = order_item['Item model number'];
  prod.condition    = order_item['Product Condition'];
  prod.price        = order_item['Purchase PPU'];
  //
  return(ProductDynamo(prod));
};

const csv_file = './seed-data/hackerspace-orders-201901-202001.csv'
//const csv_file = './seed-data/test-orders.csv';

const csv = fs.readFileSync(csv_file, 'utf8');
var results = Papa.parse(csv, {
  dynamicTyping: true,
  header: true,
  complete: (results) => {
    let prod;
    let allProducts = [];
    
    results.data.forEach((order_item) => {
      prod = makeProduct(order_item);
      if (! prod.id) return; 
      ProductDynamo.putProduct(prod);
      allProducts.push(prod);
    });

    // console.log('all products: ', allProducts);
    
    },
  }
);

// ProductDynamo.dumpProducts();
