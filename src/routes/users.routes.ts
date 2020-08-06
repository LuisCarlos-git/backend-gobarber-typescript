import { Router } from 'express';
import multer from 'multer';

import CreateUserService from '../services/CreateUserService';
import UpdateAvatarService from '../services/UpdateAvatarService';

import authMiddleware from '../middlewares/authMiddleware';
import uploadConfig from '../config/upload';

const routerUsers = Router();
const upload = multer(uploadConfig);

routerUsers.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    delete user.password;

    return response.json(user);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
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
