const client = require('./client')

async function getRoutineActivityById(id){
  try{
    const {rows:[routineActivity]} = await client.query (`
      SELECT *
      FROM routine_activities
      WHERE id = $1
    `, [id])
    return routineActivity
  }catch (error) {
    throw error
  }
}

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const {rows: [routineActivity]} = await client.query (`
      INSERT INTO routine_activities ("routineId", "activityId", count, duration)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [routineId, activityId, count, duration])
    return routineActivity
  } catch (error) {
    console.log('Failed to add Activity to Routine')
    throw error
  }
    
}
//Questions on how this function works and what it returns in terms of the ID's associated with it.
async function getRoutineActivitiesByRoutine({id}) {
  try {
    const {rows} = await client.query (`
      SELECT routine_activities.*
      FROM routine_activities
      JOIN routines ON routine_activities."routineId" = routines.id
      WHERE routines.id = $1
    `, [id])
    return rows
  } catch (error) {
    throw error
  }
}

async function updateRoutineActivity ({id, ...fields}) {
 
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  if (setString.length === 0) {
    return;
  }

  try {
    const {rows: [ routineActivity ] } = await client.query(`
    UPDATE routine_activities
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
    `, Object.values(fields));

    return routineActivity
  }catch (error) {
    throw error
  }
}

async function destroyRoutineActivity(id) {
  try{
  const {rows: [routineActivity]} = await client.query (`
    DELETE FROM routine_activities
    WHERE id=$1
    RETURNING *
  `, [id])
  return routineActivity
  } catch (error) {
    throw error
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
