const express = require('express');
const usersRouter = express.Router();
const {getUserByUsername, createUser} = require('../db/users')
const {getAllRoutinesByUser, getPublicRoutinesByUser} = require('../db/routines')
const {requireUser} = require('./utils')
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

usersRouter.use((req,res, next) => {
  console.log("A request is being made to /users");

  next()
})


// POST /api/users/login

usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  // request must have both
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUserByUsername(username);

    if (user && user.password == password) {
      const token = jwt.sign(
        { id: user.id, username },
        process.env.JWT_SECRET,
        { expiresIn: "1w" }
      );

      res.send({ token, message: "you're logged in!" });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// POST /api/users/register

usersRouter.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password"
      })
    }

    if(password.length < 8) {
      next ({
        name: 'PasswordError', 
        message: 'Password must be at least 8 characters'
      });
    }
    
    try {
      const _user = await getUserByUsername(username);
      
      if (_user) {
        next({
          name: 'UserExistsError',
          message: `${username} is already taken. Please try a different one.`
        });
      } else {
        const user = await createUser({username, password
      });

      const token = jwt.sign({id: user.id, username}, JWT_SECRET, { expiresIn: "1w",})

      res.send({ 
        message: "thank you for signing up",
        token,
        user
      })
    }
    } catch ({ name, message }) {
      next({ name, message })
    } 
  });

// GET /api/users/me

usersRouter.get('/me', requireUser, async (req, res, next) => {
  try{
    res.send(req.user)
  }
  catch(error) {
    next(error);
  }
})

// GET /api/users/:username/routines

usersRouter.get('/:username/routines', async (req, res, next) => {

  const { username } = req.params

  try{
    const allUsers = await getAllRoutinesByUser(username);

    const routines = allUsers.filter(routine => {
      return routine.active || (req.user && routine.author.id === req.user.id)
    })

    res.send({routines: routines})
  }
  catch(error) {
    next(error);
  }
})

module.exports = usersRouter;
