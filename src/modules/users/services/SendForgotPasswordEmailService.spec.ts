import 'reflect-metadata';

import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeMailProvider from '@shared/container/Providers/MailProvider/fakes/FakeMailProvider';

import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

import AppError from '@shared/errors/AppError';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository';

describe('Forgot password', () => {
  it('should be able the user change password using the email', async () => {
    const fakeUsersRepository = new FakeUserRepository();
    const fakeMailProvider = new FakeMailProvider();
    const fakeUserTokenRepository = new FakeUserTokenRepository();

    const sendMailMethod = jest.spyOn(fakeMailProvider, 'sendMail');

    const sendForgot = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokenRepository,
    );

    await fakeUsersRepository.create({
      name: 'luis',
      email: 'email@email.com',
      password: '123',
    });

    await sendForgot.excute({
      email: 'email@email.com',
    });

    expect(sendMailMethod).toHaveBeenCalled();
  });

  it('should not be able to recover a non-existing user password', async () => {
    const fakeUsersRepository = new FakeUserRepository();
    const fakeMailProvider = new FakeMailProvider();
    const fakeUserTokenRepository = new FakeUserTokenRepository();

    const sendForgotEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokenRepository,
    );

    await expect(
      sendForgotEmail.excute({
        email: 'email@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able generate token', async () => {
    const fakeUserTokenRepository = new FakeUserTokenRepository();
    const fakeUsersRepository = new FakeUserRepository();
    const fakeMailProvider = new FakeMailProvider();

    const generateMethod = jest.spyOn(fakeUserTokenRepository, 'generate');

    const sendForgotEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokenRepository,
    );

    const user = await fakeUsersRepository.create({
      name: 'luis',
      email: 'email@email.com',
      password: '123',
    });

    await sendForgotEmail.excute({
      email: 'email@email.com',
    });

    expect(generateMethod).toHaveBeenCalledWith(user.id);
  });
});
