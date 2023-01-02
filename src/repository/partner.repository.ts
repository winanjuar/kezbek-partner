import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import generateApiKey from 'generate-api-key';
import { Partner } from '../entity/partner.entity';

@Injectable()
export class PartnerRepository extends Repository<Partner> {
  constructor(private readonly dataSource: DataSource) {
    super(Partner, dataSource.createEntityManager());
  }

  async createNewPartner(partner): Promise<Partner> {
    partner.api_key = generateApiKey({ method: 'base62' });
    return await this.save(partner);
  }

  async findOneByIdPartner(id: string): Promise<Partner> {
    return await this.findOne({ where: { id } });
  }

  async findOneByApiKey(api_key: string): Promise<Partner> {
    return await this.findOne({ where: { api_key } });
  }
}
