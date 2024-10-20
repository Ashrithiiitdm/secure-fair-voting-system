import { Router } from 'express';
import { createVotingRoom, getVotingRoom, getAllVotingRooms, getResults, announceResults } from '../controllers/votingRooms.js'

const votingRoomsRouter = Router();

votingRoomsRouter.post('/', createVotingRoom);
votingRoomsRouter.get('/', getAllVotingRooms);
votingRoomsRouter.get('/:room_id', getVotingRoom);
votingRoomsRouter.get('/:room_id/results', getResults);
votingRoomsRouter.post('/:room_id/announce', announceResults);

export default votingRoomsRouter;
