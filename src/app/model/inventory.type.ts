import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { OrderType } from './order.type';

@ObjectType('Inventory')
export class InventoryType {
  @Field(() => ID)
  id: number;

  @Field()
  productId: string;

  @Field()
  name: string;

  @Field(() => Int)
  quantity: number;

  @Field()
  category: string;

  @Field()
  subCategory: string;

  @Field(() => [OrderType])
  orders: OrderType[];
}
