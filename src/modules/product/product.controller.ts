import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Body() product: CreateProductDto) {
    return await this.productService.createProduct(product);
  }

  @Get('search')
  async searchProducts(@Query('q') query: string): Promise<any> {
    return await this.productService.searchProducts(query);
  }
}
