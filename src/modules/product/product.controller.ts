import { Body, Controller, Inject, Param, Patch, Post, Get, Query } from '@nestjs/common';
import { ProductServiceInterface } from './product.service.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductController {
  constructor(
    @Inject('ProductServiceInterface')
    private readonly productService: ProductServiceInterface,
  ) {}

  @Get('/search')
  public async search(@Query() query: any): Promise<any> {
    return await this.productService.search(query.q);
  }

  @Post()
  public async create(@Body() productDto: CreateProductDto): Promise<Product> {
    return await this.productService.create(productDto);
  }

  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @Body() updateProduct: any,
  ): Promise<Product> {
    return await this.productService.update(id, updateProduct);
  }
}
