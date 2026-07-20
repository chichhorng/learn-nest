import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { sanitizeUser } from '../common/types/user.types';
import type { SafeUser } from '../common/types/user.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    @Body() registerDto: RegisterDto,
  ): Promise<{ user: SafeUser; token: string }> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(
    @Body() loginDto: LoginDto,
  ): Promise<{ user: SafeUser; token: string }> {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: User): SafeUser {
    return sanitizeUser(user);
  }
}
