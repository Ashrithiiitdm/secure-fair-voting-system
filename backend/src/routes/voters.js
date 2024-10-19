import { Router } from "express";
import { addVoter, getVotersByRoom } from '../controllers/voters.js'
const votersRouter = Router();

votersRouter.post('/', addVoter);
export default votersRouter;