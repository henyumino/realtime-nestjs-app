import { Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiService } from './api.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class ApiController {
  constructor(
    private readonly apiService: ApiService,
    @Inject('CHAT_SERVICE') private readonly chatClient: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.apiService.getHello();
  }

  @Post('test')
  async testMicro() {
    // console.log('test')
    this.chatClient.emit({cmd: 'send-chat'}, 'test chat')
  }
}
