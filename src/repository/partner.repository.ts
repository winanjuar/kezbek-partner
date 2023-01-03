import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import generateApiKey from 'generate-api-key';
import { Partner } from '../entity/partner.entity';
import { CreatePartnerRequestDto } from 'src/dto/request/create-partner.request.dto';

@Injectable()
export class PartnerRepository extends Repository<Partner> {
  constructor(private readonly dataSource: DataSource) {
    super(Partner, dataSource.createEntityManager());
  }

  async createNewPartner(
    partnerDto: CreatePartnerRequestDto,
  ): Promise<Partner> {
    const partner = new Partner();
    partner.name = partnerDto.name;
    partner.pic_email = partnerDto.pic_email;
    partner.pic_phone = partnerDto.pic_phone;
    partner.api_key = generateApiKey({ method: 'base62' }) as string;
    partner.api_secret = generateApiKey({ method: 'base62' }) as string;
    return await this.save(partner);
  }

  async findOneByIdPartner(id: string): Promise<Partner> {
    return await this.findOne({ where: { id } });
  }

  async findOneByApiKey(api_key: string): Promise<Partner> {
    return await this.findOne({ where: { api_key } });
  }
}
