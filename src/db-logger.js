const db = require('./db')

class Log {
  constructor () {
    this.collection = db.collection('log')
  }

  /**
   * Passes latest values for requested id up to set limit.
   * Default limit is 1.
   *
   * @param {id, limit} object
   * @param {function} callback
   */
  get ({id, limit = 1}, callback) {
    this.collection
      .find({id})
      .sort({date: -1})
      .limit(limit, callback)
  }

  save (sensor, callback) {
    if (!sensor) return
    this.collection.save(sensor, callback)
  }

  create (id, name = 'sensor', callback) {
    id = id.trim()
    name = name.trim()
    if (!id) return
    this.collection.save({
      id,
      name,
      created: new Date(),
      updated: new Date(),
      data: []
    }, callback)
  }

  reset (id, callback) {
    if (!id) return
    this.collection.remove(
      {id},
      callback
    )
  }

  add ({id, value}, callback) {
    if (!id) return
    console.log('DB: ADD', {id, value})
    this.collection.save(
      {id, value, date: new Date()},
      callback
    )
  }
}

const log = new Log()
module.exports = log
