import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    return { user, token: 'mock-jwt-token' };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    return { user, token: 'mock-jwt-token' };
  }
}
