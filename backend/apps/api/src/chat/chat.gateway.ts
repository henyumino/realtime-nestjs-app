import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('chat gateway');

  private onlineUsers = [];

  @SubscribeMessage('send_chat')
  handleMessage(@MessageBody() data: any): Observable<WsResponse<string>> {
    console.log(data);
    this.server.emit('get_chat', data);
    return data;
  }

  @SubscribeMessage('newOnlineUser')
  addOnlineUser(@MessageBody() data: any, @ConnectedSocket() client: Socket): any {
    // NOTE add user ketika on masuk ke app
    !this.onlineUsers.some((user) => user.username === data.username) &&
      this.onlineUsers.push({ username: data, socket_id: client.id });
    // this.logger.debug(data, client);
  }

  @SubscribeMessage('getOnlineUser')
  getOnlineUser(){
    this.logger.debug("online user:",this.onlineUsers)
  }

  @SubscribeMessage('sendNotif')
  sendNotif(@MessageBody() data: any){
    const user = this.onlineUsers.find((user) => data === user.username);
    this.server.to(user.socket_id).emit('getNotif', `hey ${data}`)
    // TODO implementasi ke frontend untuk lonceng notif
  }
}
