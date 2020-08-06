import { getRepository } from 'typeorm';
import { join } from 'path';
import fs from 'fs';

import User from '../models/User';

import uploadConfig from '../config/upload';
import AppErrors from '../errors/AppError';

interface Request {
  id: string;
  avatar: string;
}

export default class UpdateAvatarService {
  public async execute({ id, avatar }: Request): Promise<User> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { id } });

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

    await userRepository.save(user);

    return user;
  }
}
