#!/usr/bin/env node -r esm --harmony
import _                /**/ from 'lodash'
import fs                    from 'fs'
import DynamoHelper          from '../DynamoHelper'
import Paths                 from './Paths'
import Bee                   from '../src/lib/Bee'

// console.log(process.env)
const BEES_TABLE = (process.env.beesTable || 'BEES_TABLE_NOT_IN_ENV')
const BeesDB     = new DynamoHelper(BEES_TABLE)

const MAX_TO_FETCH = Infinity
const BATCH_SIZE   = 40

const USER_ID = 'flip'

// in lexy-bee
// ./scripts/parse_nytbee.js
//
// # choose the one that is CURRENT -- see about screen. AWS_PROFILE
// # selects section from ~/.aws/credentials:
//
// export stage=dev
// export AWS_PROFILE=tksm; export AWS_REGION=us-east-1
//
// LOCAL_DYNAMO=false beesTable=bees-${stage} ./scripts/dump_bees.js
//
// Once you're ready,
//
// cp ./data/all_bees_bkup-TODAYSDATE-${stage}.json ./data/all_bees_latest.json
//
// # choose the OTHER stage, and update lexy-bee/Secrets.js
// export stage=prod
//
// LOCAL_DYNAMO=false beesTable=bees-dev ./scripts/load_bees.js
//

const error_handler = (fn) => (
  (error) => {
    console.log('eh', error)
    return     ({
    success: false,
    message: `${fn} error: ${error} (${JSON.stringify(error)})`,
    })
  }
)

function bee_list({ limit, cursor }) {
  return BeesDB.list({
    key:              { user_id: USER_ID },
    limit,
    cursor,
    sortby:           'by_datestr',
    sortrev:          true,
  }).then(({ items, nextCursor }) => {
    return ({
      success: true,
      message: `bee_list fetched`,
      bees:    items,
      cursor:  nextCursor,
    })
  }).catch(error_handler('bee_list'))
}


let stream = {
  cursor: null,
  limit:  BATCH_SIZE,
  //
  async *[Symbol.asyncIterator](next) {
    do {
      let batch = await bee_list({ limit: this.limit, cursor: this.cursor })
      if (! batch.success) {
        console.log('error', batch, this.cursor)
        break
      }
      console.log(`Got ${batch.success} for ${batch.bees.length} from ${batch.cursor}`)
      this.cursor = batch.cursor
      yield* batch.bees
    } while (this.cursor !== undefined)
  }
}

async function backup_bees() {
  const jsonl_writer = fs.createWriteStream(Paths.bee_line_file, { encoding: 'utf8'})
  const all_writer   = fs.createWriteStream(Paths.bee_bkup_file, { encoding: 'utf8'})
  const all_bees = {}
  let count = 0
  console.log(Paths)
  for await (let val of stream) {
    // ProductDynamo.delete({ key: { id: val.id } })
    jsonl_writer.write([JSON.stringify(val), "\n"].join(''))
    all_bees[val.letters] = val
    count += 1
    if (count > MAX_TO_FETCH) { return }
  }
  all_writer.write(JSON.stringify(all_bees))
}
backup_bees()
