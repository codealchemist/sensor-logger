const moment = require('moment-timezone')
const express = require('express')
const bodyParser = require('body-parser')
const printii = require('printii')(__dirname)
const dbLogger = require('./db-logger')

printii()

const app = express()
const port = process.env.PORT || 8080

app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies

app.get('/log/:sensorId/:value', (req, res) => {
  const id = req.params.sensorId
  const value = req.params.value
  console.log(`SENSOR ${id}:`, value)
  const item = {id, value}
  dbLogger.add(item, () => {
    console.log(`saved ${id}:`, value)
    res
      .status(200)
      .send(item)
  })
})

app.get('/list/:sensorId', (req, res) => {
  const id = req.params.sensorId
  console.log(`LIST SENSOR ${id}`)
  dbLogger.get(id, (err, sensor) => {
    if (err) {
      console.log(`ERROR listing sensor ${id}:`, err)
      res
        .status(500)
        .send(err)
      return
    }

    if (!sensor) {
      res
        .status(404)
        .send(null)
      return
    }

    console.log(`returning data for sensor: ${id}`)
    sensor.data.map(item => {
      item.date = moment().tz('America/Argentina').format()
    })

    res
      .status(200)
      .send(sensor)
  })
})

app.get('/reset/:sensorId/', (req, res) => {
  const id = req.params.sensorId
  dbLogger.reset(id, () => {
    console.log(`reset ${id}`)
    res
      .status(200)
      .send(id)
  })
})

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})
