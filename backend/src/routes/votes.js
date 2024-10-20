import { Router } from "express";
import { putVote } from '../controllers/votes.js';


const votesRouter = Router();
votesRouter.post('/', putVote);

export default votesRouter;
