import { HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { pick } from 'lodash';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Partner } from './entity/partner.entity';

import { CreatePartnerRequestDto } from './dto/request/create-partner.request.dto';
import { IdPartnerRequestDto } from './dto/request/id-partner.request.dto';
import { CreatePartnerResponseDto } from './dto/response/create-partner.response.dto';
import { SinglePartnerResponseDto } from './dto/response/single-partner.response.dto';
import { faker } from '@faker-js/faker';
import { IRequestInfoPartner } from './core/request-info-partner.interface';
import { IRequestInfoPartnerKey } from './core/request-info-partner-key.interface';
import { IResponseInfoPartner } from './core/response-info-partner.interface';

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
      id: faker.datatype.uuid(),
      name: faker.name.firstName(),
      api_key: faker.datatype.string(),
      api_secret: faker.datatype.string(),
      pic_email: faker.internet.email(),
      pic_phone: faker.phone.number(),
      created_at: '2023-01-01T05:26:21.766Z',
      updated_at: '2023-01-01T05:26:21.766Z',
      deleted_at: null,
    };
  });

  afterEach(() => jest.clearAllMocks());

  describe('createPartner', () => {
    it('should response single response partner', async () => {
      // arrange
      const partnerDto: CreatePartnerRequestDto = pick(mockPartner, [
        'name',
        'pic_email',
        'pic_phone',
      ]);

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
      const partnerDto: CreatePartnerRequestDto = pick(mockPartner, [
        'name',
        'pic_email',
        'pic_phone',
      ]);

      const spyCreatePartner = jest
        .spyOn(mockAppService, 'createPartner')
        .mockRejectedValue(new InternalServerErrorException());

      // act
      const createPartner = controller.createPartner(partnerDto);

      // assert
      await expect(createPartner).rejects.toEqual(
        new InternalServerErrorException(),
      );
      expect(spyCreatePartner).toHaveBeenCalledTimes(1);
      expect(spyCreatePartner).toHaveBeenCalledWith(partnerDto);
    });
  });

  describe('getPartnerById', () => {
    it('should response single response partner', async () => {
      // arrange
      const partnerDto: IdPartnerRequestDto = pick(mockPartner, ['id']);
      const id = partnerDto.id;
      const spyFindPartnerById = jest
        .spyOn(mockAppService, 'findPartnerById')
        .mockResolvedValue(mockPartner);
      mockSingleResponse = new SinglePartnerResponseDto(
        HttpStatus.OK,
        `Get data partner successfully`,
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
      const partnerDto: IdPartnerRequestDto = pick(mockPartner, ['id']);
      const id = partnerDto.id;
      const spyFindPartnerById = jest
        .spyOn(mockAppService, 'findPartnerById')
        .mockRejectedValue(new InternalServerErrorException());

      // act
      const getPartnerById = controller.getPartnerById(partnerDto);

      // assert
      await expect(getPartnerById).rejects.toEqual(
        new InternalServerErrorException(),
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
        .mockRejectedValue(new InternalServerErrorException());

      // act
      const getPartnerByAPI = controller.getPartnerByAPI(apikey);

      // assert
      await expect(getPartnerByAPI).rejects.toEqual(
        new InternalServerErrorException(),
      );
      expect(spyFindPartnerByApiKey).toHaveBeenCalledTimes(1);
      expect(spyFindPartnerByApiKey).toHaveBeenCalledWith(apikey);
    });
  });

  describe('handleInfoPartnerKey', () => {
    it('should response single response partner', async () => {
      // arrange
      const data: IRequestInfoPartnerKey = {
        transaction_id: faker.datatype.uuid(),
        api_key: mockPartner.api_key,
      };
      const spyFindPartnerByApiKey = jest
        .spyOn(mockAppService, 'findPartnerByApiKey')
        .mockResolvedValue(mockPartner);

      const mockResponse: IResponseInfoPartner = {
        transaction_id: data.transaction_id,
        partner_id: mockPartner.id,
        name: mockPartner.name,
      };

      // act
      const response = await controller.handleInfoPartnerKey(data);

      // assert
      expect(response).toEqual(mockResponse);
      expect(spyFindPartnerByApiKey).toHaveBeenCalledTimes(1);
      expect(spyFindPartnerByApiKey).toHaveBeenCalledWith(data.api_key);
    });

    it('should throw internal server error when unknown error occured', async () => {
      // arrange
      const data: IRequestInfoPartnerKey = {
        transaction_id: faker.datatype.uuid(),
        api_key: mockPartner.api_key,
      };

      const spyFindPartnerByApiKey = jest
        .spyOn(mockAppService, 'findPartnerByApiKey')
        .mockRejectedValue(new InternalServerErrorException());

      // act
      const funHandleInfoPartnerKey = controller.handleInfoPartnerKey(data);

      // assert
      await expect(funHandleInfoPartnerKey).rejects.toEqual(
        new InternalServerErrorException(),
      );
      expect(spyFindPartnerByApiKey).toHaveBeenCalledTimes(1);
      expect(spyFindPartnerByApiKey).toHaveBeenCalledWith(data.api_key);
    });
  });

  describe('handleInfoPartner', () => {
    it('should response single response partner', async () => {
      // arrange
      const data: IRequestInfoPartner = {
        transaction_id: faker.datatype.uuid(),
        partner_id: mockPartner.id,
      };
      const spyFindPartnerById = jest
        .spyOn(mockAppService, 'findPartnerById')
        .mockResolvedValue(mockPartner);

      const mockResponse: IResponseInfoPartner = {
        transaction_id: data.transaction_id,
        partner_id: mockPartner.id,
        name: mockPartner.name,
      };

      // act
      const response = await controller.handleInfoPartner(data);

      // assert
      expect(response).toEqual(mockResponse);
      expect(spyFindPartnerById).toHaveBeenCalledTimes(1);
      expect(spyFindPartnerById).toHaveBeenCalledWith(data.partner_id);
    });

    it('should throw internal server error when unknown error occured', async () => {
      // arrange
      const data: IRequestInfoPartner = {
        transaction_id: faker.datatype.uuid(),
        partner_id: mockPartner.id,
      };

      const spyFindPartnerById = jest
        .spyOn(mockAppService, 'findPartnerById')
        .mockRejectedValue(new InternalServerErrorException());

      // act
      const funHandleInfoPartner = controller.handleInfoPartner(data);

      // assert
      await expect(funHandleInfoPartner).rejects.toEqual(
        new InternalServerErrorException(),
      );
      expect(spyFindPartnerById).toHaveBeenCalledTimes(1);
      expect(spyFindPartnerById).toHaveBeenCalledWith(data.partner_id);
    });
  });

  describe('pipeValidation', () => {
    it('should pass all validation for correct dto', async () => {
      // arrange
      const partnerDto: CreatePartnerRequestDto = pick(mockPartner, [
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
      const partnerDto = plainToInstance(IdPartnerRequestDto, notValidId);

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
      const partnerDto = plainToInstance(
        CreatePartnerRequestDto,
        notValidCreateDto,
      );

      // act
      const errors = await validate(partnerDto);

      // assert
      expect(errors.length).not.toBe(0);
    });
  });
});
