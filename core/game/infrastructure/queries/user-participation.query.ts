const INSERT_USER_PARTICIPATION = 'INSERT INTO usersparticipations (participant, participation, escape_room) VALUES ($1, $2, $3);'
const SELECT_ALL_BY_PARTICIPATION = 'SELECT up.participant, u.email, u.username, u.user_role, u.passwd, u.points as user_points, up.participation, p.start_time, p.end_time, p.points, up.escape_room as escape_room, e.title, e.description, e.solution, e.difficulty, e.price, l.id as physical_location, l.coordinates, l.street, l.street_number, l.other_info, ci.id as city, ci.city_name, co.id as country, co.country_name FROM usersparticipations up JOIN users u ON u.id = up.participant JOIN participations p ON p.id = up.participation JOIN escaperooms e ON p.escape_room = e.id JOIN locations l ON e.physical_location = l.id JOIN cities ci ON l.city = ci.id JOIN countries co ON ci.country = co.id WHERE up.participation = $1 AND up.escape_room = $2;'

export {INSERT_USER_PARTICIPATION, SELECT_ALL_BY_PARTICIPATION}