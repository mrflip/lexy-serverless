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

const MAX_TO_LOAD = 100000
//
// Object.values(BeesInDB).map((bee) => {
//   if ((bee.guesses.length === 0) && (bee.nogos.length === 0)) {
//     delete BeesInDB[bee.letters]
//     BeesDB.del({ key: { user_id: USER_ID, letters: bee.letters }})
//   }
// })

BeesFromNyt.forEach(([letters, datestr]) => {
  if (! BeesInDB[letters]) {
    console.log('new bee', letters, datestr)
    BeesInDB[letters] = { user_id: USER_ID, letters, datestr, guesses: [], nogos: [] }
  } else {
    // console.log(letters, datestr)
  }
  BeesInDB[letters].datestr = datestr
})

// console.log(_.filter(BeesInDB, (vv, kk) => (/20180[1-7]|202010/.test(vv.datestr))))

console.log(`Loading ${Object.entries(BeesInDB).length} bees`)

_.take(Object.values(BeesInDB), MAX_TO_LOAD).forEach((beeInfo, idx) => {
  const bee = Bee.from(beeInfo)
  if (! /\d+/.test(bee.datestr)) {  console.log(bee) ; bee.datestr = '20200315' }
  const item = {
    ...bee.serializeWithSummary(),
    user_id:          USER_ID,
  }
  // item.updatedAt = (((item.nytScore > 0) && (item.datestr < '20200315')) ? '20200315' : item.datestr)
  if (idx %20 === 0) { console.log(idx, item.letters) }
  return BeesDB
    .put({ item })
    .then((...res) => (// console.log(res)
      1
    ))
    .catch(error_handler('bee_put'))
})
