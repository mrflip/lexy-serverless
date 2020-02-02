

## GraphQL

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
  getProducts(limit: 3) {
    id
    name
    description
    image_url
    url
    category
  }
}
```

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
    TableName: 'Products',
    Limit: 3,
    Select: 'ALL_ATTRIBUTES',
};
dynamodb.scan(params, function(err, data) {
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
