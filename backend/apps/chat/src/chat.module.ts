import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { AuthModule, PrismaModule } from '@app/common';
import { ChatGateway } from './chat/chat.gateway';


@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
