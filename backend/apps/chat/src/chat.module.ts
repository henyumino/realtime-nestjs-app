import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { UsersModule } from 'apps/api/src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'apps/api/src/auth/constant/auth.constant';
import { PrismaModule } from 'apps/api/src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'apps/api/src/auth/strategy/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: jwtConstants.secret
    }),
    PrismaModule,
    PassportModule
  ],
  controllers: [ChatController],
  providers: [ChatService, JwtStrategy],
})
export class ChatModule {}

