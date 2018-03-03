const db = require('./db')

class Log {
  constructor () {
    this.collection = db.collection('log')
  }

  get (id, callback) {
    this.collection.find({id}, callback)
  }

  save (sensor) {
    if (!sensor) return
    this.collection.save(sensor, callback)
  }

  create (id, name='sensor', callback) {
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
    this.collection.update(
      {id},
      {
        $set: {
          updated: new Date(),
          data: []
        }
      },
      callback
    )
  }

  add ({id, value}, callback) {
    if (!id) return
    console.log('DB: ADD', {id, value})
    this.collection.update(
      {id},
      {
        $set: { updated: new Date() },
        $push: { data: {value, date: new Date()} }
      },
      {upsert: true},
      callback
    )
  }
}

const log = new Log()
module.exports = log
