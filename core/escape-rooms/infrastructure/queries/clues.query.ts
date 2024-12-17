const INSERT_CLUE = 'INSERT INTO clues (escape_room, title, info) VALUES ($1, $2, $3);'
const GET_CLUE_BY_ID = 'SELECT * FROM clues WHERE id = $1 AND escape_room = $2;'
const GET_ALL_CLUES_BY_ESCAPE_ROOM = 'SELECT * FROM clues WHERE escape_room =$1 ORDER BY id;'

export {INSERT_CLUE, GET_CLUE_BY_ID, GET_ALL_CLUES_BY_ESCAPE_ROOM}