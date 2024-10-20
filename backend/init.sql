-- This file contains the queries for the initialization of the database in the container.

CREATE TABLE IF NOT EXISTS Voting_rooms (
  room_id SERIAL PRIMARY KEY,
  room_name VARCHAR(100) NOT NULL,
  room_description TEXT,
  duration INTEGER NOT NULL,
  duration_unit VARCHAR(10) NOT NULL CHECK (duration_unit IN ('minutes', 'hours')),
  expiry TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'announced'))
);

CREATE TABLE IF NOT EXISTS Candidates (
  candidate_id SERIAL PRIMARY KEY,
  candidate_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  pass TEXT NOT NULL,
  room_id INTEGER REFERENCES Voting_rooms(room_id) ON DELETE CASCADE,
  votes_obtained INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS Voters (
  voter_id SERIAL PRIMARY KEY,
  voter_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  pass TEXT NOT NULL, 
  room_id INTEGER REFERENCES Voting_rooms(room_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS Votes (
  vote_id SERIAL PRIMARY KEY,
  voter_id INTEGER REFERENCES Voters(voter_id) ON DELETE CASCADE,
  candidate_id INTEGER REFERENCES Candidates(candidate_id) ON DELETE CASCADE,
  votes INTEGER NOT NULL,
  weighted_votes FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);