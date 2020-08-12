import { Router } from 'express';

import UserRepository from '@modules/users/infra/typeorm/repositories/UserRepository';
import AuthUserService from '@modules/users/services/AuthUserService';

const routerSessions = Router();

routerSessions.post('/', async (request, response) => {
  const usersRpository = new UserRepository();

  const { email, password } = request.body;

  const authService = new AuthUserService(usersRpository);

  const { user, token } = await authService.execute({
    email,
    password,
  });

  delete user.password;
  return response.json({
    user,
    token,
  });
});

export default routerSessions;
