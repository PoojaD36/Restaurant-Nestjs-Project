import { Controller, Get, Patch, Param, Req, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // GET /notifications
  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyNotifications(
    @Req() req,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.notificationsService.getMyNotifications(
      req.user.userId,
      Number(page),
      Number(limit),
    );
  }

  // PATCH /notifications/:id/read
  @Patch(':id/read')
  async markAsRead(@Param('id') id: number, @Req() req: any) {
    return this.notificationsService.markAsRead(Number(id), req.user.userId);
  }

  // PATCH /notifications/read-all
  @Patch('read-all')
  async markAllAsRead(@Req() req: any) {
    return this.notificationsService.markAllAsRead(req.user.userId);
  }

  // GET /notifications/unread-count
  @Get('unread-count')
  async getUnreadCount(@Req() req: any) {
    return this.notificationsService.getUnreadCount(req.user.userId);
  }
}