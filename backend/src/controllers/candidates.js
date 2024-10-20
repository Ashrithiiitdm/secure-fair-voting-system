import pool from "../pool.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export const addCandidates = async (req, res) => {
    console.log('addcandidates');
    const { candidate_name, email, password, room_id } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            `INSERT INTO Candidates (candidate_name, email, pass, room_id)
            VALUES ($1, $2, $3, $4) RETURNING *
            `,
            [candidate_name, email, hashedPassword, room_id]
        );
        const { pass, ...candidateWithoutPassword } = result.rows[0];
        res.json(candidateWithoutPassword);
    }
    catch(err) {
        console.log(err);
        if (err.code === '23505') { // unique_violation error code
            res.status(400).json({ error: 'Email already exists' });
        } 
        else {
            res.status(500).json({ error: 'Error adding candidate' });
        }
    }
};

export const getCandidates = async (req, res) => {
    const { room_id } = req.params;
    try {
        const result = await pool.query(
            `SELECT candidate_id, candidate_name, email, room_id, votes_obtained FROM Candidates
            WHERE room_id = $1`,
            [room_id]
        )
        res.json(result.rows);
    }
    catch(err) {
        res.status(500).json({error : 'Error getting candidates'});
    }
};

export const registerCandidate = async (req, res) => {
    const { candidate_name, email, password, room_id } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            `INSERT INTO Candidates (candidate_name, email, pass, room_id) 
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [candidate_name, email, hashedPassword, room_id]
        );
        
        // Generate token
        const token = jwt.sign(
            { id: result.rows[0].candidate_id, email: result.rows[0].email, room_id: result.rows[0].room_id },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        // Remove the password from the response
        const { pass, ...candidateWithoutPassword } = result.rows[0];
        res.status(201).json({ ...candidateWithoutPassword, token });
    } 
    catch(err){
        console.error(err);
        if(err.code === '23505'){ // unique_violation error code
            res.status(400).json({ error: 'Email already exists' });
        } 
        else{
            res.status(500).json({ error: 'Error registering candidate' });
        }
    }
};

export const loginCandidate = async (req, res) => {
    const { email, password } = req.body;
    try{
        const result = await pool.query('SELECT * FROM Candidates WHERE email = $1', [email]);
        if(result.rows.length === 0){
            return res.status(401).json({error: 'Invalid credentials'});
        }
        const candidate = result.rows[0];
        const isValidPassword = await bcrypt.compare(password, candidate.pass);
        if(!isValidPassword){
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { id: candidate.candidate_id, email: candidate.email, room_id: candidate.room_id },
            SECRET_KEY,
            { expiresIn: '1h' }
        );
        res.json({ token });
    } 
    catch(error){
        console.error(error);
        res.status(500).json({error: 'Error logging in candidate'});
    }
};
