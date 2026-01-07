import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { User } from '../users/user.entity';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationsService {
  constructor(private readonly em: EntityManager) {}

  // Create notification
  async createNotification(
    userId: number,
    type: string,
    data: any,
  ) {
    const user = await this.em.findOne(User, userId);
    if (!user) return;

    const notification = this.em.create(Notification, {
      user,
      type,
      data,
      isRead: false,
    });

    await this.em.persistAndFlush(notification);
    return notification;
  }

  // 📥 Get logged-in user's notifications
  async getMyNotifications(userId: number) {
    return this.em.find(
      Notification,
      { user: userId },
      { orderBy: { createdAt: 'DESC' } },
    );
  }

  // ✅ Mark notification as read
  async markAsRead(notificationId: number, userId: number) {
    const notification = await this.em.findOne(Notification, {
      id: notificationId,
      user: userId,
    });

    if (!notification) {
      return null;
    }

    notification.isRead = true;
    await this.em.flush();
    return notification;
  }
}