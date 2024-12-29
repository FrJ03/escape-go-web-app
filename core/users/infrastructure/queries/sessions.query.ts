const GET_ALL_SESSIONS = 'SELECT * FROM UsersSessions as us, users WHERE users.id = us.user_logued'
const GET_SESSIONS_BY_USER = 'SELECT * FROM UsersSessions as us, users WHERE users.id = us.user_logued AND us.user_logued = $1'
const INSERT_SESSION = 'INSERT INTO userssessions (session_date, user_logued) VALUES ($1, $2)'
const DELETE_SESSIONS_BY_USER = 'DELETE FROM userssessions WHERE user_logued = $1'

export { GET_ALL_SESSIONS, GET_SESSIONS_BY_USER, INSERT_SESSION, DELETE_SESSIONS_BY_USER }