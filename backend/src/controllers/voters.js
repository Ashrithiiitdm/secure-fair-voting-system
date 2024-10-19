import pool from "../pool.js";

// Add a new voter
export const addVoter = async (req, res) => {
    const { voter_name, email, pass, room_id } = req.body;
    
    try {
        const result = await pool.query(
            `INSERT INTO Voters (voter_name, email, pass, room_id) 
            VALUES ($1, $2, $3, $4) RETURNING *
            `,
            [voter_name, email, pass, room_id]
        );
        res.json(result.rows[0]);
    } 
    catch(err){
        res.status(500).json({err : 'Error adding voter' });
    }
};

// Get all voters in a specific room
export const getVotersByRoom = async (req, res) => {
    const { room_id } = req.params;
    try {
        const result = await pool.query(
            `SELECT * FROM Voters WHERE room_id = $1`,
            [room_id]
        );
        res.json(result.rows);
    } 
    catch(err){
        res.status(500).json({err: 'Error fetching voters' });
    }
};

//export default { addVoter, getVotersByRoom };