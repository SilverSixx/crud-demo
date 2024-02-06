import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { SearchService } from '../search/search.service';
import { ProductElasticIndex } from '../search/product.elastic.index';
import { PostSubscriber } from './product.subcriber';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [
    {
      provide: 'SearchServiceInterface',
      useClass: SearchService,
    },
    ProductElasticIndex,
    PostSubscriber,
  ],
  controllers: [],
  exports: [],
})
export class SubscriberModule {}
