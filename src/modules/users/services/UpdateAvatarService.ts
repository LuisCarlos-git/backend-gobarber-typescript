import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';

import AppErrors from '@shared/errors/AppError';

import IUserRepository from '../repositories/IUserRepository';
import IStorageProvider from '@shared/container/Providers/StorageProvider/models/IStorageProvider';

interface IRequest {
  id: string;
  avatar: string;
}
@injectable()
export default class UpdateAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject('DiskStorage')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ id, avatar }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppErrors('User not found', 401);
    }

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    const filename = await this.storageProvider.saveFile(avatar);

    user.avatar = filename;

    await this.usersRepository.save(user);

    return user;
  }
}
