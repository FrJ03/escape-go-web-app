DROP TABLE CrecimientoUsuarios;
DROP TABLE Users;
DROP TABLE UsersSessions;
DROP TABLE Countries
DROP TABLE Cities;
DROP TABLE Locations;
DROP TABLE EscapeRooms;
DROP TABLE Clue;
DROP TABLE Participations;
DROP TABLE UsersParticipations;

CREATE TABLE IF NOT EXISTS CrecimientoUsuarios(
    id SERIAL PRIMARY KEY
    info_date DATE,
    n_usuarios INTEGER,
    crecimiento INTEGER
);

CREATE TABLE IF NOT EXISTS Users(
    id SERIAL PRIMARY KEY,
    email VARCHAR(64) NOT NULL UNIQUE,
    username VARCHAR(64) NOT NULL UNIQUE,
    passwd VARCHAR(128) NOT NULL
    user_role VARCHAR(16) NOT NULL CHECK(
        'participant', 'admin'
    )
    points INTEGER
);

CREATE TABLE IF NOT EXISTS UsersSessions(
    id SERIAL PRIMARY KEY,
    session_date NOT NULL,
    user BIGINT UNSIGNED,
    FOREIGN KEY (user) REFERENCES Users(id)
);

CREATE TABLE IF NOT EXISTS Countries(
    id SERIAL PRIMARY KEY,
    country_name VARCHAR(64)
)

CREATE TABLE IF NOT EXISTS Cities(
    id SERIAL PRIMARY KEY,
    city_name VARCHAR(64),
    country BIGINT SERIAL,
    FOREIGN KEY (country) REFERENCES Countries(id)
);

CREATE TABLE IF NOT EXISTS Locations(
    id SERIAL PRIMARY KEY,
    coordinates VARCHAR(32),
    street VARCHAR(64),
    street_number INTEGER,
    other_info VARCHAR(64),
    city BIGINT UNSIGNED,
    FOREIGN KEY (city) REFERENCES Cities(id)
);

CREATE TABLE IF NOT EXISTS EscapeRooms(
    id SERIAL PRIMARY KEY,
    title VARCHAR(64) NOT NULL,
    description VARCHAR(256),
    solution VARCHAR(32) NOT NULL,
    difficulty INTEGER CHECK(0, 1, 2, 3, 4, 5)
    price INTEGER
    physical_location BIGINT UNSIGNED
    FOREIGN KEY physical_location REFERENCES Locations(id)
);

CREATE TABLE IF NOT EXISTS Clue(
    id SERIAL,
    escape_room BIGINT UNSIGNED,
    title VARCHAR(64),
    info VARCHAR(128),
    PRIMARY KEY (escape_room, id),
    FOREIGN KEY (escape_room) REFERENCES EscapeRooms(id)
);

CREATE TABLE IF NOT EXISTS Participations(
    id SERIAL,
    escape_room BIGINT UNSIGNED,
    participation_date DATE,
    points INTEGER,
    duration TIME
    FOREIGN KEY (escape_room) REFERENCES EscapeRooms(id)
);

CREATE TABLE IF NOT EXISTS UsersParticipations(
    user BIGINT UNSIGNED,
    participation BIGINT UNSIGNED,
    escape_room BIGINT UNSIGNED,

    FOREIGN KEY (user) REFERENCES Users(id)
    FOREIGN KEY (participantion) REFERENCES Participations(id)
    FOREIGN KEY (escape_room) REFERENCES Participations(escape_room)

    PRIMARY KEY(user, escape_room, participantion)
)