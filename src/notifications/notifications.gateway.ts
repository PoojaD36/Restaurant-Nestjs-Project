import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { NotificationsService } from './notifications.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly notificationsService: NotificationsService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token;
      if (!token) return client.disconnect();

      const payload: any = jwt.verify(token, process.env.JWT_SECRET!);

      const userId = payload.sub;
      client.join(`user:${userId}`);

      // Auto mark unread notifications as read
      await this.notificationsService.markAllAsRead(userId);

      console.log(`🔔 User ${userId} connected to socket`);
    } catch {
      client.disconnect();
    }
  }

  async notifyUser(userId: number, event: string, payload: any) {
    // 1️⃣ Save in DB
    await this.notificationsService.createNotification(userId, event, payload);

    // 2️⃣ Emit via socket
    this.server.to(`user:${userId}`).emit(event, payload);
  }
}
