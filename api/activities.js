const express = require('express');
const { getPublicRoutinesByActivity } = require('../db');
const { getAllActivities, createActivity, getActivityByName, updateActivity, getActivityById } = require('../db/activities');
const { requireUser } = require('./utils')
const activitiesRouter = express.Router();


activitiesRouter.use((req,res, next) => {
    console.log("A request is being made to /activities");
  
    next()
  })

// GET /api/activities/:activityId/routines

activitiesRouter.get('/:activityId/routines', async (req, res, next) => {
    const { activityId: id } = req.params;

    // try {
    const routines = await getPublicRoutinesByActivity({id});

    // if (routines) {
        res.send(routines)})
//     } else {
//         next({
//             name: "RoutineActivityError",
//             message: "Requested routine does not exist",
//         })
//      }
//     } catch (error) {
//     next (error)
//     }
// })

// GET /api/activities

activitiesRouter.get('/', async (req, res) => {
    const activities = await getAllActivities();

    res.send(activities)
})

// POST /api/activities

activitiesRouter.post('/', requireUser, async (req, res, next) => {
    const { name, description = ""} = req.body;

    const activityData = { name, description };

    try {
        
        const existingActivity = await getActivityByName(name);

        if(existingActivity) { next({
                    error: "ActivityExistsError",
                    name: "ActivityExistsError",
                    message: `An activity with name ${name} already exists`
                })}
                else { 
                const newActivity = await createActivity(activityData);
                 res.send(newActivity)
            }
   } catch (error) {
        next(error.name)
    }  })
 

// PATCH /api/activities/:activityId

activitiesRouter.patch("/:activityId", async (req, res, next) => {
    const {activityId: id} = req.params
    const fields = req.body
    // const activity = await getActivityById(id)
   try {
    const activityWithId = await getActivityById(id)
    if (!activityWithId) {
        next({
            error: "Activity Does Not Exist",
            name: "Activity Does Not Exist",
            message: `Activity ${id} not found`
        })
    }
    const activityWithName= await getActivityByName(fields.name)
    if (activityWithName) {
        next({
            error: "Activity Does Not Exist",
            name: "Activity Does Not Exist",
            message: `An activity with name ${fields.name} already exists`
        })
    }
    // console.log("hello", fields)
    const updatedActivity = await updateActivity({id, ...fields})
    
    
    res.send(updatedActivity)
} catch (error) {
    console.error(error)
}
})


module.exports = activitiesRouter;
