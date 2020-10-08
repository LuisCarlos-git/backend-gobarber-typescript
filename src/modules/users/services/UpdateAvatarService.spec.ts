import 'reflect-metadata';

import UpdateAvatarService from '@modules/users/services/UpdateAvatarService';

import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeStorageProvider from '@shared/container/Providers/StorageProvider/fakes/FakeStorageProvider';

import AppError from '@shared/errors/AppError';

describe('Update avatar user', () => {
  it('should be able the update of user avatar', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const user = await fakeUserRepository.create({
      email: 'luiscarlos@gmail.com',
      name: 'luis carlos',
      password: '123456',
    });

    const updateAvatar = new UpdateAvatarService(
      fakeUserRepository,
      fakeStorageProvider,
    );

    await updateAvatar.execute({
      id: user.id,
      avatar: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should be able the verify if user exists', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateAvatar = new UpdateAvatarService(
      fakeUserRepository,
      fakeStorageProvider,
    );

    await expect(
      updateAvatar.execute({
        id: 'user-not-exists',
        avatar: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able the verify if old avatar was deleted', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteAvatar = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUserRepository.create({
      email: 'luiscarlos@gmail.com',
      name: 'luis carlos',
      password: '123456',
    });

    const updateAvatar = new UpdateAvatarService(
      fakeUserRepository,
      fakeStorageProvider,
    );

    await updateAvatar.execute({
      id: user.id,
      avatar: 'avatar.jpg',
    });

    await updateAvatar.execute({
      id: user.id,
      avatar: 'avatar2.jpg',
    });

    expect(deleteAvatar).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });
});
