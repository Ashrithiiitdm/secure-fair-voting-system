import { Router } from 'express';
import { createVotingRoom, getVotingRoom, getAllVotingRooms, getResults } from '../controllers/votingRooms.js'
import { authenticateToken } from '../Auth/middleware.js';

const votingRoomsRouter = Router();

votingRoomsRouter.post('/', authenticateToken, createVotingRoom);
votingRoomsRouter.get('/', authenticateToken, getAllVotingRooms);
votingRoomsRouter.get('/:room_id', authenticateToken, getVotingRoom);
votingRoomsRouter.get('/:room_id/results', authenticateToken, getResults);
votingRoomsRouter.post('/:room_id/announce', authenticateToken, announceResults);

export default votingRoomsRouter;
