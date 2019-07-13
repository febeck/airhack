const express = require('express')
var bodyParser = require('body-parser')
const axios = require('axios')

const { taskCalculator } = require('./taskFernando.js')

const app = express()
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.get('/', function(req, res) {
  res.send('API is up !')
})

let tasksByUser

app.post('/incomingTasks', function(req, res) {
  const { body } = req
  const result = taskCalculator(body)
  tasksByUser = result.tasksByUser
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: 'Bearer TLeu9glRLo42ehAxakosxLSfI0Xj5V4Yb6vocDL47ccCvUHuDhwpXgUw3vTp',
    },
    data: result.batch,
    url: 'http://airhack-api.herokuapp.com/api/submitTasks',
  }
  return axios(options)
    .then(apiResponse => {
      console.log('API RESPONSE', apiResponse)
      res.send('success')
    })
    .catch(e => {
      console.log(e)
      res.send(e)
    })
})

app.get('/myTasks', function(req, res) {
  return res.send(tasksByUser.get(parseInt(req.query.userId, 10)))
})

var port = process.env.PORT || 8080

app.listen(port, function() {
  console.log(`App running on port ${port}!`)
})
