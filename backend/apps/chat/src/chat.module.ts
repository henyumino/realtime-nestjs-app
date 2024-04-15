import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { AuthModule, PrismaModule } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ClientsModule.register([
      {
        name: 'API_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@rabbitmq:5672'],
          queue: 'api_queue',
          noAck: true,
          queueOptions: {
            arguments: {
              'x-queue-type': 'quorum',
            },
            durable: true
          },
        },
      },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
