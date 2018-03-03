const moment = require('moment-timezone')
const express = require('express')
const bodyParser = require('body-parser')
const printii = require('printii')(__dirname)
const dbLogger = require('./db-logger')
const utils = require('./utils')

printii()

const app = express()
const port = process.env.PORT || 8080
const limit = process.env.LIMIT || 288 // logging once every 5' this is a day of logs

app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies

app.get('/log/:sensorId/:value', (req, res) => {
  const id = req.params.sensorId
  const value = req.params.value
  console.log(`SENSOR ${id}:`, value)

  const item = {id, value}
  dbLogger.add(item, (err) => {
    if (err) return utils.sendError(`ERROR adding value for sensor ${id}:`, err)

    console.log(`saved ${id}:`, value)
    utils.logLine()
    res
      .status(200)
      .send(item)
  })
})

app.get('/list/:sensorId', (req, res) => {
  const id = req.params.sensorId
  console.log(`LIST latest ${limit} values for SENSOR ${id}`)

  dbLogger.get({id, limit}, (err, data) => {
    if (err) return utils.sendError(`ERROR listing sensor ${id}:`, err)

    if (!data) {
      res
        .status(404)
        .send(null)

      utils.logLine()
      return
    }

    console.log(`returning list for sensor: ${id}`)
    utils.logLine()
    data.map(item => {
      item.date = moment.tz(item.date, 'America/Argentina/Buenos_Aires').format()
    })

    res
      .status(200)
      .send(data)
  })
})

app.get('/summary/:sensorId', (req, res) => {
  const id = req.params.sensorId
  console.log(`SUMMARY for SENSOR ${id} / last ${limit} values`)

  dbLogger.get({id, limit}, (err, data) => {
    if (err) return utils.sendError(`ERROR listing sensor ${id}:`, err)

    if (!data) {
      res
        .status(404)
        .send(null)

      utils.logLine()
      return
    }

    console.log(`returning summary for sensor: ${id}`)
    utils.logLine()
    const summary = []
    data.map(item => {
      item.date = moment(item.date)
        .tz('America/Argentina/Buenos_Aires')
        .format('DD MMM YYYY, HH:mm')
      summary.push(`${item.date}: ${item.value.substr(0, 4)}`)
    })

    res
      .status(200)
      .send(summary)
  })
})

app.get('/reset/:sensorId/', (req, res) => {
  const id = req.params.sensorId
  console.log(`reset ${id}`)
  dbLogger.reset(id, (err) => {
    if (err) return utils.sendError(`ERROR resetting sensor ${id}:`, err)

    console.log(`sensor ${id} was successfully reset!`)
    utils.logLine()
    res
      .status(200)
      .send(id)
  })
})

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
  utils.logLine()
})
