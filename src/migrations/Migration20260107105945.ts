import { Migration } from '@mikro-orm/migrations';

export class Migration20260107105945 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user" ("id" serial primary key, "name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "role" text check ("role" in ('ADMIN', 'RESTAURANT', 'CUSTOMER', 'DELIVERY')) not null, "phone" varchar(255) null, "created_at" timestamptz not null);`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);

    this.addSql(`create table "restaurant" ("id" serial primary key, "name" varchar(255) not null, "image" varchar(255) null, "owner_id" int not null, "created_at" timestamptz not null);`);

    this.addSql(`create table "menu_item" ("id" serial primary key, "name" varchar(255) not null, "price" int not null, "image" varchar(255) null, "restaurant_id" int not null, "is_available" boolean not null default true, "created_at" timestamptz not null);`);

    this.addSql(`create table "order" ("id" serial primary key, "customer_id" int not null, "restaurant_id" int not null, "status" text check ("status" in ('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED')) not null default 'PENDING', "total_amount" int not null, "estimated_time" int null, "delivery_staff_id" int null, "created_at" timestamptz not null);`);

    this.addSql(`create table "order_item" ("id" serial primary key, "order_id" int not null, "menu_item_id" int not null, "quantity" int not null, "price" int not null);`);

    this.addSql(`create table "notification" ("id" serial primary key, "user_id" int not null, "type" varchar(255) not null, "data" jsonb not null, "is_read" boolean not null default false, "created_at" timestamptz not null);`);

    this.addSql(`alter table "restaurant" add constraint "restaurant_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "menu_item" add constraint "menu_item_restaurant_id_foreign" foreign key ("restaurant_id") references "restaurant" ("id") on update cascade;`);

    this.addSql(`alter table "order" add constraint "order_customer_id_foreign" foreign key ("customer_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "order" add constraint "order_restaurant_id_foreign" foreign key ("restaurant_id") references "restaurant" ("id") on update cascade;`);
    this.addSql(`alter table "order" add constraint "order_delivery_staff_id_foreign" foreign key ("delivery_staff_id") references "user" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "order_item" add constraint "order_item_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade;`);
    this.addSql(`alter table "order_item" add constraint "order_item_menu_item_id_foreign" foreign key ("menu_item_id") references "menu_item" ("id") on update cascade;`);

    this.addSql(`alter table "notification" add constraint "notification_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
  }

}
