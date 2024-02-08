import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ProductController } from '../product/product.controller';
import { ProductService } from '../product/product.service';
import { Product } from '../product/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    ElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: 'http://localhost:9200',
        auth: {
          username: 'elastic',
          password: 'bdl6t5q-fNscEgYVe5rl',
        },
      }),
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class SearchModule {}
