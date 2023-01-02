import { ApiProperty } from '@nestjs/swagger';
import { PartnerDto } from '../core/partner.dto';
import { BaseResponseDto } from './base.response.dto';

export class CreatePartnerResponseDto extends BaseResponseDto {
  constructor(statusCode: number, message: string, data: PartnerDto) {
    super(statusCode, message);
    this.data = data;
  }

  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: 'Create new partner successfully' })
  message: string;

  @ApiProperty({ type: PartnerDto })
  data: PartnerDto;
}
