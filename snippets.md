

## GraphQL

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
