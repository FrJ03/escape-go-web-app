const INSERT_CLUE = 'INSERT INTO clues (escape_room, title, info) VALUES ($1, $2, $3);'
const GET_CLUE_BY_ID = 'SELECT * FROM clues WHERE id = $1 AND escape_room = $2;'

export {INSERT_CLUE, GET_CLUE_BY_ID}