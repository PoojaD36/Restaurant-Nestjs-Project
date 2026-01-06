import { Entity, PrimaryKey, Property, Enum } from '@mikro-orm/core';
import { UserRole } from '../common/enums/user-role.enum';

@Entity()
export class User {

  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ unique: true })
  email!: string;

  @Property()
  password!: string;

  @Enum(() => UserRole)
  role!: UserRole;

  @Property({ nullable: true })
  phone?: string;

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;
}
