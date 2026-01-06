import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from '../common/enums/user-role.enum';
import { Roles } from 'src/common/enums/decorators/roles.decorator';
import { RolesGuard } from 'src/common/enums/guards/roles.guard';

@Controller('test')
export class TestController {

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  adminOnly() {
    return { message: 'Admin access granted' };
  }

  @Get('any')
  @UseGuards(JwtAuthGuard)
  anyUser() {
    return { message: 'Any logged-in user can access' };
  }
}
