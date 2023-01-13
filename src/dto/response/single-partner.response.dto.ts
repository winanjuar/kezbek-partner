import { ApiProperty } from '@nestjs/swagger';
import { PartnerDto } from '../partner.dto';
import { BaseResponseDto } from './base.response.dto';

export class SinglePartnerResponseDto extends BaseResponseDto {
  constructor(statusCode: number, message: string, data: PartnerDto) {
    super(statusCode, message);
    this.data = data;
  }

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({
    example: 'This is sample get single data successfully',
  })
  message: string;

  @ApiProperty({ type: PartnerDto })
  data: PartnerDto;
}
