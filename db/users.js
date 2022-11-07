const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    const { rows: [user] } = await client.query(`
      INSERT INTO users(username, password)
      VALUES($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
      `, [username, password]);

      return user;
  } catch (error) {
    console.log('Create User Error')
    throw error;
  }
}

async function getUser({ username, password }) {
    const { rows } = await client.query(`
      SELECT username, password
      FROM users;
`); 

      return rows;
  } 
  
async function getUserById(userId) {
  try {
    const { rows: [user] } = await client.query(`
      SELECT * FROM users
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
