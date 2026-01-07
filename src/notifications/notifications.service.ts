import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { User } from '../users/user.entity';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationsService {
  constructor(private readonly em: EntityManager) {}

  // Create notification
  async createNotification(userId: number, type: string, data: any) {
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

  // Mark notification as read
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

  // Mark ALL notifications as read
  async markAllAsRead(userId: number) {
    await this.em.nativeUpdate(
      Notification,
      { user: userId, isRead: false },
      { isRead: true },
    );
  }

  async getMyNotifications(userId: number, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const [items, total] = await this.em.findAndCount(
      Notification,
      { user: userId },
      {
        orderBy: { createdAt: 'DESC' },
        limit,
        offset,
      },
    );

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: items,
    };
  }

  // Unread count
  async getUnreadCount(userId: number) {
    return this.em.count(Notification, {
      user: userId,
      isRead: false,
    });
  }
}
