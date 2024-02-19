import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType('Order')
export class OrderType {
  @Field(() => ID)
  orderId: string;

  @Field()
  productId: string;

  @Field()
  currency: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Int)
  shippingCost: number;

  @Field(() => Int)
  amount: number;

  @Field()
  channel: string;

  @Field()
  channelGroup: string;

  @Field({ nullable: true })
  campaign: string;

  @Field()
  dateTime: Date;
}
