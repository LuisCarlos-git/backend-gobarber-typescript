import { Router } from 'express';
import multer from 'multer';

import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateAvatarService from '@modules/users/services/UpdateAvatarService';
import authMiddleware from '@modules/users/infra/http/middlewares/authMiddleware';

import uploadConfig from '@config/upload';

const routerUsers = Router();
const upload = multer(uploadConfig);

routerUsers.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const createUser = new CreateUserService();

  const user = await createUser.execute({
    name,
    email,
    password,
  });

  delete user.password;

  return response.json(user);
});

routerUsers.patch(
  '/avatar',
  authMiddleware,
  upload.single('avatar'),
  async (request, response) => {
    const avatarService = new UpdateAvatarService();

    const user = await avatarService.execute({
      id: request.user.id,
      avatar: request.file.filename,
    });

    delete user.password;
    return response.json(user);
  },
);

export default routerUsers;
