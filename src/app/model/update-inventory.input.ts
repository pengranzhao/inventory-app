import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateInventoryInput {
  @Field()
  productId: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => Int, { nullable: true })
  quantity?: number;

  @Field(() => String, { nullable: true })
  category?: string;

  @Field({ nullable: true })
  subCategory?: string;
}
