const client = require("./client")

// database functions
async function getAllActivities() {
  const { rows } = await client.query(
    `SELECT id
    FROM activities;`
  )

  return rows;
}

// may need to check this function again
async function getActivityById(id) {
  try {
    const { rows: [ activity ] } = await client.query(`
    SELECT *
    FROM activities
    WHERE id=$1;`,
    [id]);

    return activity;
  } catch (error) {
    console.log('AllActivities Check')
    throw error
  }
}

async function getActivityByName(name) {

}

// select and return an array of all activities
async function attachActivitiesToRoutines(routines) {
}

// return the new activity
async function createActivity({ name, description }) {

}

// don't try to update the id
// do update the name and description
// return the updated activity
async function updateActivity({ id, ...fields }) {

}


module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
}
