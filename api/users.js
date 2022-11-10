const express = require('express');
const router = express.Router();
const {getUserByUsername, createUser} = require('../db/users')
const bcrypt = require('bcrypt')

// POST /api/users/login



// POST /api/users/register

router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
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
      }
  
      await createUser({
        username,
        password
      });
  
      res.send({ 
        message: "thank you for signing up",
      });
    } catch ({ name, message }) {
      next({ name, message })
    } 
  });

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
