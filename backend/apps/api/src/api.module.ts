import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ChatModule, AuthModule, UsersModule, PrismaModule],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
