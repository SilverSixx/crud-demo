import { Inject, Injectable } from '@nestjs/common';
import { ProductRepositoryInterface } from './product.repository.interface';
import { ProductServiceInterface } from './product.service.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { SearchServiceInterface } from '../search/search.service.interface';
import { ProductSearchObject } from './product.search.object';

@Injectable()
export class ProductService implements ProductServiceInterface {
  constructor(
    @Inject('ProductRepositoryInterface')
    private readonly productRepository: ProductRepositoryInterface,
    @Inject('SearchServiceInterface')
    private readonly searchService: SearchServiceInterface<any>,
  ) {}

  public async search(q: any): Promise<any> {
    const data = ProductSearchObject.searchObject(q);
    return await this.searchService.searchIndex(data);
  }

  public async create(productDto: CreateProductDto): Promise<Product> {
    const product = new Product();
    product.name = productDto.name;
    product.description = productDto.description;
    product.price = productDto.price;
    return await this.productRepository.create(product);
  }

  public async update(productId: any, updateProduct: any): Promise<Product> {
    const product = await this.productRepository.findOneById(productId);
    product.name = updateProduct.name;
    product.description = updateProduct.description;
    product.price = updateProduct.price;
    return await this.productRepository.create(product);
  }
}
