import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';

import { User } from '../users/user.entity';
import { UserRole } from '../common/enums/user-role.enum';

export class AdminUserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const adminEmail = 'admin@restaurant.com';

    const existingAdmin = await em.findOne(User, { email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const passwordHash = await bcrypt.hash('admin123', 10);

    const admin = em.create(User, {
      name: 'Super Admin',
      email: 'admin@restaurant.com',
      password: passwordHash,
      role: UserRole.ADMIN,
      phone: '9999999999',
      createdAt: new Date(),
    });

    em.persist(admin);

    console.log(' Admin user created');
  }
}
