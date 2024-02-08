import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private repository: Repository<Product>,
    private elasticsearchService: ElasticsearchService,
  ) {}

  async createProduct(product: CreateProductDto): Promise<Product> {
    const p = new Product();
    p.name = product.name;
    p.description = product.description;
    const createdProduct = await this.repository.save(p);
    await this.indexProduct(createdProduct);
    return createdProduct;
  }

  async indexProduct(product: Product) {
    await this.elasticsearchService.index({
      index: 'products',
      id: product.id.toString(), // Convert the id to a string
      body: product,
    });
  }

  async searchProducts(query: string): Promise<any> {
    const response = await this.elasticsearchService.search({
      index: 'products',
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ['name', 'description'], // Adjust fields as needed
          },
        },
      },
    });
    return response;
  }
}
