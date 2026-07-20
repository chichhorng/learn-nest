import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { sanitizeUser } from '../common/types/user.types';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: User) {
    const dbUser = await this.usersService.findById(user.id);
    if (!dbUser) {
      throw new NotFoundException('User not found');
    }
    return sanitizeUser(dbUser);
  }

  @Put('profile')
  async updateProfile(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updated = await this.usersService.update(user.id, updateUserDto);
    return sanitizeUser(updated);
  }

  @Get('pending-instructors')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async getPendingInstructors() {
    const pending = await this.usersService.findPendingInstructors();
    return pending.map(sanitizeUser);
  }

  @Put(':id/approve')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async approveInstructor(@Param('id', ParseIntPipe) id: number) {
    const approved = await this.usersService.approveInstructor(id);
    return sanitizeUser(approved);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async getAllUsers() {
    const users = await this.usersService.findAll();
    return users.map(sanitizeUser);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.usersService.remove(id);
    return sanitizeUser(deleted);
  }

  @Put('profile/password')
  async changePassword(
    @CurrentUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.usersService.updatePassword(
      user.id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
    return { message: 'Password updated successfully' };
  }
}
