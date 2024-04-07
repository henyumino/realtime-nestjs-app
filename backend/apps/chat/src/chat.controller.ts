import { Controller, Get, Logger } from '@nestjs/common';
import { ChatService } from './chat.service';
import * as bcrypt from 'bcrypt';

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
}
