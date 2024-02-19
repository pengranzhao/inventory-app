import { Module } from '@nestjs/common';
import { AppService } from './service/app.service';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBModule } from 'src/db/db.module';
import { InventoryResolver } from './resolver/app.resolver';
import { join } from 'path';

@Module({
  imports: [
    DBModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // autoSchemaFile: 'schema.gql',
      autoSchemaFile: join(process.cwd(), './schema.gql'), // Specify where to generate the schema file
      sortSchema: true, // Optional: sorts the schema lexicographically
      buildSchemaOptions: {
        // Optional: configuration options for the schema build process
        dateScalarMode: 'timestamp', // Or 'isoDate'
      },
    }),
  ],
  // controllers: [AppController],
  providers: [AppService, InventoryResolver],
})
export class AppModule {}
