import { PrismaService } from '@app/common';
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
  constructor(private prisma: PrismaService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getPrivateChat(roomId: string) {
    const res = await this.prisma.chat.findMany({
      where: {
        roomId: roomId,
      },
      include: {
        user: true,
      },
    });

    return res;
  }
}
