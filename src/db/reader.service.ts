import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryFilterInput } from 'src/app/model/inventory-filter.input';
import { InventorySortField } from 'src/app/model/inventory-sort.enums';
import { InventorySortInput } from 'src/app/model/inventory-sort.input';
import { UpdateInventoryInput } from 'src/app/model/update-inventory.input';

import { Inventory } from 'src/entities/inventory.entity';
import { Order } from 'src/entities/order.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
@Injectable()
export class ReaderService {

    constructor(
        @InjectRepository(Inventory)
        private readonly inventoryRepository: Repository<Inventory>,
    ) {
    }


//     async listInventoryWithQueryBuilder3({page, limit, filter, sort}) : Promise<Inventory[]> {
//         console.log('=========================')
//         console.log(page, limit, filter, sort);
//         let queryBuilder = this.inventoryRepository.createQueryBuilder('inventories')
//         .leftJoinAndSelect('inventories.orders', 'orders')
//         // .take(limit)
//         // .skip((page - 1) * limit);

//             // queryBuilder = this.addFilterByIfAny(queryBuilder, filter);

//             queryBuilder = this.addOrderByIfAny(queryBuilder, sort);
            
//             // queryBuilder = queryBuilder.take(limit).skip((page - 1) * limit);
//             const sql = queryBuilder.getQuery();
// console.log(sql)
//         const [result] = await queryBuilder.getManyAndCount();
//         return result;
//     }
// async listInventoryWithQueryBuilder_({page, limit, filter, sort}) : Promise<Inventory[]> {
//     console.log('=========================')
//     console.log(page, limit, filter, sort);
//     let queryBuilder = this.inventoryRepository.createQueryBuilder('inventories')
//         // .leftJoinAndSelect('inventories.orders', 'orders')

//         queryBuilder = this.addFilterByIfAny(queryBuilder, filter);
//         queryBuilder = this.addOrderByIfAny(queryBuilder, sort);

//         queryBuilder = queryBuilder.leftJoinAndSelect('inventories.orders', 'orders')

//         queryBuilder = queryBuilder.take(limit).skip((page - 1) * limit);
//         const sql = queryBuilder.getQuery();
// console.log(sql)
//     const [result] = await queryBuilder.getManyAndCount();
//     return result;
// }


    async listInventoryWithQueryBuilder({page, limit, filter, sort}) : Promise<Inventory[]> {
        console.log('=========================')
        console.log(page, limit, filter, sort);
        let queryBuilder = this.inventoryRepository.createQueryBuilder('inventories')
            .leftJoinAndSelect('inventories.orders', 'orders')

            queryBuilder = this.addFilterByIfAny(queryBuilder, filter);

            queryBuilder = this.addOrderByIfAny(queryBuilder, sort);
            
            queryBuilder = queryBuilder.take(limit).skip((page - 1) * limit);
            const sql = queryBuilder.getQuery();
console.log(sql)
        const [result] = await queryBuilder.getManyAndCount();
        return result;
    }

    private addOrderByIfAny(queryBuilder: SelectQueryBuilder<Inventory>, sort: InventorySortInput) {
        if (sort && sort.field === InventorySortField.QUANTITY) {
            console.log('to add sort')
            // if (sort.field === InventorySortField.QUANTITY) {
              queryBuilder = queryBuilder.orderBy('inventories.quantity', sort.order);
            // } 
            // else if (sort.field === InventorySortField.ORDER_COUNT) {
            //   queryBuilder = queryBuilder.addSelect(subQuery => {
            //     return subQuery
            //       .select('COUNT(orders.id)', 'orderCount')
            //       .from(Order, 'orders')
            //       .where('orders.product_id = inventories.product_id')
            //   }, 'orderCount')
            //   .orderBy('"orderCount"', sort.order);
            // }
          } else {
            queryBuilder = queryBuilder.orderBy('inventories.id', 'ASC');
          }

        return queryBuilder;
    }

    private addFilterByIfAny(queryBuilder: SelectQueryBuilder<Inventory>, filter: InventoryFilterInput) {
        if (filter) {
            console.log('to add filter', filter.category, filter.subCategory, filter.inStock)
            if (filter.category) {
                console.log('1')
              queryBuilder = queryBuilder.andWhere('inventories.category = :category', { category: filter.category });
            }
            if (filter.subCategory) {
              queryBuilder = queryBuilder.andWhere('inventories.subCategory = :subCategory', { subCategory: filter.subCategory });
            }
            if (filter.inStock === true) {
              queryBuilder = queryBuilder.andWhere('inventories.quantity > 0');
            } else if (filter.inStock == false){
              queryBuilder = queryBuilder.andWhere('inventories.quantity = 0');
            }
        }

        return queryBuilder;
    }

      

}