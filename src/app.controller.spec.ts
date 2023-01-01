import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { pick } from 'lodash';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { IdPartnerDto } from './dto/id-partner.dto';
import { CreatePartnerResponseDto } from './dto/response/create-partner.response.dto';
import { SinglePartnerResponseDto } from './dto/response/single-partner.response.dto';
import { Partner } from './entity/partner.entity';

describe('AppController', () => {
  let controller: AppController;
  let mockPartner: Partner;
  let mockSingleResponse: SinglePartnerResponseDto;
  let mockCreateResponse: CreatePartnerResponseDto;

  const mockAppService = {
    createPartner: jest.fn(() => Promise.resolve(mockPartner)),
    findPartnerById: jest.fn(() => Promise.resolve(mockPartner)),
    findPartnerByApiKey: jest.fn(() => Promise.resolve(mockPartner)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: mockAppService }],
    }).compile();

    controller = module.get<AppController>(AppController);

    mockPartner = {
      id: '67746a2b-d693-47e1-99f5-f44572aee307',
      name: 'Bukalapak',
      api_key: '5st43WouSdVwCcu4TWeP3N',
      pic_email: 'admin@bukalapak.com',
      pic_phone: '+6285712312332',
      created_at: '2023-01-01T05:26:21.766Z',
      updated_at: '2023-01-01T05:26:21.766Z',
      deleted_at: null,
    };
  });

  afterEach(() => jest.clearAllMocks());

  describe('ValidationPipe', () => {
    it('should throw error when uuid not valid', async () => {
      // arrange
      const notValidId = { id: '67746-a2bd693-47e1-99f5-f44572aee309' };
      const partnerDto = plainToInstance(IdPartnerDto, notValidId);

      // act
      const errors = await validate(partnerDto);

      // assert
      expect(errors.length).not.toBe(0);
    });

    it('should throw error when create partner not valid', async () => {
      // arrange
      const notValidCreateDto = {
        name: 'Bkk',
        pic_email: 'admin.bukalapak.com',
        pic_phone: '0811',
      };
      const partnerDto = plainToInstance(CreatePartnerDto, notValidCreateDto);

      // act
      const errors = await validate(partnerDto);

      // assert
      expect(errors.length).not.toBe(0);
    });
  });
  describe('POST /api/v1 - getPartnerById', () => {
    it('should response single response partner', async () => {
      // arrange
      const partnerDto: CreatePartnerDto = pick(mockPartner, [
        'name',
        'pic_email',
        'pic_phone',
      ]);
      const createPartnerSpy = jest
        .spyOn(mockAppService, 'createPartner')
        .mockResolvedValue(mockPartner as Partner);
      mockCreateResponse = new CreatePartnerResponseDto(
        HttpStatus.CREATED,
        `Create new partner successfully`,
        mockPartner,
      );

      // // act
      const response = await controller.createPartner(partnerDto);

      // assert
      expect(response).toEqual(mockCreateResponse);
      expect(createPartnerSpy).toHaveBeenCalledTimes(1);
      expect(createPartnerSpy).toHaveBeenCalledWith(partnerDto);
    });
  });

  describe('GET /api/v1/:id - getPartnerById', () => {
    it('should response single response partner', async () => {
      // arrange
      const partnerDto = plainToInstance(IdPartnerDto, { id: mockPartner.id });
      const id = partnerDto.id;
      const findPartnerByIdSpy = jest
        .spyOn(mockAppService, 'findPartnerById')
        .mockResolvedValue(mockPartner as Partner);
      mockSingleResponse = new SinglePartnerResponseDto(
        HttpStatus.OK,
        `Get data partner with ID ${id} successfully`,
        mockPartner,
      );

      // // act
      const response = await controller.getPartnerById(partnerDto);

      // assert
      expect(response).toEqual(mockSingleResponse);
      expect(findPartnerByIdSpy).toHaveBeenCalledTimes(1);
      expect(findPartnerByIdSpy).toHaveBeenCalledWith(id);
    });
  });

  describe('GET /api/v1/get-by-apikey/:api - getPartnerByAPI', () => {
    it('should response single response partner', async () => {
      // arrange
      const apikey = mockPartner.api_key;
      const findPartnerByApiKeySpy = jest
        .spyOn(mockAppService, 'findPartnerByApiKey')
        .mockResolvedValue(mockPartner as Partner);
      mockSingleResponse = new SinglePartnerResponseDto(
        HttpStatus.OK,
        `Get data partner with API Key ${apikey} successfully`,
        mockPartner,
      );

      // // act
      const response = await controller.getPartnerByAPI(apikey);

      // assert
      expect(response).toEqual(mockSingleResponse);
      expect(findPartnerByApiKeySpy).toHaveBeenCalledTimes(1);
      expect(findPartnerByApiKeySpy).toHaveBeenCalledWith(apikey);
    });
  });
});
