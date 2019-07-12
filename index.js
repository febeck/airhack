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

app.listen(3000, function() {
  console.log('App running on port 3000!')
})
