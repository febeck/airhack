const _ = require('lodash')
const moment = require('moment')

const TASK_DURATION = 30
const MOVING_SPEED = 9 / 60

if (typeof Number.prototype.toRad === 'undefined') {
  Number.prototype.toRad = function() {
    return (this * Math.PI) / 180
  }
}

function distance(lon1, lat1, lon2, lat2) {
  var R = 6371 // Radius of the earth in km
  var dLat = Math.abs(lat2 - lat1).toRad() // Javascript functions in radians
  var dLon = Math.abs(lon2 - lon1).toRad()
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  var d = R * c // Distance in km
  return d
}

function calculateDistanceBetweenTasks(t1, t2) {
  const { lat: lat1, lng: lng1 } = t1
  const { lat: lat2, lng: lng2 } = t2
  return distance(lng1, lat1, lng2, lat2)
}

function canDoTask(firstTask, nextTask, distance, movingSpeed = MOVING_SPEED, taskDuration = TASK_DURATION) {
  const timeToNextTask = Math.ceil(distance / movingSpeed) + taskDuration
  return moment(firstTask.dueTime, 'HH:mm')
    .add(timeToNextTask, 'minutes')
    .isBefore(moment(nextTask.dueTime, 'HH:mm'))
}

function solveBatch(batch) {
  const { tasks, taskersCount } = batch
  const sortedTasks = _.sortBy(tasks, 'dueTime')
  const currentTasks = new Map()
  const tasksByUser = new Map()

  // Initialize the tasks for the first taskers
  for (let i = 0; i < Math.min(taskersCount, tasks.length); i++) {
    sortedTasks[i]['assignee_id'] = i
    currentTasks.set(sortedTasks[i].id, sortedTasks[i])
    tasksByUser.set(i, [sortedTasks[i]])
  }

  for (let i = taskersCount; i < tasks.length; i++) {
    const taskToCheck = sortedTasks[i]
    let canTakeTask = false

    const minDistanceTask = _.minBy(Array.from(currentTasks.values()), task => {
      const distance = calculateDistanceBetweenTasks(task, taskToCheck)
      if (canDoTask(task, taskToCheck, distance)) {
        canTakeTask = true
        return distance
      } else {
        return Infinity
      }
    })
    if (!canTakeTask) continue

    const assignedUser = minDistanceTask['assignee_id']
    taskToCheck['assignee_id'] = assignedUser

    // Add new task to mapping user => tasks
    const previousTasks = tasksByUser.get(assignedUser)
    tasksByUser.set(assignedUser, [...previousTasks, taskToCheck])

    // Update current tasks
    currentTasks.delete(minDistanceTask['id'])
    currentTasks.set(taskToCheck['id'], taskToCheck)
  }
  return sortedTasks
}

function taskCalculator(batch) {
  batches = [batch]
  _.forEach(batches, batch => {
    batch = { batch: Object.assign(batch, { tasks: solveBatch(batch) }), tasksByUser }
  })
  return batch
}

module.exports = {
  taskCalculator,
}
