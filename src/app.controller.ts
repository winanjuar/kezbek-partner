import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AppService } from './app.service';

import { CreatePartnerRequestDto } from './dto/request/create-partner.request.dto';
import { IdPartnerRequestDto } from './dto/request/id-partner.request.dto';

import { BadRequestResponseDto } from './dto/response/bad-request.response.dto';
import { CreatePartnerResponseDto } from './dto/response/create-partner.response.dto';
import { InternalServerErrorDto } from './dto/response/internal-server-error.response.dto';
import { NotFoundResponseDto } from './dto/response/not-found.response.dto';
import { SinglePartnerResponseDto } from './dto/response/single-partner.response.dto';

@ApiTags('Partner')
@Controller({ version: '1' })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiBody({ type: CreatePartnerRequestDto })
  @ApiCreatedResponse({ type: CreatePartnerResponseDto })
  @ApiBadRequestResponse({ type: BadRequestResponseDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorDto })
  @Post()
  async createPartner(@Body() partnerDto: CreatePartnerRequestDto) {
    try {
      const newPartner = await this.appService.createPartner(partnerDto);
      return new CreatePartnerResponseDto(
        HttpStatus.CREATED,
        'Create new partner successfully',
        newPartner,
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @ApiOkResponse({ type: SinglePartnerResponseDto })
  @ApiBadRequestResponse({ type: BadRequestResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorDto })
  @Get(':id')
  async getPartnerById(@Param() partnerDto: IdPartnerRequestDto) {
    try {
      const partner = await this.appService.findPartnerById(partnerDto.id);
      return new SinglePartnerResponseDto(
        HttpStatus.OK,
        `Get data partner with ID ${partnerDto.id} successfully`,
        partner,
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @ApiOkResponse({ type: SinglePartnerResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorDto })
  @Get('/get-by-apikey/:apikey')
  async getPartnerByAPI(@Param('apikey') apikey: string) {
    try {
      const partner = await this.appService.findPartnerByApiKey(apikey);
      return new SinglePartnerResponseDto(
        HttpStatus.OK,
        `Get data partner with API Key ${apikey} successfully`,
        partner,
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
