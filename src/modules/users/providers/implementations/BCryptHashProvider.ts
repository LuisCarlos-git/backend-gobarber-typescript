import { hash, compare } from 'bcryptjs';
import IHashProvider from '../models/IHashProvider';

class BCryptHashProvider implements IHashProvider {
  public async generateHash(password: string): Promise<string> {
    return hash(password, 8);
  }

  public async compareHash(password: string, hashed: string): Promise<boolean> {
    const test = await compare(password, hashed);

    console.log('esse e o resultado ', test);

    return test;
  }
}

export default BCryptHashProvider;
