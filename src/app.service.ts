import { Injectable, NotFoundException } from '@nestjs/common';
import { Partner } from './entity/partner.entity';
import { PartnerRepository } from './repository/partner.repository';
import { CreatePartnerRequestDto } from './dto/request/create-partner.request.dto';

@Injectable()
export class AppService {
  constructor(private readonly partnerRepository: PartnerRepository) {}

  async createPartner(partnerDto: CreatePartnerRequestDto): Promise<Partner> {
    return await this.partnerRepository.createNewPartner(partnerDto);
  }

  async findPartnerById(id: string): Promise<Partner> {
    const partner = await this.partnerRepository.findOneByIdPartner(id);
    if (!partner) {
      throw new NotFoundException(`Partner with id ${id} doesn't exist`);
    }
    return partner;
  }

  async findPartnerByApiKey(apikey: string): Promise<Partner> {
    const partner = await this.partnerRepository.findOneByApiKey(apikey);
    if (!partner) {
      throw new NotFoundException(
        `Partner with API Key ${apikey} doesn't exist`,
      );
    }
    return partner;
  }
}
