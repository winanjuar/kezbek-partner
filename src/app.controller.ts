import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
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
import { CreatePartnerDto } from './dto/create-partner.dto';
import { IdPartnerDto } from './dto/id-partner.dto';
import { BadRequestResponseDto } from './dto/response/bad-request.response.dto';
import { CreatePartnerResponseDto } from './dto/response/create-partner.response.dto';
import { InternalServerErrorDto } from './dto/response/internal-server-error.response.dto';
import { NotFoundResponseDto } from './dto/response/not-found.response.dto';
import { SinglePartnerResponseDto } from './dto/response/single-partner.response.dto';

@ApiTags('Partner')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiBody({ type: CreatePartnerDto })
  @ApiCreatedResponse({ type: CreatePartnerResponseDto })
  @ApiBadRequestResponse({ type: BadRequestResponseDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorDto })
  @Post()
  async createTransaction(@Body() partnerDto: CreatePartnerDto) {
    const newPartner = await this.appService.createPartner(partnerDto);
    return new CreatePartnerResponseDto(
      HttpStatus.CREATED,
      'Create new partner successfully',
      newPartner,
    );
  }

  @ApiOkResponse({ type: SinglePartnerResponseDto })
  @ApiBadRequestResponse({ type: BadRequestResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorDto })
  @Get(':id')
  async getPartnerById(@Param() partnerDto: IdPartnerDto) {
    const partner = await this.appService.findPartnerById(partnerDto.id);
    return new CreatePartnerResponseDto(
      HttpStatus.OK,
      `Get data partner with ID ${partnerDto.id} successfully`,
      partner,
    );
  }

  @ApiOkResponse({ type: SinglePartnerResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorDto })
  @Get('/key/:api')
  async getPartnerByAPI(@Param('api') api: string) {
    const partner = await this.appService.findPartnerByApiKey(api);
    return new CreatePartnerResponseDto(
      HttpStatus.OK,
      `Get data partner with API Key ${api} successfully`,
      partner,
    );
  }
}
