import { Inject, Injectable } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class ChatService {
  // constructor(@Inject('API_SERVICE') private readonly apiClient: ClientProxy) {}
  getHello(): string {
    return 'Hello World!';
  }
}
