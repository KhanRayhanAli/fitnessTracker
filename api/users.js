const express = require('express');
const usersRouter = express.Router();
const {getUserByUsername, createUser} = require('../db/users')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const { SALT_COUNT } = process.env;

usersRouter.use((req,res, next) => {
  console.log("A request is being made to /users");

  next()
})


// POST /api/users/login



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
          message: 'A user by that username already exists'
        });
      } else {
        const user = await createUser({username, password
      });

      const token = jwt.sign({id: user.id, username}, SALT_COUNT, { expiresIn: "1w",})

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

// GET /api/users/:username/routines

module.exports = usersRouter;
