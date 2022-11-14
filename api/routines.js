const express = require('express');
const { getAllRoutines, createRoutine } = require('../db');
const routinesRouter = express.Router();
const { requireUser } = require("./utils");

routinesRouter.use((req, res, next) => {
    console.log("A request is being made to /routines");
  
    next(); 
  });

// GET /api/routines

routinesRouter.get('/', async (req, res) => {
    const routines = await getAllRoutines();
  
    res.send( routines );
  });

// POST /api/routines
routinesRouter.post("/", requireUser, async (req, res, next) => {
  const { name, isPublic, goal } = req.body;
  const { creatorId } = req.user;
    console.log('this is...', creatorId)
  const routineData = { name, isPublic, goal };

  try {
    const newRoutine = await createRoutine(routineData);

    // if (existingActivity) {
    //   next({
    //     error: "ActivityExistsError",
    //     name: "ActivityExistsError",
    //     message: `An activity with name ${name} already exists`,
    //   });
    // } else {
    //   const newActivity = await createActivity(activityData);
      res.send(newRoutine);
  } catch (error) {
    next(error.name);
  }
});


// PATCH /api/routines/:routineId



// DELETE /api/routines/:routineId



// POST /api/routines/:routineId/activities



module.exports = routinesRouter;
