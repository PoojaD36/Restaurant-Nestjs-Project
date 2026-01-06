import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import * as bcrypt from 'bcrypt';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly em: EntityManager) {}

  async create(dto: CreateUserDto) {
    const existingUser = await this.em.findOne(User, {
      email: dto.email,
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.em.create(User, {
      name: dto.name,
      email: dto.email,
      password: passwordHash,
      role: dto.role,
      phone: dto.phone,
      createdAt: new Date(),
    });

    await this.em.persistAndFlush(user);
    return "User created successfully";
  }

  async findAll() {
    return this.em.find(
      User,
      {},
      { fields: ['id', 'name', 'email', 'role', 'phone'] },
    );
  }
}