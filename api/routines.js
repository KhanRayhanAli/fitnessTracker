const express = require('express');
const { getAllRoutines, createRoutine, getRoutineById } = require('../db');
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

  const routineData = { name, isPublic, goal };

  const newRoutine = await createRoutine(routineData);

  try {
    newRoutine.creatorId = newRoutine.id
    const {id, ...newRoutineObj} = newRoutine
    console.log("This is new", newRoutineObj)

  
      res.send(newRoutineObj);
  } catch (error) {
    next(error.name);
  }
});


// PATCH /api/routines/:routineId



// DELETE /api/routines/:routineId



// POST /api/routines/:routineId/activities



module.exports = routinesRouter;
