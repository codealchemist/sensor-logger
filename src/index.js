const express = require('express')
const bodyParser = require('body-parser')
const printii = require('printii')(__dirname)
const dbLogger = require('./db-logger')

printii()

const app = express()
const port = process.env.PORT || 8080

app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies

app.post('/log/:sensorId', (req, res) => {
  const id = req.params.sensorId
  const data = req.body
  console.log(`SENSOR ${id}:`, data)
  const item = {id, value: data.value}
  dbLogger.add(item, () => {
    console.log(`saved ${id}:`, data)
    res
      .status(200)
      .send(item)
  })
})

app.listen(port, function() {
  console.log(`listening at http://localhost:${port}`)
})
