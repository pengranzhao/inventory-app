import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateInventoryInput } from "src/app/model/update-inventory.input";
import { Inventory } from "src/entities/inventory.entity";
import { Repository } from "typeorm";

@Injectable()
export class WriterService {

    constructor(
        @InjectRepository(Inventory)
        private readonly inventoryRepository: Repository<Inventory>,
    ) {
    }

    async update(updateInventoryInput: UpdateInventoryInput): Promise<Inventory> {
        const { productId, ...updateData } = updateInventoryInput;
        await this.inventoryRepository.update({ productId }, updateData);
        return this.inventoryRepository.findOne({
          where: { productId },
          relations: ['orders'],
        });
    }

    async bulkUpdate(updateInventoryInputs: UpdateInventoryInput[]): Promise<Inventory[]> {
        // Create a transaction
        return await this.inventoryRepository.manager.transaction(
            async transactionalEntityManager => {
            const updatedInventories: Inventory[] = [];
            for (const updateInventoryInput of updateInventoryInputs) {
                const { productId, ...updateData } = updateInventoryInput;
                await transactionalEntityManager.update(Inventory, { productId }, updateData);
                const updatedInventory = await transactionalEntityManager.findOne(Inventory, {
                    where: { productId },
                    relations: ['orders'],
                });
                if (updatedInventory) {
                    updatedInventories.push(updatedInventory);
                }
            }
            return updatedInventories;
        });
    }

}