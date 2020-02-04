import fs from 'fs';
import path from 'path';
require('./schema.graphql');
const schema = fs.readFileSync('./schema.graphql', 'utf8');


// eslint-disable-next-line import/prefer-default-export
export { schema };
