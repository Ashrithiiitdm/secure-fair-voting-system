import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import candidateRouter from './src/routes/candidates.js';
import votersRouter from './src/routes/voters.js';
import votesRouter from './src/routes/votes.js';
import votingRoomsRouter from './src/routes/votingRooms.js';
import { registerCandidate } from './src/controllers/candidates.js';
import { registerUser } from './src/Auth/auth.js';
import cron from 'node-cron';
import { closeExpiredRooms } from './src/controllers/votingRooms.js';
dotenv.config();

const app = express();

// Corrected the middleware function call
app.use(express.json()); 

app.use(cors());

// Registration routes
app.post('/register/candidate', registerCandidate);
app.post('/register/voter', registerUser);

// Other routes
app.use('/candidates', candidateRouter);
app.use('/voters', votersRouter);
app.use('/votes', votesRouter);
app.use('/voting-rooms', votingRoomsRouter);

// Run the job every minute
cron.schedule('* * * * *', closeExpiredRooms);

const port = process.env.PORT || 5500;
app.listen(port, () => {
    console.log(`Server is listening at port ${port}`);
});
