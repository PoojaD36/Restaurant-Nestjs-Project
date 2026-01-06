import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { User } from '../users/user.entity';

@Entity()
export class Restaurant {

  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ nullable: true })
  image?: string;

  @ManyToOne(() => User)
  owner!: User;

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;
}
