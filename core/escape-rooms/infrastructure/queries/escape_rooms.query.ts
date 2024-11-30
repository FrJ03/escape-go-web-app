const INSERT_ESCAPE_ROOM = 'INSERT INTO escaperooms (title, description, solution, difficulty, price, physical_location) VALUES ($1, $2, $3, $4, $5, $6);'
const INSERT_LOCATION = 'INSERT INTO locations (coordinates, street, street_number, other_info, city) VALUES ($1, $2, $3, $4, $5);'
const INSERT_CITY = 'INSERT INTO cities (city_name, country) VALUES ($1, $2);'
const INSERT_COUNTRY = 'INSERT INTO countries (country_name) VALUES ($1);'
const SELECT_CITY_BY_NAME = 'SELECT * FROM cities WHERE city_name = $1 AND country = $2;'
const SELECT_COUNTRY_BY_NAME = 'SELECT * FROM countries WHERE country_name = $1;'
const SELECT_LOCATION = 'SELECT * FROM locations WHERE coordinates = $1 AND street = $2 AND street_number = $3 AND other_info = $4 AND city = $5'

export { INSERT_ESCAPE_ROOM, INSERT_LOCATION, INSERT_CITY, INSERT_COUNTRY, SELECT_CITY_BY_NAME, SELECT_COUNTRY_BY_NAME, SELECT_LOCATION }