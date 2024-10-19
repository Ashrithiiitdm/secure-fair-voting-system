import pool from '../pool.js';

// Creating a new voting room
export const createVotingRoom = async (req, res) => {
    const {room_name, room_description, expiry} = req.body;

    try{
        const result = await pool.query(
            `INSERT INTO Voting_rooms (room_name, room_description, expiry)
            VALUES ($1, $2, $3) RETURNING *`, [room_name, room_description, expiry]
        );
        
        res.json(result.rows[0]);
    }
    catch(err){
        console.log(err);
        res.status(500).json({err: 'Error creating voting room'});
    }
};

export const getVotingRoom = async (req, res) =>{
    const { room_id } = req.params;

    try{
        const result = await pool.query(
            `SELECT * FROM Voting_rooms WHERE room_id = $1`, [room_id]
        );
        
        if(result.rows.length === 0){
            return res.status(404).json({error: 'Voting room not found'});
        }

        res.json(result.rows[0]);
    }
    catch(err){
        console.log(err);
        res.status(500).json({err: 'Error getting voting rooms'});
    }
};


export const getAllVotingRooms = async (req, res) =>{
    try{
        const result = await pool.query(
            `SELECT * FROM Voting_rooms`
        );

        res.json(result.rows);
    }
    catch(err){
        res.status(500).json({err : 'Error getting all voting rooms'});
    }
};

//export default { createVoting_room, getVotingRoom, getAllVotingRooms };