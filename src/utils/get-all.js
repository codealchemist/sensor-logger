function formatDate (date) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]
  const year = date.getFullYear()
  const month = months[date.getMonth()]
  const day = date.getDate()
  const hour = date.getHours()
  const minute = `0${date.getMinutes()}`.substr(-2)
  return `${month} ${day} ${hour}:${minute}`
}

function getAllValues () {
  const sensor = db.log.findOne()
  const name = sensor.name || 'temp-1'
  print(`ALL VALUES FOR SENSOR: ${name}`)
  print('-'.repeat(80))

  sensor.data.map(item => {
    const {value, date} = item
    print(`${formatDate(date)}: ${value.substr(0,4)} °C`)
  })
}