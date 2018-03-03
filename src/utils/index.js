function logLine () {
  console.log('-'.repeat(50), new Date())
}

function sendError (message, err, code = 500) {
  console.log(message, err)
  res
    .status(code)
    .send(err)

  logLine()
}

module.exports = {
  sendError,
  logLine
}