import { NestFactory } from '@nestjs/core';
import { ChatModule } from './chat.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(ChatModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@rabbitmq:5672'],
      queue: 'chat_queue',
      queueOptions: {
        durable: true,
        arguments: {
          'x-queue-type': 'quorum',
        },
      },
      noAck: false,
    },
  });
  await app.startAllMicroservices()
  await app.listen(5001);
}
bootstrap();
