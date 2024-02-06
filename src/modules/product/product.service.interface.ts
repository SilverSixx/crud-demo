import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';

export interface ProductServiceInterface {
  create(productDto: CreateProductDto): Promise<Product>;
  update(productId: any, updateProduct: any): Promise<Product>;
  search(q: any): Promise<any>;
}
