import pool from "../pool.js";

export const putVote = async (req, res) => {
    const { voter_id, candidate_id, votes } = req.body;
    try{
        const totalVotes = await pool.query(
            `SELECT COALESCE(SUM(votes), 0) AS total_votes 
            FROM Votes WHERE voter_id = $1
            `,
            [voter_id]
        );

        if(totalVotes.rows[0].total_votes + votes > 10){
            return res.status(400).json({err : 'Voter has exceeded the 10 vote limit'});
        }

        const result = await pool.query(
            `INSERT INTO Votes (voter_id, candidate_id, votes) 
            VALUES ($1, $2, $3) 
            ON CONFLICT (voter_id, candidate_id) 
            DO UPDATE SET votes = $3 RETURNING *
            `,
            [voter_id, candidate_id, votes]
        )
        res.json(result.rows[0]);

    }
    catch(err){
        res.status(500).json({err : 'Error casting vote'});
    }
};

//export default putVote;