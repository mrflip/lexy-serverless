#!/usr/bin/env node -r esm --harmony
import _           /**/ from 'lodash'
import fs               from 'fs'
import Paths            from './Paths'
import BeesFromNyt      from '../data/bees.json'
import BeesInDB         from '../data/all_bees_latest.json'
import DynamoHelper, { error_handler
}                       from '../DynamoHelper'
import Bee              from '../src/lib/Bee'

const USER_ID    = 'flip'
// const BeesSeen   = new Set(_.keys(BeesInDB))
const BEES_TABLE = (process.env.beesTable    || 'BEES_TABLE_NOT_IN_ENV')
const BeesDB     = new DynamoHelper(BEES_TABLE)
console.log('Using table', BEES_TABLE)

const MAX_TO_LOAD = 1_000_000
//
// Object.values(BeesInDB).map((bee) => {
//   if ((bee.guesses.length === 0) && (bee.nogos.length === 0)) {
//     delete BeesInDB[bee.letters]
//     BeesDB.del({ key: { user_id: USER_ID, letters: bee.letters }})
//   }
// })

const NytDates = {}

// For any official puzzles, use the latest date they ran that puzzle (eg
BeesFromNyt.forEach(([letters, datestr]) => {
  const lastDate = _.max([NytDates[letters], datestr])
  NytDates[letters] = lastDate
})

BeesFromNyt.forEach(([letters, datestr]) => {
  // if the database doesn't have this bee, add it
  if (! BeesInDB[letters]) {
    console.log('new bee', letters, datestr)
    BeesInDB[letters] = { user_id: USER_ID, letters, datestr, guesses: [], nogos: [] }
  }
  // Use the canonical date from the scrape (in case it was added manually)
  BeesInDB[letters].datestr = NytDates[letters]
})

// console.log(_.filter(BeesInDB, (vv, kk) => (/20180[1-7]|202010/.test(vv.datestr))))

console.log(`Loading ${Object.entries(BeesInDB).length} bees`)

function getItemUpdatedAt(item) {
  if (item.updatedAt)    { return item.updatedAt }
  if (item.nytScore > 0) { return item.datestr }
  return '! new !'
}

_.take(Object.values(BeesInDB), MAX_TO_LOAD).forEach((beeInfo, idx) => {
  const bee = Bee.from(beeInfo)
  if (! /\d+/.test(bee.datestr)) { console.log('no date', bee) ; bee.datestr = '20200315' }
  const item = {
    ...bee.serializeWithSummary(),
    user_id:          USER_ID,
  }
  item.updatedAt = getItemUpdatedAt(item)
  // item.updatedAt = (((item.nytScore > 0) && (item.datestr < '20200315')) ? '20200315' : item.datestr)
  if (idx % 1 === 0) {
    console.log('item', idx, item.letters, bee.totScore(), '\t', item.datestr, item.updatedAt,_.omit(beeInfo, _.keys(item)), item.updatedAt === item.datestr)
  }
  return BeesDB
    .put({ item })
    // .then((res) => { console.log(res); return res })
    .catch(error_handler('bee_put'))
})
