import { uuid } from 'uuidv4';
import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository';

class FakeUserTokenRepository implements IUserTokenRepository {
  private userToken: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.userToken.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const user = this.userToken.find(user => user.token === token);

    return user;
  }
}

export default FakeUserTokenRepository;
