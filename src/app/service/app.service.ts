import { Injectable } from '@nestjs/common';
import { ReaderService } from 'src/db/service/reader.service';
import { Inventory } from 'src/entities/inventory.entity';
import { UpdateInventoryInput } from '../model/update-inventory.input';
import { WriterService } from 'src/db/service/writer.service';

@Injectable()
export class AppService {

  constructor(
    private readonly reader: ReaderService,
    private readonly writer: WriterService
  ) {
  }

  async findAll({ page, limit, filter, sort}): Promise<Inventory[]> {
    return this.reader.listInventoryWithQueryBuilder({page, limit, filter, sort});
  }

  async update(updateInventoryInputs : UpdateInventoryInput[]) : Promise<Inventory[]> {
     return this.writer.bulkUpdate(updateInventoryInputs);
  }

}
