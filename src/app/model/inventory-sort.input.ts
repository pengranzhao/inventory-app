import { InputType, Field } from "@nestjs/graphql";
import { InventorySortField, SortOrder } from "./inventory-sort.enums";

@InputType()
export class InventorySortInput {
  @Field(type => InventorySortField)
  field: InventorySortField;

  @Field(type => SortOrder)
  order: SortOrder;
}