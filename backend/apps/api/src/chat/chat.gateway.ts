import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('send_chat')
  handleMessage(@MessageBody() data: any): Observable<WsResponse<string>> {
    console.log(data)
    this.server.emit('get_chat', data)
    return data;
  }
}
