const request = require('request')

class AdafruitLogger {
  constructor () {
    const username = process.env.ADAFRUIT_USERNAME || ''
    const feed = process.env.ADAFRUIT_FEED || ''
    this.key = process.env.ADAFRUIT_KEY || ''
    this.url = `https://io.adafruit.com/api/v2/${username}/feeds/${feed}/data`
  }

  add (data, callback) {
    console.log(`ADAFRUIT: sending to: ${this.url}`)
    const options = {
      'Content-Type': 'application/json',
      headers: {
        'X-AIO-Key': this.key
      },
      method: 'post',
      body: {
        value: data.value
      },
      json: true,
      url: this.url
    }
    request(options, callback)
  }
}

const adafruitLogger = new AdafruitLogger()
module.exports = adafruitLogger
