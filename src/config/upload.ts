import { diskStorage } from 'multer';
import { resolve } from 'path';
import { randomBytes } from 'crypto';

export default {
  directory: resolve(__dirname, '..', '..', 'tmp'),

  storage: diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp'),
    filename(request, file, callback) {
      const hash = randomBytes(10).toString('hex');
      const fileName = `${hash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
