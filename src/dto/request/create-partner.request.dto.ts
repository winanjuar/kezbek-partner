import { OmitType } from '@nestjs/swagger';
import { PartnerDto } from '../partner.dto';

export class CreatePartnerRequestDto extends OmitType(PartnerDto, [
  'id',
  'api_key',
  'api_secret',
]) {}
