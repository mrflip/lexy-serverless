// add to handler.js
import { GraphQLScalarType } from 'graphql';
import { Kind }              from 'graphql/language';
import Bee                   from '../lexy/src/lib/Bee'
import _                     from 'lodash'
import DynamoHelper          from './DynamoHelper'

const USER_ID = 'flip'

const BEES_TABLE    = (process.env.beesTable || 'BEES_TABLE_NOT_IN_ENV')
const GUESSES_TABLE = (process.env.beesTable || 'BEES_TABLE_NOT_IN_ENV')

const BeesDB    = new DynamoHelper(BEES_TABLE)
const GuessesDB = new DynamoHelper(GUESSES_TABLE)

const data = {
  bee_put({ letters, datestr, guesses = [], nogos = [] }) {
    const bee    = {
      user_id: USER_ID, letters, datestr, guesses, nogos
    }
    return BeesDB.put({
      key: { user_id: USER_ID, letters },
      item: bee,
    }).then(_ => ({
      success: true,
      message: `Bee '${letters}' saved`,
      bee,
    })).catch(error => ({
      success: false,
      message: `bee_put error: ${JSON.stringify(error)}`,
    }))
  },

  bee_del({ letters }) {
    return BeesDB.del({
      key: { user_id: USER_ID, letters },
    }).then(({ obj }) => {
      const { datestr, guesses = [], nogos = [] } = obj
      return ({
        success: true,
        message: `Bee '${letters}' removed`,
        bee:     { letters, datestr, guesses, nogos },
      })
    }).catch(error => ({
      success: false,
      message: `bee_put error: ${JSON.stringify(error)}`,
    }))
  },

  bee_get({ letters }) {
    return BeesDB.get({
      key: { user_id: USER_ID, letters },
    }).then(({ obj, count }) => {
      // console.log('bee_get', count, obj)
      if (count == 1) {
        const ret = Bee.from(obj).serialize()
        // console.log('bg ret', ret)
        return ret
      } else {
        return null
      }
    });
  },

  bee_list({ limit, cursor }) {
    const cc = (cursor ? { user_id: USER_ID, letters: cursor } : null)
    return BeesDB.list({
      limit, cursor: cc
    }).then(({ items, nextCursor }) => {
      console.log('bee_list post', items, nextCursor)
      let cur_ltrs
      if (nextCursor) { cur_ltrs = nextCursor.letters }
      return ({
        bees:   items,
        cursor: cur_ltrs,
      })
    }).catch(error => {
      console.log("bee_list error:", error)
      return ({
        success: false,
        message: `bee_list error: ${JSON.stringify(error)}`,
      })
    })
  }
}


// eslint-disable-next-line import/prefer-default-export
export const resolvers = {
  Query: {
    bee_get:    (_, args) => data.bee_get(args),
    bee_list:   (_, args) => data.bee_list(args),
  },
  Mutation: {
    bee_put: (_, args) => data.bee_put(args),
    bee_del: (_, args) => data.bee_del(args),
  },
};
