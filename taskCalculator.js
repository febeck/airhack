const _ =require('lodash');
var moment = require('moment');

/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

function distance(lon1, lat1, lon2, lat2) {
  var R = 6371; // Radius of the earth in km
  var dLat = (lat2-lat1).toRad();  // Javascript functions in radians
  var dLon = (lon2-lon1).toRad();
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function parse_time(t) {
  return moment(t, "HH:mm")
}

const checkin_time = moment.duration(0.5, "H")
const speed = 10

function canTakeTask(currentTask, nextTask) {
  // console.log(currentTask, nextTask)
  const prev_time = parse_time(currentTask.dueTime)
  const next_time = parse_time(nextTask.dueTime)
  const hours_spent_travelling = moment.duration(distance(
    currentTask.lng,
    currentTask.lat,
    nextTask.lng,
    nextTask.lat,
  ) / speed, "H")
  const arrival_time = moment(prev_time + hours_spent_travelling + checkin_time)
  // console.log(`starts at ${prev_time}, arrives at ${arrival_time}, next is ${next_time}`)
  // console.log(arrival_time <= next_time)
  return arrival_time <= next_time
}


function taskCalculator(batch) {
  //  Initialize
  const {tasks, taskersCount} = batch
  const sortedTasks = _.sortBy(tasks, "dueTime")
  const tasksTaken = {}
  const currentTasks = {}
  for (i=0; i<taskersCount && i< sortedTasks.length ; i++) {
    currentTasks[i+1] = sortedTasks[i].id
    tasksTaken[sortedTasks[i].id] = i+1
  }

  // Iterate
  while(Object.keys(currentTasks).length >= 1) {
    _.forEach(_.keys(currentTasks), tasker => {
      const currentTaskId = currentTasks[tasker]
      const current_task_index = _.findIndex(sortedTasks, task => task.id == currentTaskId)
      if (current_task_index < 0 || current_task_index == sortedTasks.length-1) {
        delete currentTasks[tasker];
        return
      }
      const currentTask = sortedTasks[current_task_index]
      for (let i = current_task_index+1; i<sortedTasks.length; i++) {
        if (canTakeTask(currentTask, sortedTasks[i]) && !_.keys(tasksTaken).includes(sortedTasks[i].id)) {
          currentTasks[tasker] = sortedTasks[i].id
          // console.log(`tasker ${tasker} takes task ${sortedTasks[i].id}`)
          tasksTaken[sortedTasks[i].id] = parseInt(tasker)
          break;
        }
        delete currentTasks[tasker];
      }
    })
    // console.log(`Current tasks`, currentTasks)
  }
  _.forEach(batch.tasks, task => {
    task.assignee_id = tasksTaken[task.id]
  })
  return batch
}

module.exports = {
  taskCalculator,
}
