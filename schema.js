const fs = require('fs');
const path = require('path');
require('./schema.graphql');
const schema = fs.readFileSync('./schema.graphql', 'utf8');


// eslint-disable-next-line import/prefer-default-export
export { schema };
