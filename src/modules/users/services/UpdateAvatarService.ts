import { inject, injectable } from 'tsyringe';
import { join } from 'path';
import fs from 'fs';

import User from '@modules/users/infra/typeorm/entities/User';

import uploadConfig from '@config/upload';
import AppErrors from '@shared/errors/AppError';

import IUserRepository from '../repositories/IUserRepository';

interface IRequest {
  id: string;
  avatar: string;
}
@injectable()
export default class UpdateAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,
  ) {}

  public async execute({ id, avatar }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppErrors('User not found', 401);
    }

    if (user.avatar) {
      const userAvatarFilePath = join(uploadConfig.directory, user.avatar);
      const userAvatarExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatar;

    await this.usersRepository.save(user);

    return user;
  }
}
