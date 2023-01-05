import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
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
import { IRequestInfoPartner } from './core/request-info-partner.interface';
import { IResponseInfoPartner } from './core/response-info-partner.interface';

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
  private readonly logger = new Logger(AppController.name);

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
      throw new InternalServerErrorException();
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
      throw new InternalServerErrorException();
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
      throw new InternalServerErrorException();
    }
  }

  @MessagePattern('mp_info_partner')
  async handleInfoPartner(@Payload() data: any) {
    try {
      const partner_id = data.partner_id;
      const transaction_id = data.transaction_id;
      const partner = await this.appService.findPartnerById(partner_id);
      this.logger.log(
        `[MessagePattern mp_info_partner] [${transaction_id}] Get data partner successfully`,
      );
      return partner;
    } catch (error) {
      this.logger.log(`[MessagePattern mp_info_partner] ${error}`);
      throw new InternalServerErrorException();
    }
  }

  @MessagePattern('mp_info_partner_key')
  async handleInfoPartnerKey(
    @Payload() data: IRequestInfoPartner,
  ): Promise<IResponseInfoPartner> {
    try {
      const api_key = data.api_key;
      const transaction_id = data.transaction_id;
      const partner = await this.appService.findPartnerByApiKey(api_key);
      this.logger.log(
        `[MessagePattern mp_info_partner_key] [${transaction_id}] Get data partner successfully`,
      );
      return {
        id: partner.id,
        name: partner.name,
      } as IResponseInfoPartner;
    } catch (error) {
      this.logger.log(`[MessagePattern mp_info_partner_key] ${error}`);
      throw new InternalServerErrorException();
    }
  }
}
