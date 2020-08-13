import { container } from 'tsyringe';
import { Request, Response } from 'express';

import UpdateAvatarService from '@modules/users/services/UpdateAvatarService';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const avatarService = container.resolve(UpdateAvatarService);

    const user = await avatarService.execute({
      id: request.user.id,
      avatar: request.file.filename,
    });

    delete user.password;
    return response.json(user);
  }
}
