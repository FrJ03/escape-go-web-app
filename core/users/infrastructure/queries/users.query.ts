const INSERT_USER = 'INSERT INTO users (email, username, passwd, user_role, points) VALUES ($1, $2, $3, $4, $5)'
const FIND_USER_BY_EMAIL = 'SELECT * FROM users WHERE email = $1'
const FIND_USER_BY_USERNAME = 'SELECT * FROM users WHERE username = $1'
const FIND_USER_BY_ID = 'SELECT * FROM users WHERE id = $1'
const DELETE_USER = 'DELETE FROM users WHERE id = $1'
const GET_ALL_USERS = 'SELECT * FROM users'
const UPDATE_USER = 'UPDATE users SET email = $2, username = $3, passwd = $4, points = $5 WHERE id = $1;'

export { INSERT_USER, FIND_USER_BY_EMAIL, FIND_USER_BY_USERNAME, DELETE_USER, GET_ALL_USERS, FIND_USER_BY_ID, UPDATE_USER }