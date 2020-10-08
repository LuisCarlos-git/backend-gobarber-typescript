import { Request, Response } from 'express';

import UserRepository from '@modules/users/infra/typeorm/repositories/UserRepository';
import AuthUserService from '@modules/users/services/AuthUserService';
import BCryptHashProvider from '@modules/users/providers/implementations/BCryptHashProvider';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const usersRpository = new UserRepository();
    const hashProvider = new BCryptHashProvider();

    const { email, password } = request.body;

    const authService = new AuthUserService(usersRpository, hashProvider);

    const { user, token } = await authService.execute({
      email,
      password,
    });

    delete user.password;
    return response.json({
      user,
      token,
    });
  }
}
