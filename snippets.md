

## GraphQL

https://md0fyw8ps5.execute-api.us-east-1.amazonaws.com/dev/graphql

Savannah1

```
{
  getUserInfo(handle: "Madalyn61") {
    name
    tweets {
      items {
        retweeted
        retweet_count
        favorited
        tweet
      }
    }
    topTweet {
      retweeted
      retweet_count
      favorited
    }
  }
}
```

```
  {
    getProducts(limit: 19) {
      items {
        id
        name
        description
        image_url
        category
      }
      nextToken { product_id }
    }
  }
```

```
value: 'arn:aws:logs:us-east-1:463510405910:log-group:/aws/api-gateway/samwise-dev'
```

E/IPLTVX

## Dynamo

Dynamo list tables

```
var params = {
    Limit: 4, // optional (to further limit the number of table names returned per page)
};
dynamodb.listTables(params, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});
```

```
var params = {
    TableName: 'bees-dev',
    Limit: 3,
    Select: 'ALL_ATTRIBUTES',
};
dynamodb.scan(params, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});


var params = {
    TableName: 'bees-dev',
    Item: { 
        user_id: "flip",
        letters: "CAIHLRV"
    }
};
dynamodb.put(params, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});
```

## Google Product Taxonomy

https://www.google.com/basepages/producttype/taxonomy-with-ids.en-US.txt

## Papi Search Indexes

https://webservices.amazon.com/paapi5/documentation/locale-reference/united-states.html
https://docs.aws.amazon.com/AWSECommerceService/latest/DG/LocaleUS.html

Can also look at the error message for the list:

```  
'All','Wine','Wireless','ArtsAndCrafts','Miscellaneous','Electronics','Jewelry','MobileApps','Photo','Shoes','KindleStore','Automotive','MusicalInstruments','DigitalMusic','GiftCards','FashionBaby','FashionGirls','GourmetFood','HomeGarden','MusicTracks','UnboxVideo','FashionWomen','VideoGames','FashionMen','Kitchen','Video','Software','Beauty','Grocery',,'FashionBoys','Industrial','PetSupplies','OfficeProducts','Magazines','Watches','Luggage','OutdoorLiving','Toys','SportingGoods','PCHardware','Movies','Books','Collectibles','VHS','MP3Downloads','Fashion','Tools','Baby','Apparel','Marketplace','DVD','Appliances','Music','LawnAndGarden','WirelessAccessories','Blended','HealthPersonalCare','Classical'
```

## Product APIs

https://www.barcodelookup.com/api-documentation#code-examples
https://www.upcdatabase.com/xmlrpc.asp
https://www.davidhampgonsalves.com/upc/ean-product-databases/apis/

https://www.barcodefaq.com/1d/upc-ean/

https://www.barcodelookup.com/00000012345670

http://opengtindb.org/api.php
https://devs.upcitemdb.com/#plans
https://eandata.com
https://eandata.com/download/control-panel.php?get=sample


9781942303190  ISBN Design is Storytelling Bookland UPC
978-0747595823 ISBN Harry Potter and the Deathly Hallows
4011200296908  EAN  Colgate Total 75 ml 
B00005N5PF     ASIN Monopoly by Hasbro
00123456789012 GTIN14 Tache 28 x 47 Inches Greek Mediterranean Vacation Wall Hanging
01234567890128 EAN NoNoise Hobby & Garden Earplugs
00000012345670 Sunie Seiki Digital 15" X 15" Clamshell Heat Press



## Amazon Order CSV Import

    {
      '﻿Order Date': '11/21/2019',
      'Order ID': '112-1034912-1249839',
      'Account Group': 'ATX Hackerspace LLC',
      'PO Number': '',
      'Order Quantity': '2',
      Currency: 'USD',
      'Order Subtotal': '48.59',
      'Order Shipping & Handling': '8.31',
      'Order Promotion': '-8.31',
      'Order Tax': '4.01',
      'Order Net Total': '52.60',
      'Order Status': 'Closed',
      Approver: '',
      'Account User': 'Dannym',
      'Account User Email': 'facilities@atxhs.org',
      'Invoice Status': 'N/A',
      'Total Amount': 'N/A',
      'Invoice Due Amount': 'N/A',
      'Invoice Issue Date': 'N/A',
      'Invoice Due Date': 'N/A',
      'Payment Reference ID': '1fNeDYWVkPXkXgP9I0x7',
      'Payment Date': '11/26/2019',
      'Payment Amount': '52.60',
      'Payment Instrument Type': 'Mastercard',
      'Payment Identifier': '="9468"',
      'Shipment Date': '11/26/2019',
      'Shipment Status': 'Shipped',
      'Carrier Tracking #': 'TBA291225715000',
      'Shipment Quantity': '1',
      'Shipping Address': 'ATX Hackerspace, 9701 DESSAU RD STE 304, AUSTIN, 78754-3964, TX, US',
      'Shipment Subtotal': '39.14',
      'Shipment Shipping & Handling': '6.94',
      'Shipment Promotion': '-6.94',
      'Shipment Tax': '3.23',
      'Shipment Net Total': '42.37',
      'Carrier Name': 'Amazon Logistics',
      'Product Category': 'Home Improvement',
      ASIN: 'B00FMPKAD0',
      Title: 'TEKTON 24330 3/8-Inch Drive Click Torque Wrench (10-80 ft.-lb./13.6-108.5 Nm)',
      UNSPSC: '="27111715"',
      'Brand Code': 'TEKAF',
      Brand: 'TEKTON',
      Manufacturer: 'TEKTON',
      'National Stock Number': '',
      'Item model number': '="24330"',
      'Part number': '="24330"',
      'Product Condition': 'New',
      'Company Compliance': '',
      'Listed PPU': '40.00',
      'Purchase PPU': '39.14',
      'Item Quantity': '1',
      'Item Subtotal': '39.14',
      'Item Shipping & Handling': '6.94',
      'Item Promotion': '-6.94',
      'Item Tax': '3.23',
      'Item Net Total': '42.37',
      'PO Line Item Id': '',
      'Tax Exemption Applied': 'No',
      'Tax Exemption Type': '',
      'Tax Exemption Opt Out': 'No',
      'Discount Program': '',
      'Pricing Discount applied ($ off)': '',
      'Pricing Discount applied (% off)': '',
      'GL Code': '',
      Department: '',
      'Cost Center': '',
      'Project Code': '',
      Location: '',
      'Custom Field 1': '',
      'Seller Name': 'Amazon.com',
      'Seller Credentials': '',
      'Seller Address': ''
    },
