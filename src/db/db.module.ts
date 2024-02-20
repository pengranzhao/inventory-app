import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from '../entities/inventory.entity';
import { ReaderService } from './service/reader.service';
import { Order } from 'src/entities/order.entity';
import { WriterService } from './service/writer.service';
import { env } from 'process';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),          
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: env.DB_HOST,
            port: parseInt(env.DB_PORT, 10),
            username: env.DB_USER,
            password: env.DB_PASSWORD,
            database: env.DATABASE,
            entities: [Inventory, Order],
            synchronize: true,
        }),
        TypeOrmModule.forFeature([Inventory, Order])
    ],
    providers: [ReaderService, WriterService],
    exports: [ReaderService, WriterService]
})
export class DBModule {}
