import { Router } from "express";
import { putVote } from '../controllers/votes.js';
import { authenticateToken } from '../Auth/middleware.js';

const votesRouter = Router();
votesRouter.post('/', authenticateToken, putVote);

export default votesRouter;
