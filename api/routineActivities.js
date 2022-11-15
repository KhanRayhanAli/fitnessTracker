const express = require('express');
const { requireUser } = require('./utils');
const { getRoutineActivityById, updateRoutineActivity, destroyRoutineActivity } = require('../db')
const routineActivitiesRouter = express.Router();

routineActivitiesRouter.use((req,res, next) => {
    console.log("A request is being made to /routine_activities");
  
    next()
  })

// PATCH /api/routine_activities/:routineActivityId

// DELETE /api/routine_activities/:routineActivityId

routineActivitiesRouter.delete('/:routineActivityId', requireUser, async (req, res, next) => {
  try {
    const {routineActivityId: id } = req.params
    const routineActivity = await destroyRoutineActivity(id);
    console.log('routineActivity', routineActivity)
    res.send(routineActivity)
    
  } catch ({ name, message }) {
    next({ name, message })
  }
  });
// routineActivitiesRouter.delete('/:routineActivityId', requireUser, async (req, res, next) => {
//     try {
//       const routineActivity = await getRoutineActivityById({id:req.params.routineActivityId});
  
//       if (routineActivity && routineActivity.author.id === req.user.id) {
//         const updatedRoutineActivity = await updateRoutineActivity(routineActivity.id, { active: false });
  
//         res.send({ post: updatedRoutineActivity });
//       } else {
//         // if there was a routine activity, throw UnauthorizedUserError, otherwise throw RoutineActivityNotFoundError
//         next(routineActivity ? { 
//           name: "UnauthorizedUserError",
//           message: "You cannot delete a RoutineActivity which is not yours"
//         } : {
//           name: "RoutineActivityNotFoundError",
//           message: "That RoutineActivity does not exist"
//         });
//       }
  

module.exports = routineActivitiesRouter;
