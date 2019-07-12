function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max)) + 1
}

function taskCalculator(batch) {
  const { tasks, taskersCount } = batch
  const assignedTasks = tasks.map(task => {
    return Object.assign(task, { assignee_id: getRandomInt(taskersCount) })
  })
  return Object.assign(batch, { tasks: assignedTasks })
}

module.exports = {
  taskCalculator,
}
