import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../database/models/user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async findById(id: number) {
    const user = await this.userModel.findByPk(id, {
      attributes: { exclude: ['passwordHash'] },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, data: Partial<User>) {
    const user = await this.findById(id);
    return user.update(data);
  }
}
