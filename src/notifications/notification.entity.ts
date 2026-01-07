import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { User } from '../users/user.entity';

@Entity()
export class Notification {

  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @Property()
  type!: string;

  @Property({ type: 'json' })
  data!: any;

  @Property({ default: false })
  isRead!: boolean;

  @Property({ onCreate: () => new Date() })
  createdAt?: Date;
}