import { registerEnumType } from '@nestjs/graphql';

export enum InventorySortField {
  QUANTITY = "quantity",
  ORDER_COUNT = "orderCount",
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(InventorySortField, {
  name: 'InventorySortField',
});

registerEnumType(SortOrder, {
  name: 'SortOrder',
});
