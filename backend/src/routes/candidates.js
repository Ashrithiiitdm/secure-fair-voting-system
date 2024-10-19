import { Router } from 'express';
import { addCandidates, getCandidates } from '../controllers/candidates.js';

const candidateRouter = Router();

candidateRouter.post('/', addCandidates);
candidateRouter.get('/room/:room_id', getCandidates);

export default candidateRouter;
