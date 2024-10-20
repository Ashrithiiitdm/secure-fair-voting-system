import pool from "../pool.js";

export const putVote = async (req, res) => {
    const { voter_id, candidate_id, votes } = req.body;
    
    if(votes <= 0){
        return res.status(400).json({error : 'Votes must be a positive number' });
    }

    try{
        // Start a transaction
        await pool.query('BEGIN');

        // Check if the voting room is still open and not expired
        const roomStatusResult = await pool.query(
            `SELECT status, expiry FROM Voting_rooms
            WHERE room_id = (SELECT room_id FROM Candidates WHERE candidate_id = $1)
            AND status = 'open'
            `,
            [candidate_id]
        );
        console.log(roomStatusResult.rows);
        if (roomStatusResult.rows[0].status !== 'open') {
            await pool.query('ROLLBACK');
            return res.status(400).json({ error: 'Voting for this room is closed or expired' });
        }

        // Check total votes cast by this voter
        const totalVotesResult = await pool.query(
            `SELECT COALESCE(SUM(votes), 0) AS total_votes 
            FROM Votes WHERE voter_id = $1;`,
            [voter_id]
        );
        const totalVotes = totalVotesResult.rows[0].total_votes;
        console.log("Total Votes", totalVotes);
        // Calculate new total votes
        let newTotalVotes = parseInt(totalVotes) + parseInt(votes);
        console.log("New Total Votes", newTotalVotes);
        console.log("Votes", votes);

        if (newTotalVotes > 10) {
            await pool.query('ROLLBACK');
            return res.status(400).json({ err: 'Voter has exceeded the 10 vote limit' });
        }

        // Apply proportional weighting
        let weightedVotes = votes;
        if(votes > 3){
            weightedVotes = 3 + (votes - 3) * 0.33; // 1/3 weight for votes above 3
        }
        console.log("Votes", votes);
        console.log("Weighted Votes", typeof(weightedVotes));
        // Cast the vote
        const result = await pool.query(
            `INSERT INTO Votes (voter_id, candidate_id, votes, weighted_votes) 
            VALUES ($1, $2, $3, $4) RETURNING *;`,
            [voter_id, candidate_id, votes, weightedVotes]
        );

        // Update the total votes for the candidate
        const update = await pool.query(
            `UPDATE Candidates 
            SET votes_obtained = votes_obtained + $1 
            WHERE candidate_id = $2
            RETURNING *`
            ,
            [weightedVotes, candidate_id]
        );

        // Commit the transaction
        await pool.query('COMMIT');
        //  console.log("result", result.rows[0]);
        res.json(result.rows[0]);
    }
    catch(err){
        await pool.query('ROLLBACK');
        console.error(err);
        res.status(500).json({error : 'Error casting vote'});
    }
};

//export default putVote;
