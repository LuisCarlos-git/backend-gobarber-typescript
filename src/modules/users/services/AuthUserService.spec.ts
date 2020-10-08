import 'reflect-metadata';

import CreateUserService from '@modules/users/services/CreateUserService';
import AuthUserService from '@modules/users/services/AuthUserService';

import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/fakes/FakeHashProvider';

import AppError from '@shared/errors/AppError';

describe('CreateAuth', () => {
  it('should be able to authenticate', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const hashProvider = new FakeHashProvider();

    const auth = new AuthUserService(fakeUserRepository, hashProvider);
    const createUser = new CreateUserService(fakeUserRepository, hashProvider);

    const user = await createUser.execute({
      name: 'luis carlos',
      email: 'luiscarlos@gmail.com',
      password: '12345',
    });

    const responseAuth = await auth.execute({
      email: 'luiscarlos@gmail.com',
      password: '12345',
    });

    expect(responseAuth).toHaveProperty('token');
    expect(responseAuth.user).toEqual(user);
  });

  it('should be able to authenticate with non existing user', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const hashProvider = new FakeHashProvider();

    const auth = new AuthUserService(fakeUserRepository, hashProvider);
    const createUser = new CreateUserService(fakeUserRepository, hashProvider);

    await expect(
      auth.execute({
        email: 'luiscarlos@gmail.com',
        password: '12345',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const hashProvider = new FakeHashProvider();

    const auth = new AuthUserService(fakeUserRepository, hashProvider);
    const createUser = new CreateUserService(fakeUserRepository, hashProvider);

    await createUser.execute({
      name: 'luis carlos',
      email: 'luiscarlos@gmail.com',
      password: '12345',
    });

    await expect(
      auth.execute({
        email: 'luiscarlos@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
