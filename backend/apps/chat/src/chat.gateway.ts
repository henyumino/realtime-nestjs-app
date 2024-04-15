import { PrismaService } from '@app/common';
import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { firstValueFrom, lastValueFrom, map, tap, timeout } from 'rxjs';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    // private prisma: PrismaService,
    @Inject('API_SERVICE') private apiClient: ClientProxy,
  ) {}

  private logger = new Logger('chat gateway');

  private onlineUsers = [];

  @SubscribeMessage('addOnlineUser')
  async addOnlineUser(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    // add user ketika on masuk ke app
    // const user = await this.prisma.user.findUnique({
    //   where: {
    //     id: data.id,
    //   },
    // });
    // const res = await this.getUserFromUserService(data.id)
    // console.log(res)
    const res = this.apiClient.send({cmd:'get-user'}, data.id).pipe(timeout(5000));
    const user = await lastValueFrom(res)
    console.log(res)

    if (user) {
      !this.onlineUsers.some((user) => user.id === data.id) &&
        this.onlineUsers.push({
          id: user.id,
          fullname: user.fullname,
          socket_id: client.id,
        });
    }

    this.server.emit('onlineUser', this.onlineUsers);
  }


  @SubscribeMessage('getOnlineUser')
  getOnlineUser() {
    // this.logger.debug('online user:', this.onlineUsers);
    console.log(this.onlineUsers);
    return this.onlineUsers;
  }

  @SubscribeMessage('onlineUser')
  displayOnlineUser() {
    return this.onlineUsers;
  }

  @SubscribeMessage('removeOnlineUser')
  removeUser(@MessageBody() data: any) {
    const curUser = this.onlineUsers.filter((user) => user.id !== data);
    this.onlineUsers = curUser;
    this.server.emit('onlineUser', this.onlineUsers);
  }
}
