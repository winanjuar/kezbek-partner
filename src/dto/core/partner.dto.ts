import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class PartnerDto {
  @ApiProperty()
  @IsUUID(4)
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  name: string;

  @ApiProperty()
  @IsString()
  api_key: string;

  @ApiProperty()
  @IsString()
  api_secret: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  pic_email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber()
  pic_phone: string;
}
