import pool from "../pool.js";

export const putVote = async (req, res) => {
    const { voter_id, candidate_id, votes } = req.body;
    
    if(votes <= 0){
        return res.status(400).json({error : 'Votes must be a positive number' });
    }

    try{
        // Start a transaction
        await pool.query('BEGIN');

        // Check total votes cast by this voter
        const totalVotesResult = await pool.query(
            `SELECT COALESCE(SUM(votes), 0) AS total_votes 
            FROM Votes WHERE voter_id = $1`,
            [voter_id]
        );
        const totalVotes = totalVotesResult.rows[0].total_votes;

        // Calculate new total votes
        let newTotalVotes = totalVotes + votes;

        if(newTotalVotes > 10){
            await pool.query('ROLLBACK');
            return res.status(400).json({ err: 'Voter has exceeded the 10 vote limit' });
        }

        // Apply proportional weighting
        let weightedVotes = votes;
        if(votes > 3){
            weightedVotes = 3 + (votes - 3) * 0.33; // 1/3 weight for votes above 3
        }

        // Cast the vote
        const result = await pool.query(
            `INSERT INTO Votes (voter_id, candidate_id, votes, weighted_votes) 
            VALUES ($1, $2, $3, $4) RETURNING *
            `,
            [voter_id, candidate_id, votes, weightedVotes]
        );

        // Update the total votes for the candidate
        await pool.query(
            `UPDATE Candidates 
            SET votes_obtained = votes_obtained + $1 
            WHERE candidate_id = $2`
            ,
            [weightedVotes, candidate_id]
        );

        // Commit the transaction
        await pool.query('COMMIT');

        res.json(result.rows[0]);
    }
    catch(err){
        await pool.query('ROLLBACK');
        console.error(err);
        res.status(500).json({error : 'Error casting vote'});
    }
};

//export default putVote;
