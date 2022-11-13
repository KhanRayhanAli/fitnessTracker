const express = require('express');
const { getPublicRoutinesByActivity } = require('../db');
const { getAllActivities, createActivity } = require('../db/activities');
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

    try {
        const activity = await createActivity(activityData);

        if (activity) {
            res.send({ activity});
        } else {
            next({
                name: "CreateActivityError",
                message: "Failure to create new activity"
            })
        }
    } catch ({ name, message }) {
        next({ name, message })
    }
})

// PATCH /api/activities/:activityId



module.exports = activitiesRouter;
