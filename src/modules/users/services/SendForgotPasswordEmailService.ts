import { inject, injectable } from 'tsyringe';

import IUserRepository from '@modules/users/repositories/IUserRepository';
import IMailProvider from '@shared/container/Providers/MailProvider/models/IMailProvider';

import AppError from '@shared/errors/AppError';
import IUserToken from '../repositories/IUserTokenRepository';

interface IRequest {
  email: string;
}

@injectable()
export default class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UserTokenRepository')
    private userToken: IUserToken,
  ) {}

  public async excute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User does not exists', 404);
    }

    await this.userToken.generate(user.id);

    this.mailProvider.sendMail(
      email,
      'Solicitação de recuperação de senha enviado',
    );
  }
}
