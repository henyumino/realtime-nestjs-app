import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '@prisma/client';

function exclude(user: User, keys: string[]) {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => !keys.includes(key)),
  );
}

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const cleanedUser = exclude(req.user, ['password', 'salt']);
    return cleanedUser;
  },
);


