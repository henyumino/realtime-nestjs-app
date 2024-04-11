import { PrismaService } from '@app/common';
import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private prisma: PrismaService) {}

  private logger = new Logger('chat gateway');

  private onlineUsers = [];

  @SubscribeMessage('addOnlineUser')
  async addOnlineUser(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<any> {
    // add user ketika on masuk ke app
    const user = await this.prisma.user.findUnique({
      where: {
        id: data.id,
      },
    });
    // this.logger.debug("user:", user)

    if (user) {
      !this.onlineUsers.some((user) => user.id === data.id) &&
        this.onlineUsers.push({
          id: user.id,
          fullname: user.fullname,
          socket_id: client.id,
        });
    }

    this.server.emit('onlineUser', this.onlineUsers)
  }

  @SubscribeMessage('getOnlineUser')
  getOnlineUser() {
    // this.logger.debug('online user:', this.onlineUsers);
    console.log(this.onlineUsers)
    return this.onlineUsers
  }

  @SubscribeMessage('onlineUser')
  displayOnlineUser() {
    return this.onlineUsers
  }
  
  @SubscribeMessage('removeOnlineUser')
  removeUser(@MessageBody() data: any) {
    const curUser = this.onlineUsers.filter(
      (user) => user.id !== data,
    );
    this.onlineUsers = curUser
    console.log("cur user:",curUser)
    this.server.emit('onlineUser', this.onlineUsers)
  }
}
