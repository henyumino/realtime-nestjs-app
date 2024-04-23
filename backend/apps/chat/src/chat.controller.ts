import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  ClientProxy,
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { JwtAuthGuard } from '@app/common/auth/guard/jwt-auth.guard';
import { GetUser } from 'apps/api/src/users/decorator/get-user.decorator';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Controller()
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    @Inject('API_SERVICE') private readonly apiClient: ClientProxy,
  ) {}

  private logger = new Logger('chat controller');

  @Get()
  async getHello() {
    this.apiClient.emit({ cmd: 'get-user' }, 'asd');
    return 'success';
  }

  @MessagePattern({ cmd: 'sendchat' })
  async test(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
    return data;
  }

  @Get('chat/:roomId')
  async getPrivateChat(@Param('roomId') roomId: string) {
    const res = await this.chatService.getPrivateChat(roomId.toString());
    return res;
  }
}
