import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from '../entities/inventory.entity';
import { ReaderService } from './reader.service';
import { Order } from 'src/entities/order.entity';
import { WriterService } from './writer.service';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'password',
            database: 'postgres',
            entities: [Inventory, Order],
            synchronize: true, // Note: Only use in development
        }),
        TypeOrmModule.forFeature([Inventory, Order])
    ],
    providers: [ReaderService, WriterService],
    exports: [ReaderService, WriterService]
})
export class DBModule {}
