const client = require("./client");
const bcrypt = require('bcrypt')

const SALT_COUNT = 10;
// database functions

// user functions
async function createUser({ username, password }) {

const hashedPassword = await bcrypt.hash(password, SALT_COUNT)
let userToAdd = {username, hashedPassword }

  try {
    const { rows: [user] } = await client.query(`
      INSERT INTO users(username, password)
      VALUES($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING username, id;
      `, [username, hashedPassword]);
    
      // delete user.password
      return user;
  } catch (error) {
    console.log('Create User Error')
    throw error;
  }
}

async function getUser({ username, password }) {
    const user = await getUserByUsername(username);
    if (!user) {
      return null
    }
    const hashedPassword = user.password;
    let passwordsMatch = await bcrypt.compare(password, hashedPassword) 

//     const { rows } = await client.query(`
//       SELECT username, password
//       FROM users;
// `, [username, password]); 

if (passwordsMatch) {
      delete user.password
      return user;
    } else {
        return null
      }
  } 
  
async function getUserById(userId) {
  try {
    const { rows: [user] } = await client.query(`
      SELECT id, username FROM users
      WHERE id = ${userId}
    `)
    // if(!user){
    //   return null
    // }

    // delete user.password
    // const allPosts = await getPostsByUser(userId)
    // user.posts = allPosts
    return user

  } catch (error) {
    console.log('getUserById check')
    throw error
  }
}

async function getUserByUsername(username) {
  try {
    const { rows: [user] } = await client.query(`
      SELECT *
      FROM users
      WHERE username=$1;
    `, [username]);

    return user;
  } catch (error) {
    console.log('UserbyUsername Check') 
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
