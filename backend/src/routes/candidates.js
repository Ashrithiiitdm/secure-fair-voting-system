import { Router } from 'express';
import { addCandidates, getCandidates } from '../controllers/candidates.js';
import { authenticateToken } from '../Auth/middleware.js';

const candidateRouter = Router();

candidateRouter.post('/', authenticateToken, addCandidates);
candidateRouter.get('/room/:room_id', authenticateToken, getCandidates);

export default candidateRouter;
