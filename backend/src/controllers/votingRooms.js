import pool from '../pool.js';

// Creating a new voting room
const createVoting_room = async (req, res) => {
    const {name, description, expiry} = req.body;

    try{
        const result = await pool.query(
            `INSERT INTO Voting_rooms (room_name, room_description, expiry)
            VALUES ($1, $2, $3) RETURNING *`, [name, description, expiry]);
        
        return result.rows;
    }
    catch(err){
        
    }
};