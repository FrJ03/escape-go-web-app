const GET_ALL_SESSIONS = 'SELECT * FROM UsersSessions as us, users WHERE users.id = us.user_logued'
const GET_SESSIONS_BY_USER = 'SELECT * FROM UsersSessions as us, users WHERE users.id = us.user_logued AND us.user_logued = $1'
const INSERT_SESSION = 'INSERT INTO userssessions (session_date, user_logued) VALUES ($1, $2)'

export { GET_ALL_SESSIONS, GET_SESSIONS_BY_USER, INSERT_SESSION }