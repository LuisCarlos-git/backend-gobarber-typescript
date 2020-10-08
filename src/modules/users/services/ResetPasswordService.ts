import { inject, injectable } from 'tsyringe';

import IUserRepository from '@modules/users/repositories/IUserRepository';
import IUserToken from '../repositories/IUserTokenRepository';
import IHashProvider from '../providers/models/IHashProvider';

import AppError from '@shared/errors/AppError';
import { addHours, isAfter } from 'date-fns';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
export default class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject('UserTokenRepository')
    private userToken: IUserToken,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async excute({ password, token }: IRequest): Promise<void> {
    const userToken = await this.userToken.findByToken(token);

    if (!userToken) {
      throw new AppError('User token does not exists', 404);
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User not exists', 404);
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Invalid token', 401);
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}
