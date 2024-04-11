import { Controller, Get, Logger, Request, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import * as bcrypt from 'bcrypt';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { JwtAuthGuard } from '@app/common/auth/guard/jwt-auth.guard';
import { GetUser } from 'apps/api/src/users/decorator/get-user.decorator';

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  private logger = new Logger('chat controller')

  @Get()
  async getHello() {
    const test = await bcrypt.genSalt()
    this.logger.debug(test)
    return 'success'
  }

  @MessagePattern({cmd: 'send-chat'})
  async testMicro(@Payload() data: any, @Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.logger.debug(data);
    channel.ack(originalMsg);
  }

  // TODO buat chat gateway dan connect user berdasarkan user session jwt


}
