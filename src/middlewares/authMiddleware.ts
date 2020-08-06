import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import configjwt from '../utils/jwt';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new Error('Token JWT not found');
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, configjwt.secret);

    const { sub } = decoded as TokenPayload;

    request.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new Error('Invalid token Jwt');
  }
}
