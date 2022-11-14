const express = require('express');
const { getPublicRoutinesByActivity } = require('../db');
const { getAllActivities, createActivity, getActivityByName } = require('../db/activities');
const { requireUser } = require('./utils')
const activitiesRouter = express.Router();


activitiesRouter.use((req,res, next) => {
    console.log("A request is being made to /activities");
  
    next()
  })

// GET /api/activities/:activityId/routines

activitiesRouter.get('/:activityId/routines', async (req, res, next) => {
    const { id } = req.params;

    // try {
    const routines = await getPublicRoutinesByActivity(id);

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
    
    // console.log('this is', activityData)

    try {
        
        const existingActivity = await getActivityByName(name);

        if(existingActivity) { next({
                    error: "ActivityExistsError",
                    name: "ActivityExistsError",
                    message: `An activity with name ${name} already exists`
                })}
        // console.log('Hello this is', allActivities)
       
        // console.log('bonjour', newActivity)
        
        // existingActivities.map((activity) => {
        //     // console.log('hola', activity)
        //     if( newActivity.name == activity.name) {
        //         // console.log('aloha', newActivity.name, activity.name)
               
        //     } 
                else { 
                const newActivity = await createActivity(activityData);
                 res.send(newActivity)
            }
   } catch (error) {
        next(error.name)
    }  })
 

        // if (activity) {
            // res.send(newActivity);
        // } else {
        //     next({
        //         name: "CreateActivityError",
        //         message: "Failure to create new activity"
        //     })
        // }
 

// PATCH /api/activities/:activityId



module.exports = activitiesRouter;
