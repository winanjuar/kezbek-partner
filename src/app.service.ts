import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { Partner } from './entity/partner.entity';
import { PartnerRepository } from './repository/partner.repository';

@Injectable()
export class AppService {
  constructor(private readonly partnerRepository: PartnerRepository) {}

  async createPartner(partnerDto: CreatePartnerDto): Promise<Partner> {
    return await this.partnerRepository.createNewPartner(partnerDto);
  }

  async findPartnerById(id: string): Promise<Partner> {
    const partner = await this.partnerRepository.findOneById(id);
    if (!partner) {
      throw new NotFoundException(`Partner with id ${id} doesn't exist`);
    }
    return partner;
  }

  async findPartnerByApiKey(api_key: string): Promise<Partner> {
    const partner = await this.partnerRepository.findOneByApiKey(api_key);
    if (!partner) {
      throw new NotFoundException(
        `Partner with API Key ${api_key} doesn't exist`,
      );
    }
    return partner;
  }
}
