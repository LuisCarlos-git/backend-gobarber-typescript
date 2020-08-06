import { Router } from 'express';

import AuthUserService from '../services/AuthUserService';

const routerSessions = Router();

routerSessions.post('/', async (request, response) => {
  const { email, password } = request.body;

  const authService = new AuthUserService();

  const { user, token } = await authService.execute({
    email,
    password,
  });

  delete user.password;
});

export default routerSessions;
