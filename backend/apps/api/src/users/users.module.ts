import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    PrismaModule,
    // ClientsModule.register([
    //   {
    //     name: 'API_SERVICE',
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: ['amqp://guest:guest@rabbitmq:5672'],
    //       queue: 'api_queue',
    //       queueOptions: {
    //         arguments: {
    //           'x-queue-type': 'quorum',
    //         },
    //         durable: true
    //       },
    //     },
    //   },
    // ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
