import { Router } from 'express';
import SessionsController from '../../controllers/SessionsController';

const routerSessions = Router();

const sessionsController = new SessionsController();
routerSessions.post('/', sessionsController.create);

export default routerSessions;
