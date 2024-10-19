import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../pool.js';

const SECRET_KEY = process.env.JWT_SECRET;

export const generateToken = (user) => {
    return jwt.sign({id : user.voter_id, email : user.email }, SECRET_KEY, { expiresIn : '1h' });
};

export const registerUser = async (req, res) => {
    const { voter_name, email, password, room_id } = req.body;
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
        'INSERT INTO Voters (voter_name, email, pass, room_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [voter_name, email, hashedPassword, room_id]
        );
        const token = generateToken(result.rows[0]);
        res.status(201).json({ token });
    } 
    catch(err){
        res.status(500).json({error : 'Error registering user'});
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try{
        const result = await pool.query('SELECT * FROM Voters WHERE email = $1', [email]);
        if(result.rows.length === 0){
            return res.status(401).json({error: 'Invalid credentials'});
        }
        const user = result.rows[0];
        const isValidPassword = await bcrypt.compare(password, user.pass);
        if(!isValidPassword){
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = generateToken(user);
        res.json({token});
    } 
    catch(error){
        res.status(500).json({error: 'Error logging in'});
    }
};

