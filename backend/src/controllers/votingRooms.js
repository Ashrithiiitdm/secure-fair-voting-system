import pool from '../pool.js';

// Creating a new voting room
export const createVotingRoom = async (req, res) => {
    const { room_name, room_description, duration, duration_unit } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO Voting_rooms (room_name, room_description, duration, duration_unit)
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [room_name, room_description, duration, duration_unit]
        );
        
        res.json(result.rows[0]);
    }
    catch(err) {
        console.error(err);
        res.status(500).json({error: 'Error creating voting room'});
    }
};

export const getVotingRoom = async (req, res) => {
    const { room_id } = req.params;

    try {
        // First, close the room if it's expired
        await pool.query(
            `UPDATE Voting_rooms
            SET status = 'closed'
            WHERE room_id = $1 AND expiry <= NOW() AND status = 'open'`,
            [room_id]
        );

        // Then fetch the room data
        const result = await pool.query(
            `SELECT * FROM Voting_rooms WHERE room_id = $1`,
            [room_id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({error: 'Voting room not found'});
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({err: 'Error getting voting room'});
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

export const getResults = async (req, res) => {
    const { room_id } = req.params;

    try {
        const statusResult = await pool.query(
            `SELECT status FROM Voting_rooms WHERE room_id = $1
            `,
            [room_id]
        );

        if (statusResult.rows[0].status === 'open') {
            return res.status(403).json({error: 'Voting is still open'});
        }

        const result = await pool.query(
            `SELECT C.candidate_id, C.candidate_name, COALESCE(SUM(V.weighted_votes), 0) as total_weighted_votes
            FROM Candidates C
            LEFT JOIN Votes V ON C.candidate_id = V.candidate_id
            WHERE C.room_id = $1
            GROUP BY C.candidate_id, C.candidate_name
            ORDER BY total_weighted_votes DESC
            `,
            [room_id]
        );

        res.json(result.rows);
    } 
    catch(err) {
        console.error(err);
        res.status(500).json({error : 'Error getting voting results'});
    }
};

export const announceResults = async (req, res) => {
    const { room_id } = req.params;

    try {
        // First, close the voting
        await pool.query(
            `UPDATE Voting_rooms SET status = 'announced' WHERE room_id = $1`,
            [room_id]
        );

        // Then, get and return the results
        const result = await pool.query(
            `SELECT C.candidate_id, C.candidate_name, COALESCE(SUM(V.weighted_votes), 0) as total_weighted_votes
            FROM Candidates C
            LEFT JOIN Votes V ON C.candidate_id = V.candidate_id
            WHERE C.room_id = $1
            GROUP BY C.candidate_id, C.candidate_name
            ORDER BY total_weighted_votes DESC
            `,
            [room_id]
        );
        
        res.json({
            message: "Voting closed and results announced",
            results: result.rows
        });
    } 
    catch(err){
        console.error(err);
        res.status(500).json({error : 'Error announcing results'});
    }
};

// Add this function to the file
export const closeExpiredRooms = async () => {
    try {
        const result = await pool.query(
            `UPDATE Voting_rooms
            SET status = 'closed'
            WHERE expiry <= NOW() AND status = 'open'
            RETURNING room_id, room_name`
        );
        if (result.rows.length > 0) {
            console.log('Closed rooms:', result.rows);
        }
    } catch (err) {
        console.error('Error closing expired rooms:', err);
    }
};

//export default { createVoting_room, getVotingRoom, getAllVotingRooms };
