import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AppService as InventoryService} from '../service/app.service';
import { InventoryType } from '../model/inventory.type';
import { UpdateInventoryInput } from '../model/update-inventory.input';

import { InventorySortInput } from '../model/inventory-sort.input';
import { InventoryFilterInput } from '../model/inventory-filter.input';
import { UseFilters } from '@nestjs/common';
import { AllExceptionFilter } from '../filter/all-exception.filter';

@Resolver(of => InventoryType)
export class InventoryResolver {
  constructor(private inventoryService: InventoryService) {}

  @Query(returns => [InventoryType])
  @UseFilters(new AllExceptionFilter()) 
  async listInventory(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
    @Args('filter', {type: ()=> InventoryFilterInput, nullable: true}) filter: InventoryFilterInput,
    @Args('sort', { type: () => InventorySortInput, nullable: true }) sort: InventorySortInput
  )  : Promise<InventoryType[]> {
    return this.inventoryService.findAll({ page, limit, filter, sort });
  }

  @Mutation(returns => [InventoryType])
  @UseFilters(new AllExceptionFilter()) 
  async updateInventory (
    @Args('updateInventoryInputs', { type: () => [UpdateInventoryInput] }) updateInventoryInputs: UpdateInventoryInput[],

  ) : Promise<InventoryType[]> {
    return this.inventoryService.update(updateInventoryInputs);
  }
}
