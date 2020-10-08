import IMailProvider from '../models/IMailProvider';

interface Messages {
  to: string;
  body: string;
}

export default class FakeMailProvider implements IMailProvider {
  private messages: Messages[] = [];

  public async sendMail(to: string, body: string): Promise<void> {
    this.messages.push({
      to,
      body,
    });
  }
}
