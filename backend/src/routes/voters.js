import { Router } from "express";
import { addVoter, getVotersByRoom } from '../controllers/voters.js';
import { registerUser, loginUser } from '../Auth/auth.js';
import { authenticateToken } from '../Auth/middleware.js';

const votersRouter = Router();

votersRouter.post('/register', registerUser);
votersRouter.post('/login', loginUser);
votersRouter.post('/', authenticateToken, addVoter);
votersRouter.get('/room/:room_id', authenticateToken, getVotersByRoom);

export default votersRouter;
