import { Router } from 'express';
import { createVotingRoom, getVotingRoom } from '../controllers/votingRooms.js'
const votingRoomsRouter = Router();

votingRoomsRouter.post('/', createVotingRoom);
votingRoomsRouter.get('/:room_id/results', getVotingRoom);

export default votingRoomsRouter;
