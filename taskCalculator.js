function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max)) + 1
}

function taskCalculator(batch) {
  const { tasks, taskersCount } = batch
  console.log("#########################")
  console.log("#########################")
  console.log("#########################")
  console.log("#########################")
  console.log(batch)
  console.log("#########################")
  console.log("#########################")
  console.log("#########################")
  console.log("#########################")
  const assignedTasks = tasks.reduce((acc, task, i) => {
    if (i < taskersCount) {
      acc.push(Object.assign(task, { assignee_id: i }))
    } else {
      acc.push(task)
    }
    return acc
  }, [])
  return Object.assign(batch, { tasks: assignedTasks })
}

module.exports = {
  taskCalculator,
}
