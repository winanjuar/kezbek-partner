import { OmitType } from '@nestjs/swagger';
import { PartnerDto } from '../core/partner.dto';

export class CreatePartnerRequestDto extends OmitType(PartnerDto, [
  'id',
  'api_key',
]) {}
