import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryFilterInput } from 'src/app/model/inventory-filter.input';
import { InventorySortField } from 'src/app/model/inventory-sort.enums';
import { InventorySortInput } from 'src/app/model/inventory-sort.input';

import { Inventory } from 'src/entities/inventory.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
@Injectable()
export class ReaderService {

  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) {
  }

  async listInventoryWithQueryBuilder({ page, limit, filter, sort }): Promise<Inventory[]> {
    let queryBuilder = this.inventoryRepository.createQueryBuilder('inventories')
      .leftJoinAndSelect('inventories.orders', 'orders')

    queryBuilder = this.addFilterByIfAny(queryBuilder, filter);

    queryBuilder = this.addOrderByIfAny(queryBuilder, sort);

    queryBuilder = queryBuilder.take(limit).skip((page - 1) * limit);
    const sql = queryBuilder.getQuery();
    return queryBuilder.getMany();
  }

  private addOrderByIfAny(queryBuilder: SelectQueryBuilder<Inventory>, sort: InventorySortInput) {
    if (sort && sort.field === InventorySortField.QUANTITY) {
      queryBuilder = queryBuilder.orderBy('inventories.quantity', sort.order);
    } else {
      queryBuilder = queryBuilder.orderBy('inventories.id', 'ASC');
    }

    return queryBuilder;
  }

  private addFilterByIfAny(queryBuilder: SelectQueryBuilder<Inventory>, filter: InventoryFilterInput) {
    if (!filter) {
      return queryBuilder;
    }
    if (filter.category) {
      queryBuilder = queryBuilder.andWhere('inventories.category = :category', { category: filter.category });
    }
    if (filter.subCategory) {
      queryBuilder = queryBuilder.andWhere('inventories.subCategory = :subCategory', { subCategory: filter.subCategory });
    }
    if (filter.inStock === true) {
      queryBuilder = queryBuilder.andWhere('inventories.quantity > 0');
    } else if (filter.inStock == false) {
      queryBuilder = queryBuilder.andWhere('inventories.quantity = 0');
    }

    return queryBuilder;
  }



}