import express from 'express';
import cors from 'cors';
import candidateRouter from './src/routes/candidates.js';
import votersRouter from './src/routes/voters.js';
import votesRouter from './src/routes/votes.js';
import votingRoomsRouter from './src/routes/votingRooms.js';

const app = express();

// Corrected the middleware function call
app.use(express.json()); 

app.use(cors());
app.use('/candidates', candidateRouter);
app.use('/voters', votersRouter);
app.use('/votes', votesRouter);
app.use('/voting-rooms', votingRoomsRouter);

const port = process.env.PORT || 5500;
app.listen(port, () => {
    console.log(`Server is listening at port ${port}`);
});
