const express = require("express");
const usersRouter = express.Router();
const { getUserByUsername, createUser } = require("../db");
const {
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
} = require("../db/routines");
const { requireUser } = require("./utils");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next();
});

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

      res.send({ token, user, message: "you're logged in!" });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error, "error1");
    next(error);
  }
});

// POST /api/users/register

usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }
  if (password.length < 8) {
    next({
      name: "PasswordLengthError",
      message: "Password Too Short!",
    });
  }
  try {
    const _user = await getUserByUsername(username);
    if (_user) {
      next({
        name: "UserExistError",
        message: `User ${username} is already taken.`,
      });
    } else {
      console.log(username);
      const user = await createUser({ username, password });
      const token = jwt.sign({ id: user.id, username }, JWT_SECRET, {
        expiresIn: "1w",
      });
      res.send({ message: "Thank you for signing up!", token, user });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// usersRouter.post("/register", async (req, res, next) => {
//   const { username, password } = req.body;
//   if (password.length < 8) {
//       next({
//         name: "PasswordLengthError",
//         message: "Password Too Short!"
//       });
//     }

//   try {
//     if (!username || !password) {
//       next({
//         name: "MissingCredentialsError",
//         message: "Please supply both a username and password",
//       });
//     }

//     const _user = await getUserByUsername(username);

//     if (_user) {
//       next({
//         name: "UserExistsError",
//         message: `${username} is already taken. Please try a different one.`,
//         error: "UserExistsError",
//       });
//     } else {
//       const user = await createUser({ username, password });

//       const token = jwt.sign({ id: user.id, username }, JWT_SECRET, {
//         expiresIn: "1w",
//       });

//       res.send({
//         message: "thank you for signing up",
//         token,
//         user,
//       });
//     }
//   } catch (error) {
//     next();
//   }
// });

// GET /api/users/me

usersRouter.get("/me", requireUser, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    console.log(error, "error2");
    next(error.name, error.message);
  }
});

// GET /api/users/:username/routines

usersRouter.get("/:username/routines", async (req, res, next) => {
  const { username } = req.params;
  console.log("this is", username);
  try {
    const routinesFromDB = await getAllRoutinesByUser({ username });
    const publicRoutines = await getPublicRoutinesByUser({ username });

    console.log("these are", publicRoutines);
    // const routinesFiltered = routinesFromDB.filter((routine) => {
    //   return routine.active || (req.user && routine.author.id === req.user.id);
    // });

    // if (username) {
    //   return routinesFromDB
    // }

    res.send(publicRoutines);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
