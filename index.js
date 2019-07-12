const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')

axios.interceptors.request.use(request => {
  console.log('Starting Request', request)
  return request
})

axios.interceptors.response.use(response => {
  console.log('Response:', response)
  return response
})

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
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: 'Bearer TLeu9glRLo42ehAxakosxLSfI0Xj5V4Yb6vocDL47ccCvUHuDhwpXgUw3vTp',
    },
    data: taskCalculator(body),
    url: 'http://airhack-api.herokuapp.com/api/submitTasks',
  }
  return axios(options)
    .then(apiResponse => {
      console.log('API RESPONSE', apiResponse)
      res.send(apiResponse)
    })
    .catch(e => {
      console.error('API ERROR', apiResponse)
      res.send("An error occured")
    })
})

var port = process.env.PORT || 8080

app.listen(port, function() {
  console.log(`App running on port ${port}!`)
})
