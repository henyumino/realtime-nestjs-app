import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { AuthModule } from '@app/common';


@Module({
  imports: [AuthModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
