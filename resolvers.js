// add to handler.js
import _                /**/ from 'lodash'
import { GraphQLScalarType } from 'graphql'
import { Kind }              from 'graphql/language'
import Bee                   from '../lexy/src/lib/Bee'
import DynamoHelper, { error_handler
}                            from './DynamoHelper'

const USER_ID = 'flip'

const BEES_TABLE    = (process.env.beesTable    || 'BEES_TABLE_NOT_IN_ENV')
const GUESSES_TABLE = (process.env.guessesTable || 'GUESSES_TABLE_NOT_IN_ENV')

const BeesDB    = new DynamoHelper(BEES_TABLE)
const GuessesDB = new DynamoHelper(GUESSES_TABLE)

const user_bee_id = (bee_id) => [bee_id, USER_ID].join('~')

const data = {
  bee_put({ letters, datestr, guesses = [], nogos = [] }) {
    const bee    = {
      user_id: USER_ID, letters, datestr, guesses, nogos
    }
    console.log('put', bee)
    return BeesDB.put({ item: bee }).then(_sk => ({
      success: true,
      message: `Bee '${letters}' saved`,
      bee,
    })).catch(error_handler('bee_put'))
  },

  guess_put({ bee_id, word }) {
    return GuessesDB.put({
      item: { user_bee_id: user_bee_id(bee_id), word },
    }).then(_ => ({
      success: true,
      message: `Guess saved`,
      guess:   { bee_id, word },
    })).catch(error_handler('guess_put'))
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
      let bee
      if (count == 1) { bee = Bee.from(obj).serialize() }
      return ({
        success: true,
        message: `Bee '${letters}' gotten`,
        bee:     bee
      })
    }).catch(error_handler('bee_get'))
  },

  bee_list(params) {
    const { limit, cursor, sortby, sortrev, ...rest } = params
    const cc = cursor && { ...JSON.parse(cursor), user_id: USER_ID }
    // console.log(cc, cursor, rest)
    return BeesDB.list({
      key:              { user_id: USER_ID },
      limit,
      cursor:           cc,
      sortby:           'bydatestr',
      sortrev:          true,
    }).then(({ items, nextCursor }) => {
      if (nextCursor) { delete nextCursor.user_id }
      const answer = {
        success:        true,
        message:        `bee_list fetched`,
        bees:           (items || []),
        cursor:         nextCursor && JSON.stringify(nextCursor),
      }
      console.log('bee_list answer', answer, answer.bees.length)
      return answer
    }).catch(error_handler('bee_list', params))
  },

  guess_list({ bee_id, limit, cursor }) {
    const cc = (cursor ? { user_bee_id: user_bee_id(bee_id), word: cursor } : null)
    return GuessesDB.list({
      limit,
      cursor: cc,
      slice:  user_bee_id,
    }).then(({ items, nextCursor }) => {
      console.log('guess_list', items, nextCursor)
      let cur_wd
      if (nextCursor) { cur_wd = nextCursor.word }
      return ({
        success:  true,
        message:  `guesses_list fetched for ${bee_id}`,
        guesses:  (items || []),
        cursor:   cur_wd,
      })
    }).catch(error_handler('guess_list'))
  }
}


// eslint-disable-next-line import/prefer-default-export
export const resolvers = {
  Query: {
    bee_get:    (_, args) => data.bee_get(args),
    bee_list:   (_, args) => data.bee_list(args),
    // guess_get:  (_, args) => data.guess_get(args),
    guess_list: (_, args) => data.guess_list(args),
  },
  Mutation: {
    bee_put:    (_, args) => data.bee_put(args),
    bee_del:    (_, args) => data.bee_del(args),
    guess_put:  (_, args) => data.guess_put(args),
    guess_del:  (_, args) => data.guess_del(args),
  },
}
