import 'reflect-metadata';

import CreateUserService from '@modules/users/services/CreateUserService';

import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/fakes/FakeHashProvider';

import AppError from '@shared/errors/AppError';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const hasProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(
      fakeUserRepository,
      hasProvider,
    );

    const user = await createUserService.execute({
      email: 'luiscarlos@gmail.com',
      name: 'luis carlos',
      password: '12345',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create two users with same email', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const hasProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(
      fakeUserRepository,
      hasProvider,
    );

    await createUserService.execute({
      email: 'luiscarlos@gmail.com',
      name: 'luis carlos',
      password: '12345',
    });

    expect(
      createUserService.execute({
        email: 'luiscarlos@gmail.com',
        name: 'luis carlos',
        password: '12345',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
