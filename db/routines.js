/* eslint-disable no-useless-catch */
const client = require('./client');
const { attachActivitiesToRoutines } = require('./activities')

async function getRoutineById(id){
  try {
  const {rows: [routine]} = await client.query (`
    SELECT *
    FROM routines
    WHERE id= $1;
  `, [id])
  return routine
} catch (error) {
  throw error
}

}

async function getRoutinesWithoutActivities(){
  try {
    const {rows} = await client.query (`
      SELECT *
      FROM routines;
    `)
    return rows
  } catch (error) {
    throw (error)
  }
}
// SELECT *
// FROM routine_activities;

async function getAllRoutines() {
  try {
    const { rows } = await client.query (`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id;
    `)
    return attachActivitiesToRoutines(rows)
  } catch (error) {
    throw (error)
  }
}

async function getAllRoutinesByUser({username}) {
  try {
    const { rows } = await client.query (`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
      WHERE username = $1;
    `, [username])
    console.log('These are your routines:', rows)
    return attachActivitiesToRoutines(rows)
  } catch (error) {
    throw (error)
  }
}

async function getPublicRoutinesByUser({username}) {
  try {
    const { rows } = await client.query (`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    WHERE username =$1
    AND routines."isPublic"=true;
    `, [username])
    return attachActivitiesToRoutines(rows
)  } catch (error) {
    throw (error)
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows } = await client.query (`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    WHERE "isPublic"=true;
    `)
    return attachActivitiesToRoutines(rows)
  } catch (error) {
    throw (error)
  }
}

async function getPublicRoutinesByActivity({id}) {
  try {
    const { rows } = await client.query (`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    JOIN routine_activities ON routine_activities."routineId" = routines.id
    WHERE routines."isPublic"=true
    AND routine_activities."activityId"=$1;
    `, [id])
    return attachActivitiesToRoutines(rows)
  } catch (error) {
    throw (error)
  }
}

async function createRoutine({creatorId, isPublic, name, goal}) {

  try {
    const {rows: [routine]} = await client.query (`
      INSERT INTO routines ("creatorId", "isPublic", name, goal)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [creatorId, isPublic, name, goal])
    return routine
  } catch (error) {
    throw error
  }
}

async function updateRoutine({id, ...fields}) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  if (setString.length === 0) {
    return;
  }

  try {
    const {rows: [ routine ] } = await client.query(`
    UPDATE routines
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
    `, Object.values(fields));

    return routine
  }catch (error) {
    throw error
  }
}

async function destroyRoutine(id) {
  try{
    await client.query (
      `DELETE FROM routine_activities
      WHERE "routineId" = $1`, [id]
    )
    const request= await client.query(`
    DELETE FROM routines
    WHERE id=$1
    RETURNING *;
    `, [id])
  const { rows: [routine] } = request
      const returnObj = {success: routine? true:false}
      routine? returnObj.deleted = routine: null
      routine? returnObj.message = "You have successfully deleted":  returnObj.message = "Failed to delete"
      returnObj.error = routine ? false : true
console.log(returnObj)
    return returnObj
  }catch (error) {
    throw error
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
}