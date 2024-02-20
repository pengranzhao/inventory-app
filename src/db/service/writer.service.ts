import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateInventoryInput } from "src/app/model/update-inventory.input";
import { Inventory } from "src/entities/inventory.entity";
import { In, Repository } from "typeorm";

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
        const ids: string[] = updateInventoryInputs.map(v => v.productId);

        return await this.inventoryRepository.manager.transaction(
            async () => {

                let existingData: Inventory[] = await this.getAllInventoryByIds(ids);

                const mergedUpdateInventoryInputs: UpdateInventoryInput[] = this.mergeUpdateAndExistingData(updateInventoryInputs, existingData);
                const updatedInventories: Inventory[] =  await this.bulkUpdateWithFullData(mergedUpdateInventoryInputs, ids);

                return updatedInventories;
            });
    }

    // single update command to update multiple rows
    async bulkUpdateWithFullData(updateInventoryInputs: UpdateInventoryInput[], ids: string[]): Promise<Inventory[]> {
        let parameters = [];
        let valuesRows = [];
        let paramCounter = 1;

        updateInventoryInputs.forEach(input => {
            valuesRows.push(`($${paramCounter}, $${paramCounter + 1}, $${paramCounter + 2}::integer, $${paramCounter + 3}, $${paramCounter + 4})`);
            parameters.push(input.productId, input.name, input.quantity, input.category, input.subCategory);
            paramCounter += 5; // Increment the parameter counter
        })

        const query = `
            UPDATE inventories
            SET 
                name = tmp_inventory.name, 
                quantity = tmp_inventory.quantity,
                category = tmp_inventory.category,
                sub_category = tmp_inventory.subCategory
            FROM (VALUES 
                ${valuesRows.join(", ")}
            ) AS tmp_inventory(productId, name, quantity, category, subCategory)
            WHERE inventories.product_id = tmp_inventory.productId;
            `;

        // prevent sql injection
        await this.inventoryRepository.query(query, parameters);

        return this.inventoryRepository.find({
            where: { productId: In(ids) }
        });
    }

    private async getAllInventoryByIds(ids: string[]): Promise<Inventory[]> {
        return this.inventoryRepository.find({
            select: ['id', 'productId', 'name', 'quantity', 'category', 'subCategory'],
            where: {
                productId: In(ids)
            }
        });
    }

    private mergeUpdateAndExistingData(updateInventoryInputs: UpdateInventoryInput[], existingInventoryList: Inventory[]): UpdateInventoryInput[] {
        const inventoryMap: { [productId: string]: Inventory } = existingInventoryList.reduce((acc, inventory) => {
            acc[inventory.productId] = inventory;
            return acc;
        }, {});
        return updateInventoryInputs.map(input => {
            const inventory = inventoryMap[input.productId];

            if (!inventory) {
                throw new NotFoundException(`Inventory of ${input.productId} not found.`)
            }
            const { name, quantity, category, subCategory } = inventory;
            return {
                ...input,
                name: input.name ?? name,
                quantity: input.quantity ?? quantity,
                category: input.category ?? category,
                subCategory: input.subCategory ?? subCategory,
            } as UpdateInventoryInput;
        });
    }

}