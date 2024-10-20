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

-- Create a function to update the status and set the expiry
CREATE OR REPLACE FUNCTION update_voting_room_status_and_expiry()
RETURNS TRIGGER AS $$
BEGIN
  -- Set the expiry based on duration and duration_unit
  IF NEW.duration_unit = 'minutes' THEN
    NEW.expiry := NEW.created_at + (NEW.duration * INTERVAL '1 minute');
  ELSIF NEW.duration_unit = 'hours' THEN
    NEW.expiry := NEW.created_at + (NEW.duration * INTERVAL '1 hour');
  END IF;

  -- Update the status based on the new expiry
  IF NEW.expiry <= NOW() THEN
    NEW.status := 'closed';
  ELSE
    NEW.status := 'open';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to update status and expiry when a voting room is created or updated
CREATE TRIGGER update_voting_room_trigger
BEFORE INSERT OR UPDATE ON Voting_rooms
FOR EACH ROW
EXECUTE FUNCTION update_voting_room_status_and_expiry();

-- Function to update room status based on expiry
CREATE OR REPLACE FUNCTION update_room_status()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE Voting_rooms
  SET status = 'closed'
  WHERE room_id = NEW.room_id AND expiry <= NOW() AND status = 'open';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to run the function
CREATE TRIGGER check_room_expiry
AFTER INSERT OR UPDATE ON Votes
FOR EACH ROW
EXECUTE FUNCTION update_room_status();
