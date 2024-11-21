const GET_ALL_SESSIONS = 'SELECT * FROM UsersSessions as us, users WHERE users.id = us.user_logued'
const GET_SESSIONS_BY_USER = 'SELECT * FROM UsersSessions as us, users WHERE users.id = us.user_logued AND us.user_logued = $1'

export { GET_ALL_SESSIONS, GET_SESSIONS_BY_USER }