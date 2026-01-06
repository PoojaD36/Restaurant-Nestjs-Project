import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class NotificationsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token;
      if (!token) return;

      const payload: any = jwt.verify(
        token,
        process.env.JWT_SECRET!,
      );

      const userId = payload.sub;

      client.join(`user:${userId}`);
      console.log(`🔔 User ${userId} connected to socket`);
    } catch (err) {
      console.log('❌ Socket auth failed');
      client.disconnect();
    }
  }

  notifyUser(userId: number, event: string, payload: any) {
    this.server.to(`user:${userId}`).emit(event, payload);
  }
}