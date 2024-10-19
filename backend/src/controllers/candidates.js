import pool from "../pool.js";

export const addCandidates = async (req, res) =>{
    console.log('addcandidates');
    const { candidate_name, room_id } = req.body;
    try{
        const result = await pool.query(
            `INSERT INTO Candidates (candidate_name, room_id)
            VALUES ($1, $2) RETURNING *
            `,
            [candidate_name, room_id]
        );
        res.json(result.rows[0]);
    }
    catch(err){
        console.log(err);
        res.status(500).json({err : 'Error adding candidate'});
    }
};

export const getCandidates = async (req, res) =>{
    const { room_id } = req.params;
    try{
        const result = await pool.query(
            `SELECT * FROM Candidates
            WHERE room_id = $1`,
            [room_id]
        )
        res.json(result.rows);
    }
    catch(err){
        res.status(500).json({err : 'Error getting candidates'});
    }
};

