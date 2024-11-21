const GET_ALL_SESSIONS = 'SELECT * FROM UsersSessions as us, users WHERE users.id = us.user_logued'

export { GET_ALL_SESSIONS }