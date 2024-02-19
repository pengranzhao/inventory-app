import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReaderService } from 'src/db/reader.service';
import { Inventory } from 'src/entities/inventory.entity';
import { UpdateInventoryInput } from '../model/update-inventory.input';
import { InventorySortField } from '../model/inventory-sort.enums';
import { WriterService } from 'src/db/writer.service';
import { CannotReflectMethodParameterTypeError } from 'typeorm';


@Injectable()
export class AppService {

  constructor(
    private readonly reader: ReaderService,
    private readonly writer: WriterService
  ) {
  }

  async findAll({ page, limit, filter, sort}): Promise<Inventory[]> {

    console.log('---->', sort.field == InventorySortField.ORDER_COUNT)
    if(sort.field == InventorySortField.ORDER_COUNT) {
      // return this.reader.listInventoryWithQueryBuilder_({page, limit, filter, sort});
    }

    return this.reader.listInventoryWithQueryBuilder({page, limit, filter, sort});
    // if (sort && sort.field == InventorySortField.ORDER_COUNT) {
      
    // }
  }

  async update(updateInventoryInputs : UpdateInventoryInput[]) : Promise<Inventory[]> {
    
    //  return this.writer.update(updateInventoryInputs);
     return this.writer.bulkUpdate(updateInventoryInputs);
     
  }

  // private sortByOrderCount(inventories : Inventory[]) {
    
  // }

}
