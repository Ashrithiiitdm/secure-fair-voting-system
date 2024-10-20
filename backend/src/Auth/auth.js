import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../pool.js';

const SECRET_KEY = process.env.JWT_SECRET;

export const generateToken = (user) => {
    return jwt.sign({id: user.voter_id, email: user.email, room_id: user.room_id}, SECRET_KEY, { expiresIn: '1h' });
};

export const registerUser = async (req, res) => {
    const { voter_name, email, password, room_id } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(`
            INSERT INTO Voters (voter_name, email, pass, room_id) 
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [voter_name, email, hashedPassword, room_id]
        );
        const token = jwt.sign(
            {id: result.rows[0].voter_id, email: result.rows[0].email, room_id: result.rows[0].room_id},
            SECRET_KEY,
            { expiresIn: '1h' }
        );
        const { pass, ...userWithoutPassword } = result.rows[0];
        res.status(201).json({ ...userWithoutPassword, token });
    } 
    catch(err) {
        console.error(err);
        if (err.code === '23505') { // unique_violation error code
            res.status(400).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({error : 'Error registering user'});
        }
    }
};


