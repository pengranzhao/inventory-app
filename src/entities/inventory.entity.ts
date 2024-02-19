import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToMany } from 'typeorm';
import { Order } from './order.entity';

@Entity('inventories')
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name : 'product_id', unique: true})
  productId: string;

  @Column()
  name: string;
  
  @Column()
  quantity: number;

  @Column()
  category: string;

  @Column({name : 'sub_category'})
  subCategory: string;

  @OneToMany(()=>Order, (order) => order.inventory)
  orders: Order[]
}
