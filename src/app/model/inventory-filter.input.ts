import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class InventoryFilterInput {
    @Field({ nullable: true})
    category?: string;

    @Field({ nullable: true})
    subCategory?: string;

    @Field({ nullable: true})
    inStock?: boolean;
}