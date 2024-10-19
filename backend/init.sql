-- This file contains the queries for the initialization of the database in the container.

CREATE TABLE IF NOT EXISTS Voting_rooms (
  id SERIAL PRIMARY KEY,   -- Unique identifier for each voting room
  room_name VARCHAR(100) NOT NULL,  -- Name of the voting room
  room_description TEXT,         -- Optional description of the voting room
  expiry TIMESTAMP,         -- Expiry date of the voting room
  created_at TIMESTAMP DEFAULT NOW()  -- Timestamp for when the room was created
);

CREATE TABLE IF NOT EXISTS Candidates (
  id SERIAL PRIMARY KEY,     -- Unique identifier for each candidate
  candidate_name VARCHAR(100) NOT NULL, -- Candidate's name
  room_id INTEGER REFERENCES voting_rooms(id) ON DELETE CASCADE,  -- Foreign key pointing to the voting room
  votes_obtained float, --Put defualt  0
  created_at TIMESTAMP DEFAULT NOW()  -- Timestamp for when the candidate was added
);

CREATE TABLE IF NOT EXISTS Voters (
  id SERIAL PRIMARY KEY,          -- Unique identifier for each voter
  voter_name VARCHAR(100),           -- Voter's name
  votes INTEGER NOT NULL CHECK (votes BETWEEN 1 AND 10),
  email VARCHAR(100) UNIQUE,      -- Voter's email (must be unique)
  pass TEXT NOT NULL, 
  room_id INTEGER REFERENCES voting_rooms(id) ON DELETE CASCADE,  -- Foreign key referencing the voting room
  created_at TIMESTAMP DEFAULT NOW()  -- Timestamp for when the voter was added
);

CREATE TABLE Votes (
  id SERIAL PRIMARY KEY,           -- Unique identifier for each vote entry
  voter_id INTEGER REFERENCES voters(id) ON DELETE CASCADE,  -- Foreign key to identify the voter
  candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,  -- Foreign key to identify the candidate
  created_at TIMESTAMP DEFAULT NOW(),  -- Timestamp for when the vote was cast
);
