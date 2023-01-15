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
import { EPatternMessage } from './core/pattern-message.enum';
import { IRequestInfoPartnerKey } from './core/request-info-partner-key.interface';
import { IRequestInfoPartner } from './core/request-info-partner.interface';
import { IResponseInfoPartner } from './core/response-info-partner.interface';

import { CreatePartnerRequestDto } from './dto/request/create-partner.request.dto';
import { IdPartnerRequestDto } from './dto/request/id-partner.request.dto';

import { BadRequestResponseDto } from './dto/response/bad-request.response.dto';
import { CreatePartnerResponseDto } from './dto/response/create-partner.response.dto';
import { InternalServerErrorResponseDto } from './dto/response/internal-server-error.response.dto';
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
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseDto })
  @Post('try-new-partner')
  async createPartner(@Body() partnerDto: CreatePartnerRequestDto) {
    const logIdentifier = 'POST try-new-partner';
    try {
      const newPartner = await this.appService.createPartner(partnerDto);
      this.logger.log(
        `[${logIdentifier}] [${newPartner.id}] Create new partner successfully`,
      );
      return new CreatePartnerResponseDto(
        HttpStatus.CREATED,
        'Create new partner successfully',
        newPartner,
      );
    } catch (error) {
      this.logger.log(`[${logIdentifier}] ${error}`);
      throw new InternalServerErrorException();
    }
  }

  @ApiOkResponse({ type: SinglePartnerResponseDto })
  @ApiBadRequestResponse({ type: BadRequestResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseDto })
  @Get('try-info-partner-by-id/:id')
  async getPartnerById(@Param() partnerDto: IdPartnerRequestDto) {
    const logIdentifier = 'GET try-info-partner-by-id/:id';
    try {
      const partner = await this.appService.findPartnerById(partnerDto.id);
      this.logger.log(
        `[${logIdentifier}] [${partner.id}] Get data partner successfully`,
      );
      return new SinglePartnerResponseDto(
        HttpStatus.OK,
        `Get data partner successfully`,
        partner,
      );
    } catch (error) {
      this.logger.log(`[${logIdentifier}] ${error}`);
      throw new InternalServerErrorException();
    }
  }

  @ApiOkResponse({ type: SinglePartnerResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseDto })
  @Get('try-info-partner-by-api-key/:apikey')
  async getPartnerByAPI(@Param('apikey') apikey: string) {
    const logIdentifier = 'GET try-info-partner-by-api-key/:apikey';
    try {
      const partner = await this.appService.findPartnerByApiKey(apikey);
      this.logger.log(
        `[${logIdentifier}] [${partner.id}] Get data partner successfully`,
      );
      return new SinglePartnerResponseDto(
        HttpStatus.OK,
        `Get data partner with API Key ${apikey} successfully`,
        partner,
      );
    } catch (error) {
      this.logger.log(`[${logIdentifier}] ${error}`);
      throw new InternalServerErrorException();
    }
  }

  @MessagePattern(EPatternMessage.INFO_PARTNER)
  async handleInfoPartner(@Payload() data: IRequestInfoPartner) {
    try {
      const partner_id = data.partner_id;
      const transaction_id = data.transaction_id;
      const partner = await this.appService.findPartnerById(partner_id);
      this.logger.log(
        `[${EPatternMessage.INFO_PARTNER}] [${transaction_id}] Get data partner successfully`,
      );
      return {
        transaction_id,
        partner_id: partner.id,
        name: partner.name,
      } as IResponseInfoPartner;
    } catch (error) {
      this.logger.log(`[${EPatternMessage.INFO_PARTNER}] ${error}`);
      throw new InternalServerErrorException();
    }
  }

  @MessagePattern(EPatternMessage.INFO_PARTNER_KEY)
  async handleInfoPartnerKey(
    @Payload() data: IRequestInfoPartnerKey,
  ): Promise<IResponseInfoPartner> {
    try {
      const api_key = data.api_key;
      const transaction_id = data.transaction_id;
      const partner = await this.appService.findPartnerByApiKey(api_key);
      this.logger.log(
        `[${EPatternMessage.INFO_PARTNER_KEY}] [${transaction_id}] Get data partner successfully`,
      );
      return {
        transaction_id,
        partner_id: partner.id,
        name: partner.name,
      } as IResponseInfoPartner;
    } catch (error) {
      this.logger.log(`[${EPatternMessage.INFO_PARTNER_KEY}] ${error}`);
      throw new InternalServerErrorException();
    }
  }
}
