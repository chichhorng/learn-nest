import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private users: any[] = [];

  async create(data: any) {
    const newUser = { id: this.users.length + 1, ...data, createdAt: new Date() };
    this.users.push(newUser);
    return newUser;
  }

  async findByEmail(email: string) {
    return this.users.find(u => u.email === email);
  }

  async findById(id: number) {
    return this.users.find(u => u.id === id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex > -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...updateUserDto };
      return this.users[userIndex];
    }
    return null;
  }
}
