-- This file contains the queries for the initialization of the database in the container.

CREATE TABLE IF NOT EXISTS Voting_rooms (
  room_id SERIAL PRIMARY KEY,   -- Unique identifier for each voting room
  room_name VARCHAR(100) NOT NULL,  -- Name of the voting room
  room_description TEXT,         -- Optional description of the voting room
  expiry TIMESTAMP,         -- Expiry date of the voting room
  created_at TIMESTAMP DEFAULT NOW()  -- Timestamp for when the room was created
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'announced'))
);

CREATE TABLE IF NOT EXISTS Candidates (
  candidate_id SERIAL PRIMARY KEY,     -- Unique identifier for each candidate
  candidate_name VARCHAR(100) NOT NULL, -- Candidate's name
  room_id INTEGER REFERENCES Voting_rooms(room_id) ON DELETE CASCADE,  -- Foreign key pointing to the voting room
  votes_obtained float DEFAULT 0, --Put defualt  0
  created_at TIMESTAMP DEFAULT NOW()  -- Timestamp for when the candidate was added
);

CREATE TABLE IF NOT EXISTS Voters (
  voter_id SERIAL PRIMARY KEY,          -- Unique identifier for each voter
  voter_name VARCHAR(100),           -- Voter's name
  votes INTEGER DEFAULT 10 NOT NULL CHECK (votes BETWEEN 1 AND 10),
  email VARCHAR(100) UNIQUE,      -- Voter's email (must be unique)
  pass TEXT NOT NULL, 
  room_id INTEGER REFERENCES Voting_rooms(room_id) ON DELETE CASCADE,  -- Foreign key referencing the voting room
  created_at TIMESTAMP DEFAULT NOW()  -- Timestamp for when the voter was added
);

CREATE TABLE IF NOT EXISTS Votes (
  vote_id SERIAL PRIMARY KEY,
  voter_id INTEGER REFERENCES Voters(voter_id) ON DELETE CASCADE,
  candidate_id INTEGER REFERENCES Candidates(candidate_id) ON DELETE CASCADE,
  votes FLOAT NOT NULL,
  weighted_votes FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
