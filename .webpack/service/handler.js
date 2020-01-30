(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./handler.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./handler.js":
/*!********************!*\
  !*** ./handler.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*** IMPORTS FROM imports-loader ***/\nvar graphql = __webpack_require__(/*! graphql */ \"graphql\");\n\n'use strict';\n\nvar _apolloServerLambda = __webpack_require__(/*! apollo-server-lambda */ \"apollo-server-lambda\");\n\nvar _schema = __webpack_require__(/*! ./schema */ \"./schema.js\");\n\nvar _resolvers = __webpack_require__(/*! ./resolvers */ \"./resolvers.js\");\n\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\nconst server = new _apolloServerLambda.ApolloServer({\n  typeDefs: _schema.schema,\n  resolvers: _resolvers.resolvers,\n  formatError: error => {\n    console.log(error);\n    return error;\n  },\n  formatResponse: response => {\n    console.log(response);\n    return response;\n  },\n  context: ({\n    event,\n    context\n  }) => ({\n    headers: event.headers,\n    functionName: context.functionName,\n    event,\n    context\n  }),\n  playground: {\n    endpoint: process.env.REACT_APP_GRAPHQL_ENDPOINT ? process.env.REACT_APP_GRAPHQL_ENDPOINT : '/production/graphql'\n  },\n  tracing: true\n});\nexports.graphqlHandler = server.createHandler({\n  cors: {\n    origin: '*'\n  }\n});\n\nmodule.exports.hello = (() => {\n  var _ref = _asyncToGenerator(function* (event) {\n    return {\n      statusCode: 200,\n      body: JSON.stringify({\n        message: 'Go Serverless v1.0! Your function executed successfully!',\n        input: event\n      }, null, 2)\n    }; // Use this code if you don't use the http event with the LAMBDA-PROXY integration\n    // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };\n  });\n\n  return function (_x) {\n    return _ref.apply(this, arguments);\n  };\n})();\n\n\n//# sourceURL=webpack:///./handler.js?");

/***/ }),

/***/ "./resolvers.js":
/*!**********************!*\
  !*** ./resolvers.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*** IMPORTS FROM imports-loader ***/\nvar graphql = __webpack_require__(/*! graphql */ \"graphql\");\n\n\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.resolvers = undefined;\n\nvar _serverlessDynamodbClient = __webpack_require__(/*! serverless-dynamodb-client */ \"serverless-dynamodb-client\");\n\nvar _serverlessDynamodbClient2 = _interopRequireDefault(_serverlessDynamodbClient);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n// add to handler.js\nlet docClient;\nconsole.log(\"development\");\nconsole.log(process.env);\n\nif (false) {} else {\n  docClient = _serverlessDynamodbClient2.default.doc;\n} // add to handler.js\n\n\nconst promisify = foo => new Promise((resolve, reject) => {\n  foo((error, result) => {\n    if (error) {\n      reject(error);\n    } else {\n      resolve(result);\n    }\n  });\n});\n\nconst data = {\n  getPaginatedTweets(handle, args) {\n    return promisify(callback => {\n      const params = {\n        TableName: 'Tweets',\n        KeyConditionExpression: 'handle = :v1',\n        ExpressionAttributeValues: {\n          ':v1': handle\n        },\n        IndexName: 'tweet-index',\n        Limit: args.limit,\n        ScanIndexForward: false\n      };\n\n      if (args.nextToken) {\n        params.ExclusiveStartKey = {\n          tweet_id: args.nextToken.tweet_id,\n          created_at: args.nextToken.created_at,\n          handle: handle\n        };\n      }\n\n      docClient.query(params, callback);\n    }).then(result => {\n      const tweets = [];\n      let listOfTweets;\n      console.log(result);\n\n      if (result.Items.length >= 1) {\n        listOfTweets = {\n          items: []\n        };\n      }\n\n      for (let i = 0; i < result.Items.length; i += 1) {\n        tweets.push({\n          tweet_id: result.Items[i].tweet_id,\n          created_at: result.Items[i].created_at,\n          handle: result.Items[i].handle,\n          tweet: result.Items[i].tweet,\n          retweet_count: result.Items[i].retweet_count,\n          retweeted: result.Items[i].retweeted,\n          favorited: result.Items[i].favorited\n        });\n      }\n\n      listOfTweets.items = tweets;\n\n      if (result.LastEvaluatedKey) {\n        listOfTweets.nextToken = {\n          tweet_id: result.LastEvaluatedKey.tweet_id,\n          created_at: result.LastEvaluatedKey.created_at,\n          handle: result.LastEvaluatedKey.handle\n        };\n      }\n\n      return listOfTweets;\n    });\n  },\n\n  getUserInfo(args) {\n    return promisify(callback => docClient.query({\n      TableName: 'Users',\n      KeyConditionExpression: 'handle = :v1',\n      ExpressionAttributeValues: {\n        ':v1': args.handle\n      }\n    }, callback)).then(result => {\n      let listOfTweets;\n\n      if (result.Items.length >= 1) {\n        listOfTweets = {\n          name: result.Items[0].name,\n          handle: result.Items[0].handle,\n          location: result.Items[0].location,\n          description: result.Items[0].description,\n          followers_count: result.Items[0].followers_count,\n          friends_count: result.Items[0].friends_count,\n          favourites_count: result.Items[0].favourites_count,\n          following: result.Items[0].following\n        };\n      }\n\n      return listOfTweets;\n    });\n  }\n\n}; // eslint-disable-next-line import/prefer-default-export\n\nconst resolvers = exports.resolvers = {\n  Query: {\n    getUserInfo: (root, args) => data.getUserInfo(args)\n  },\n  User: {\n    tweets: (obj, args) => data.getPaginatedTweets(obj.handle, args)\n  }\n};\n\n\n//# sourceURL=webpack:///./resolvers.js?");

/***/ }),

/***/ "./schema.js":
/*!*******************!*\
  !*** ./schema.js ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*** IMPORTS FROM imports-loader ***/\nvar graphql = __webpack_require__(/*! graphql */ \"graphql\");\n\n\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nconst schema = `\ntype Mutation {\n    # Create a tweet for a user\n    # consumer keys and tokens are not required for dynamo integration\n    createTweet(\n        tweet: String!,\n        consumer_key: String,\n        consumer_secret: String,\n        access_token_key: String,\n        access_token_secret: String,\n        created_at: String!\n    ): Tweet!\n\n    # Delete User Tweet\n    deleteTweet(\n        tweet_id: String!,\n        consumer_key: String,\n        consumer_secret: String,\n        access_token_key: String,\n        access_token_secret: String\n    ): Tweet!\n\n    # Retweet existing Tweet\n    reTweet(\n        tweet_id: String!,\n        consumer_key: String,\n        consumer_secret: String,\n        access_token_key: String,\n        access_token_secret: String\n    ): Tweet!\n\n    # Update existing Tweet\n    updateTweet(tweet_id: String!, tweet: String!): Tweet!\n\n    # Create user info is available in dynamo integration\n    updateUserInfo(\n        location: String!,\n        description: String!,\n        name: String!,\n        followers_count: Int!,\n        friends_count: Int!,\n        favourites_count: Int!,\n        following: [String!]!\n    ): User!\n}\n\ntype Query {\n    meInfo(consumer_key: String, consumer_secret: String): User!\n    getUserInfo(handle: String!, consumer_key: String, consumer_secret: String): User!\n\n    # search functionality is available in elasticsearch integration\n    searchAllTweetsByKeyword(keyword: String!): TweetConnection\n}\n\ndirective @aws_subscribe(mutations: [String]) on FIELD_DEFINITION\n\ntype Subscription {\n    addTweet: Tweet\n        @aws_subscribe(mutations: [\"createTweet\"])\n}\n\ntype Tweet {\n    tweet_id: String!\n    tweet: String!\n    retweeted: Boolean\n    retweet_count: Int\n    favorited: Boolean\n    created_at: String!\n}\n\ntype TweetConnection {\n    items: [Tweet!]!\n    nextToken: Token\n}\n\ninput TokenInput {\n    tweet_id : String!\n    created_at: String!\n    handle: String!\n}\n\ntype Token {\n    tweet_id : String!\n    created_at: String!\n    handle: String!\n}\n\ntype User {\n    name: String!\n    handle: String!\n    location: String!\n    description: String!\n    followers_count: Int!\n    friends_count: Int!\n    favourites_count: Int!\n    following: [String!]!\n    topTweet: Tweet\n    tweets(limit: Int, nextToken: TokenInput): TweetConnection\n\n    # search functionality is available in elasticsearch integration\n    searchTweetsByKeyword(keyword: String!): TweetConnection\n}\n\nschema {\n    query: Query\n    mutation: Mutation\n    subscription: Subscription\n}`; // eslint-disable-next-line import/prefer-default-export\n\nexports.schema = schema;\n\n\n//# sourceURL=webpack:///./schema.js?");

/***/ }),

/***/ "apollo-server-lambda":
/*!***************************************!*\
  !*** external "apollo-server-lambda" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"apollo-server-lambda\");\n\n//# sourceURL=webpack:///external_%22apollo-server-lambda%22?");

/***/ }),

/***/ "graphql":
/*!**************************!*\
  !*** external "graphql" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"graphql\");\n\n//# sourceURL=webpack:///external_%22graphql%22?");

/***/ }),

/***/ "serverless-dynamodb-client":
/*!*********************************************!*\
  !*** external "serverless-dynamodb-client" ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"serverless-dynamodb-client\");\n\n//# sourceURL=webpack:///external_%22serverless-dynamodb-client%22?");

/***/ })

/******/ })));