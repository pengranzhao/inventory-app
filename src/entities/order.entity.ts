import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Inventory } from './inventory.entity';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name : 'order_id'})
    orderId: string;
  
    @Column({ name : 'product_id'})
    productId: string; // Consider linking directly to Inventory ID if applicable
  
    @Column()
    currency: string;
  
    @Column()
    quantity: number;
  
    @Column({name : 'shipping_cost'})
    shippingCost: number;
  
    @Column()
    amount: number;
  
    @Column()
    channel: string;
  
    @Column({ name : 'channel_group'})
    channelGroup: string;
  
    @Column({ nullable: true })
    campaign: string;
  
    @Column({ name : 'datetime'})
    dateTime: Date;
  
    @ManyToOne(() => Inventory, inventory => inventory.orders)
    @JoinColumn({ name: 'product_id', referencedColumnName: 'productId' }) // This assumes productId is unique in Inventory
    inventory: Inventory;
  }