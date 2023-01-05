import { PickType } from '@nestjs/swagger';
import { PartnerDto } from '../partner.dto';

export class IdPartnerRequestDto extends PickType(PartnerDto, ['id']) {}
