const express = require('express')
const bodyParser = require('body-parser')

const { taskCalculator } = require('./taskCalculator.js')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function(req, res) {
  res.send('API is up !')
})

app.post('/incomingTasks', function(req, res) {
  const { body } = req
  const result = taskCalculator(body)
  res.send(result)
})

app.get('/'), function(req, res) {
  res.send("hello world")
}

var port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log(`App running on port ${port}!`)
})
