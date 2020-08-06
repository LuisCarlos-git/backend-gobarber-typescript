import { Router } from 'express';

import AuthUserService from '../services/AuthUserService';

const routerSessions = Router();

routerSessions.post('/', async (request, response) => {
  try {
    const { email, password } = request.body;

    const authService = new AuthUserService();

    const { user, token } = await authService.execute({
      email,
      password,
    });

    delete user.password;

    return response.json({ user, token });
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default routerSessions;
