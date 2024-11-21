const GET_ALL_SESSIONS = 'SELECT * FROM UsersSesions as us, users WHERE users.id = us.user_logued'

export { GET_ALL_SESSIONS }