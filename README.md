# Secure Fair Voting System

This project implements a secure and fair voting system using Node.js, Express, and PostgreSQL. It allows for the creation of voting rooms, registration of voters and candidates, and a weighted voting mechanism to ensure fairness and avoid manipulation.

## Features

- We can create and manage voting rooms with customizable durations by setting the duration in minutes or hours.
- We can register voters and candidates to the voting room to ensure fairness.
- The authentication is using JWT tokens and bcrypt for hashing the passwords.
- Weighted voting system (votes above 3 count for less) is applied to the votes.
- To reduce the impact of "strategic voting" where users might try to manipulate results by giving disproportionate votes to a single candidate, you can introduce vote weighting. For example, if a voter allocates more than 3 votes to one candidate, the votes above 3 get a reduced value.
- The voting rooms are automatically closed after the duration ends.
- The results are calculated and announced after the voting room is closed.

## Prerequisites

- Node.js (v14 or later recommended)
- PostgreSQL database
- npm (Node Package Manager)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/secure-fair-voting-system.git
   cd secure-fair-voting-system/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up your PostgreSQL database and update the `.env` file with your database credentials.

4. Run the SQL script in `backend/init.sql` to set up your database schema.

5. Start the server:
   ```
   npm start
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:
    DB_USER='your_username'
    DB_HOST='your_host'
    DB_NAME='your_database_name'
    DB_PASS='your_password'
    DB_PORT='your_port'
    PORT='your_port'
    JWT_SECRET='your_secret_key'

## API Endpoints

- POST `/register/voter`: Register a new voter
- POST `/register/candidate`: Register a new candidate
- POST `/voting-rooms`: Create a new voting room
- GET `/voting-rooms`: Get all voting rooms
- GET `/voting-rooms/:room_id`: Get a specific voting room
- POST `/votes`: Cast a vote
- GET `/voting-rooms/:room_id/results`: Get voting results (for closed rooms)
- POST `/voting-rooms/:room_id/announce`: Announce results
