import { PickType } from '@nestjs/swagger';
import { PartnerDto } from './partner.dto';

export class IdPartnerDto extends PickType(PartnerDto, ['id']) {}
