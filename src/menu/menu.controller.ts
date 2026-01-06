import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ParseIntPipe,
  Req,
} from '@nestjs/common';

import { MenuService } from './menu.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from '../common/enums/user-role.enum';
import { RolesGuard } from 'src/common/enums/guards/roles.guard';
import { Roles } from 'src/common/enums/decorators/roles.decorator';

@Controller('menu')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.RESTAURANT)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post(':restaurantId')
  create(
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
    @Req() req: any,
    @Body() dto: CreateMenuItemDto,
  ) {
    return this.menuService.create(
      restaurantId,
      req.user.userId,
      dto,
    );
  }

  @Get('restaurant/:restaurantId')
  findByRestaurant(
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
  ) {
    return this.menuService.findByRestaurant(restaurantId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
    @Body() dto: UpdateMenuItemDto,
  ) {
    return this.menuService.update(id, req.user.userId, dto);
  }
}