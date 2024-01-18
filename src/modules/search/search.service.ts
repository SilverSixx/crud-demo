import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(
    private readonly esService: ElasticsearchService,
    private readonly configService: ConfigService,
  ) {}

  public async createIndex() {
    const index = this.configService.get<string>('ELASTIC_INDEX');
    const isIndexExists = await this.esService.indices.exists({ index });
    if (!isIndexExists) {
      this.esService.indices.create({
        index,
        body: {},
      });
    }
  }
}
  