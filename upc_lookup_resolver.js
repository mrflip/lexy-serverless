/* 
 * const https = require('https')
 * var opts = {
 *   hostname: 'api.upcitemdb.com',
 *   path: '/prod/v1/lookup',
 *   method: 'POST',
 *   headers: {
 *     "Content-Type": "application/json",
 *     "user_key": "only_for_dev_or_pro",
 *     "key_type": "3scale"
 *   }
 * }
 * var req = https.request(opts, function(res) {
 *   console.log('statusCode: ', res.statusCode);
 *   console.log('headers: ', res.headers);
 *   res.on('data', function(d) {
 *     console.log('BODY: ' + d);
 *   })
 * })
 * req.on('error', function(e) {
 *   console.log('problem with request: ' + e.message);
 * })
 * req.write('{ "upc": "4002293401102" }')
 * req.end() */


/* const AmzPapiClient = AmzPapi.createClient({
 *   awsId:     "aws ID",
 *   awsSecret: "aws Secret",
 *   awsTag:    "aws Tag"
 * });
 *  */
// import { AmzPapi           } from 'amazon-product-api';


getProduct(id, args) {
  return promisify(callback => {
    // https://www.barcodelookup.com/00000012345670
    /*
     *       client.itemSearch({
     *         director: 'Quentin Tarantino',
     *         actor: 'Samuel L. Jackson',
     *         searchIndex: 'DVD',
     *         condition: 'New',
     *         audienceRating: 'R',
     *         responseGroup: 'ItemAttributes,Offers,Images'
     *       }).then(function(results){
     *         console.log(results);
     *       }).catch(function(err){
     *         console.log(err);
     *       }); */

  }).then(result => {

  });
},

