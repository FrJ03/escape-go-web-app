DROP TABLE IF EXISTS UsersParticipations;
DROP TABLE IF EXISTS UsersSessions;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Participations;
DROP TABLE IF EXISTS Clues;
DROP TABLE IF EXISTS EscapeRooms;
DROP TABLE IF EXISTS Locations;
DROP TABLE IF EXISTS Cities;
DROP TABLE IF EXISTS Countries;

CREATE TABLE IF NOT EXISTS Users(
    id SERIAL PRIMARY KEY,
    email VARCHAR(64) NOT NULL UNIQUE,
    username VARCHAR(64) NOT NULL UNIQUE,
    passwd VARCHAR(128) NOT NULL,
    user_role VARCHAR(16) NOT NULL CHECK(
        user_role = 'participant' OR user_role = 'admin'
    ),
    points INTEGER
);

CREATE TABLE IF NOT EXISTS UsersSessions(
    id SERIAL PRIMARY KEY,
    session_date BIGINT NOT NULL,
    user_logued BIGINT,
    FOREIGN KEY (user_logued) REFERENCES Users(id)
);

CREATE TABLE IF NOT EXISTS Countries(
    id SERIAL PRIMARY KEY,
    country_name VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS Cities(
    id SERIAL PRIMARY KEY,
    city_name VARCHAR(64),
    country BIGINT,
    FOREIGN KEY (country) REFERENCES Countries(id)
);

CREATE TABLE IF NOT EXISTS Locations(
    id SERIAL PRIMARY KEY,
    coordinates VARCHAR(32),
    street VARCHAR(64),
    street_number INTEGER,
    other_info VARCHAR(64),
    city BIGINT,
    FOREIGN KEY (city) REFERENCES Cities(id)
);

CREATE TABLE IF NOT EXISTS EscapeRooms(
    id SERIAL PRIMARY KEY,
    title VARCHAR(64) NOT NULL,
    description VARCHAR(256),
    solution VARCHAR(32) NOT NULL,
    difficulty INTEGER CHECK(difficulty IN (0, 1, 2, 3, 4, 5)),
    price INTEGER,
    physical_location BIGINT,
    deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (physical_location) REFERENCES Locations(id)
);

CREATE TABLE IF NOT EXISTS Clues(
    id SERIAL,
    escape_room BIGINT,
    title VARCHAR(64),
    info VARCHAR(256),
    PRIMARY KEY (escape_room, id),
    FOREIGN KEY (escape_room) REFERENCES EscapeRooms(id)
);

CREATE TABLE IF NOT EXISTS Participations(
    id SERIAL,
    escape_room BIGINT,
    start_time BIGINT,
    points INTEGER,
    end_time BIGINT,
    FOREIGN KEY (escape_room) REFERENCES EscapeRooms(id),
    PRIMARY KEY (id, escape_room)
);

CREATE TABLE IF NOT EXISTS UsersParticipations(
    participant BIGINT,
    participation BIGINT,
    escape_room BIGINT,

    FOREIGN KEY (participant) REFERENCES Users(id),
    FOREIGN KEY (participation, escape_room) REFERENCES Participations(id, escape_room),
    PRIMARY KEY(participant, escape_room, participation)
)