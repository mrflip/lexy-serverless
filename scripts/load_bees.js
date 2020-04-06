#!/usr/bin/env node -r esm --harmony
import _                /**/ from 'lodash'
import fs                    from 'fs'
import Paths                 from './Paths'
import AllBees               from '../data/bees.json'
import BeesInDB              from '../data/all_bees_bkup-latest-dev.json'
import DynamoHelper, { error_handler
}                            from '../DynamoHelper'

const USER_ID    = 'flip'
// const BeesSeen   = new Set(_.keys(BeesInDB))
const BEES_TABLE = (process.env.beesTable    || 'BEES_TABLE_NOT_IN_ENV')
const BeesDB     = new DynamoHelper(BEES_TABLE)

const MAX_TO_LOAD = 100000

Object.values(BeesInDB).map((bee) => {
  if ((bee.guesses.length === 0) && (bee.nogos.length === 0)) {
    delete BeesInDB[bee.letters]
    BeesDB.del({ key: { user_id: USER_ID, letters: bee.letters }})
  }
})

AllBees.forEach(([letters, datestr]) => {
  if (! BeesInDB[letters]) {
    BeesInDB[letters] = { user_id: USER_ID, letters, datestr, guesses: [], nogos: [] }
  } else {
    // console.log(letters, datestr)
  }
  BeesInDB[letters].datestr = datestr
})

// console.log(_.filter(BeesInDB, (vv, kk) => (/20180[1-7]|202010/.test(vv.datestr))))

_.take(Object.values(BeesInDB), MAX_TO_LOAD).forEach((bee) => {
  if (! bee.datestr) { bee.datestr = '20200315' }
  // console.log(bee)
  return BeesDB
    .put({ item: bee })
    .then((...res) => (// console.log(res)
      1
    ))
    .catch(error_handler('bee_put'))
})
