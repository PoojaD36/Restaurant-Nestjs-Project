import {
  Controller,
  Get,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  // GET /notifications
  @Get()
  async getMyNotifications(@Req() req: any) {
    return this.notificationsService.getMyNotifications(req.user.userId);
  }

  // PATCH /notifications/:id/read
  @Patch(':id/read')
  async markAsRead(
    @Param('id') id: number,
    @Req() req: any,
  ) {
    return this.notificationsService.markAsRead(
      Number(id),
      req.user.userId,
    );
  }
}