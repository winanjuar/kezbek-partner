import { OmitType } from '@nestjs/swagger';
import { PartnerDto } from './partner.dto';

export class CreatePartnerDto extends OmitType(PartnerDto, ['id', 'api_key']) {}
