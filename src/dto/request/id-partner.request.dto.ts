import { PickType } from '@nestjs/swagger';
import { PartnerDto } from '../core/partner.dto';

export class IdPartnerRequestDto extends PickType(PartnerDto, ['id']) {}
