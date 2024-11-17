const INSERT_USER = 'INSERT INTO users (email, username, passwd, user_role, points) VALUES ($1, $2, $3, $4, $5)'
const FIND_USER_BY_EMAIL = 'SELECT * FROM users WHERE email = $1'

export { INSERT_USER, FIND_USER_BY_EMAIL }