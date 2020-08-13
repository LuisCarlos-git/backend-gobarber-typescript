import { Router } from 'express';
import multer from 'multer';

import authMiddleware from '@modules/users/infra/http/middlewares/authMiddleware';

import uploadConfig from '@config/upload';

import UsersController from '../../controllers/UsersController';
import UserAvatarController from '../../controllers/UserAvatarController';

const routerUsers = Router();
const upload = multer(uploadConfig);

const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

routerUsers.post('/', usersController.create);
routerUsers.patch(
  '/avatar',
  authMiddleware,
  upload.single('avatar'),
  userAvatarController.update,
);

export default routerUsers;
