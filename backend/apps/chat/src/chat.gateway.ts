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
    @Inject('API_SERVICE') private apiClient: ClientProxy,
    private prisma: PrismaService,
  ) {}

  private logger = new Logger('chat gateway');

  private onlineUsers = [];

  private activeRoom = [];

  @SubscribeMessage('addOnlineUser')
  async addOnlineUser(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    // add user ketika on masuk ke app
    // TODO isi validasi jika data kosong
    const res = this.apiClient
      .send({ cmd: 'get-user' }, data.id)
      .pipe(timeout(5000));
    const user = await lastValueFrom(res);

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

  // join room for private chat
  @SubscribeMessage('joinRoom')
  async createRoom(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    // NOTE: 1 private | 2 group
    // check room jika tidak ada create room baru
    const room = await this.prisma.$queryRaw`
    SELECT roomId
    FROM Room
    WHERE userId IN (${data.userId},${data.anotherUserId})
    GROUP BY roomId
    HAVING COUNT(DISTINCT userId) = 2;
    `;

    const roomId = room[0].roomId;
    console.log('roomid:', roomId);
    socket.emit('getRoom', roomId);
    socket.join(roomId); // data -> room
    console.log(`socket ${socket.id} room ${roomId} joined`);
  }

  //send private msg
  @SubscribeMessage('sendChat')
  sendPrivateMsg(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
    // emit private chat dari sini
    console.log('sendchat:', data);
    this.server.to('123').emit('getChat', data);
    // TODO fitur save chat ke db
  }
}
