import 'reflect-metadata';

import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository';

import ResetPasswordService from './ResetPasswordService';

import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/fakes/FakeHashProvider';

describe('Forgot password', () => {
  it('should be able to reset password', async () => {
    const fakeUsersRepository = new FakeUserRepository();
    const fakeUserTokenRepository = new FakeUserTokenRepository();
    const fakeHashProvider = new FakeHashProvider();

    const resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokenRepository,
      fakeHashProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'luis',
      email: 'email@email.com',
      password: '123',
    });

    const userToken = await fakeUserTokenRepository.generate(user.id);

    const genarateHashMethod = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.excute({
      password: '1234',
      token: userToken.token,
    });

    const newUserPassword = await fakeUsersRepository.findById(user.id);

    expect(genarateHashMethod).toBeCalledWith('1234');
    expect(newUserPassword?.password).toBe('1234');
  });

  it('should be able not reset password if token not existing', async () => {
    const fakeUsersRepository = new FakeUserRepository();
    const fakeUserTokenRepository = new FakeUserTokenRepository();
    const fakeHashProvider = new FakeHashProvider();

    const resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokenRepository,
      fakeHashProvider,
    );

    await expect(
      resetPasswordService.excute({
        password: '12345',
        token: 'non-existing-token',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able not reset password if user not existing', async () => {
    const fakeUsersRepository = new FakeUserRepository();
    const fakeUserTokenRepository = new FakeUserTokenRepository();
    const fakeHashProvider = new FakeHashProvider();

    const resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokenRepository,
      fakeHashProvider,
    );

    const { token } = await fakeUserTokenRepository.generate('invalid-token');

    await expect(
      resetPasswordService.excute({
        password: '12345',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able not reset password if passed more than 2hours', async () => {
    const fakeUsersRepository = new FakeUserRepository();
    const fakeUserTokenRepository = new FakeUserTokenRepository();
    const fakeHashProvider = new FakeHashProvider();

    const resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokenRepository,
      fakeHashProvider,
    );

    const { token } = await fakeUserTokenRepository.generate('invalid-token');

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.excute({
        password: '12345',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
