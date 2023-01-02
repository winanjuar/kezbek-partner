import { HttpStatus, InternalServerErrorException } from '@nestjs/common';
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

  describe('createPartner', () => {
    const partnerDto: CreatePartnerDto = pick(mockPartner, [
      'name',
      'pic_email',
      'pic_phone',
    ]);

    it('should response single response partner', async () => {
      // arrange
      const spyCreatePartner = jest
        .spyOn(mockAppService, 'createPartner')
        .mockResolvedValue(mockPartner);
      mockCreateResponse = new CreatePartnerResponseDto(
        HttpStatus.CREATED,
        `Create new partner successfully`,
        mockPartner,
      );

      // act
      const response = await controller.createPartner(partnerDto);

      // assert
      expect(response).toEqual(mockCreateResponse);
      expect(spyCreatePartner).toHaveBeenCalledTimes(1);
      expect(spyCreatePartner).toHaveBeenCalledWith(partnerDto);
    });

    it('should throw internal server error when unknown error occured', async () => {
      // arrange
      const spyCreatePartner = jest
        .spyOn(mockAppService, 'createPartner')
        .mockRejectedValue(new InternalServerErrorException('error'));

      // act
      const createPartner = controller.createPartner(partnerDto);

      // assert
      await expect(createPartner).rejects.toEqual(
        new InternalServerErrorException('error'),
      );
      expect(spyCreatePartner).toHaveBeenCalledTimes(1);
      expect(spyCreatePartner).toHaveBeenCalledWith(partnerDto);
    });
  });

  describe('getPartnerById', () => {
    it('should response single response partner', async () => {
      // arrange
      const partnerDto: IdPartnerDto = pick(mockPartner, ['id']);
      const id = partnerDto.id;
      const spyFindPartnerById = jest
        .spyOn(mockAppService, 'findPartnerById')
        .mockResolvedValue(mockPartner);
      mockSingleResponse = new SinglePartnerResponseDto(
        HttpStatus.OK,
        `Get data partner with ID ${id} successfully`,
        mockPartner,
      );

      // act
      const response = await controller.getPartnerById(partnerDto);

      // assert
      expect(response).toEqual(mockSingleResponse);
      expect(spyFindPartnerById).toHaveBeenCalledTimes(1);
      expect(spyFindPartnerById).toHaveBeenCalledWith(id);
    });

    it('should throw internal server error when unknown error occured', async () => {
      // arrange
      const partnerDto: IdPartnerDto = pick(mockPartner, ['id']);
      const id = partnerDto.id;
      const spyFindPartnerById = jest
        .spyOn(mockAppService, 'findPartnerById')
        .mockRejectedValue(new InternalServerErrorException('error'));

      // act
      const getPartnerById = controller.getPartnerById(partnerDto);

      // assert
      await expect(getPartnerById).rejects.toEqual(
        new InternalServerErrorException('error'),
      );
      expect(spyFindPartnerById).toHaveBeenCalledTimes(1);
      expect(spyFindPartnerById).toHaveBeenCalledWith(id);
    });
  });

  describe('getPartnerByAPI', () => {
    it('should response single response partner', async () => {
      // arrange
      const apikey = mockPartner.api_key;
      const spyFindPartnerByApiKey = jest
        .spyOn(mockAppService, 'findPartnerByApiKey')
        .mockResolvedValue(mockPartner);
      mockSingleResponse = new SinglePartnerResponseDto(
        HttpStatus.OK,
        `Get data partner with API Key ${apikey} successfully`,
        mockPartner,
      );

      // act
      const response = await controller.getPartnerByAPI(apikey);

      // assert
      expect(response).toEqual(mockSingleResponse);
      expect(spyFindPartnerByApiKey).toHaveBeenCalledTimes(1);
      expect(spyFindPartnerByApiKey).toHaveBeenCalledWith(apikey);
    });

    it('should throw internal server error when unknown error occured', async () => {
      // arrange
      const apikey = mockPartner.api_key;
      const spyFindPartnerByApiKey = jest
        .spyOn(mockAppService, 'findPartnerByApiKey')
        .mockRejectedValue(new InternalServerErrorException('error'));

      // act
      const getPartnerByAPI = controller.getPartnerByAPI(apikey);

      // assert
      await expect(getPartnerByAPI).rejects.toEqual(
        new InternalServerErrorException('error'),
      );
      expect(spyFindPartnerByApiKey).toHaveBeenCalledTimes(1);
      expect(spyFindPartnerByApiKey).toHaveBeenCalledWith(apikey);
    });
  });

  describe('pipeValidation', () => {
    it('should pass all validation for correct dto', async () => {
      // arrange
      const partnerDto: CreatePartnerDto = pick(mockPartner, [
        'name',
        'pic_email',
        'pic_phone',
      ]);

      // act
      const errors = await validate(partnerDto);

      // assert
      expect(errors.length).toBe(0);
    });

    it('should throw error when uuid invalid format', async () => {
      // arrange
      const notValidId = { id: '67746-a2bd693-47e1-99f5-f44572aee309' };
      const partnerDto = plainToInstance(IdPartnerDto, notValidId);

      // act
      const errors = await validate(partnerDto);

      // assert
      expect(errors.length).toBe(1);
    });

    it('should throw error when create partner dto contains many errors', async () => {
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
});
