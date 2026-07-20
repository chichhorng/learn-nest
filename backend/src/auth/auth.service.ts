import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { SafeUser, sanitizeUser } from '../common/types/user.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ user: SafeUser; token: string }> {
    const existing = await this.usersService.findByEmail(registerDto.email);
    if (existing) {
      throw new BadRequestException('Email already registered');
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });
    if (!user.isApproved) {
      throw new ForbiddenException(
        'Registration successful. Your instructor account is pending admin approval.',
      );
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      user: sanitizeUser(user),
      token: this.jwtService.sign(payload),
    };
  }

  async login(loginDto: LoginDto): Promise<{ user: SafeUser; token: string }> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.isApproved) {
      throw new ForbiddenException(
        'Your instructor account is pending admin approval.',
      );
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      user: sanitizeUser(user),
      token: this.jwtService.sign(payload),
    };
  }
}
