const INSERT_ESCAPE_ROOM = 'INSERT INTO escaperooms (title, description, solution, difficulty, price, physical_location) VALUES ($1, $2, $3, $4, $5, $6);'
const INSERT_LOCATION = 'INSERT INTO locations (coordinates, street, street_number, other_info, city) VALUES ($1, $2, $3, $4, $5);'
const INSERT_CITY = 'INSERT INTO cities (city_name, country) VALUES ($1, $2);'
const INSERT_COUNTRY = 'INSERT INTO countries (country_name) VALUES ($1);'
const SELECT_CITY_BY_NAME = 'SELECT * FROM cities WHERE city_name = $1 AND country = $2;'
const SELECT_COUNTRY_BY_NAME = 'SELECT * FROM countries WHERE country_name = $1;'
const SELECT_LOCATION = 'SELECT * FROM locations WHERE coordinates = $1 AND street = $2 AND street_number = $3 AND other_info = $4 AND city = $5;'
const SELECT_ESCAPE_ROOMS = 'SELECT * FROM escaperooms, locations, cities, countries WHERE escaperooms.deleted = FALSE AND escaperooms.physical_location = locations.id AND locations.city = cities.id AND cities.country = countries.id;'
const SELECT_ESCAPE_ROOM_BY_ID = 'SELECT e.id, e.title, e.description, e.solution, e.difficulty, e.price, l.id as physical_location, l.coordinates, l.street, l.street_number, l.other_info, ci.id as city, ci.city_name, co.id as country, co.country_name FROM escaperooms e JOIN locations l ON e.physical_location = l.id JOIN cities ci ON l.city = ci.id JOIN countries co ON ci.country = co.id WHERE e.deleted = FALSE AND e.id = $1;'
const DELETE_ESCAPE_ROOM_BY_ID = 'UPDATE escaperooms SET deleted = TRUE WHERE id = $1 RETURNING id;'
const UPDATE_ESCAPE_ROOM_BY_ID = 'UPDATE escaperooms SET title = $2, description = $3, solution = $4, difficulty = $5, price = $6 WHERE id = $1 RETURNING id;';

export { INSERT_ESCAPE_ROOM, INSERT_LOCATION, INSERT_CITY, INSERT_COUNTRY, SELECT_CITY_BY_NAME, SELECT_COUNTRY_BY_NAME, SELECT_LOCATION, SELECT_ESCAPE_ROOMS,SELECT_ESCAPE_ROOM_BY_ID, DELETE_ESCAPE_ROOM_BY_ID, UPDATE_ESCAPE_ROOM_BY_ID }