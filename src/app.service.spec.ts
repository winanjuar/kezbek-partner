import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { pick } from 'lodash';

import { AppService } from './app.service';
import { CreatePartnerRequestDto } from './dto/request/create-partner.request.dto';
import { IdPartnerRequestDto } from './dto/request/id-partner.request.dto';
import { Partner } from './entity/partner.entity';
import { PartnerRepository } from './repository/partner.repository';

describe('AppService', () => {
  let appService: AppService;
  let mockPartner: Partner;

  const mockPartnerRepo = {
    createNewPartner: jest.fn(() => Promise.resolve(mockPartner)),
    findOneByIdPartner: jest.fn(() => Promise.resolve(mockPartner)),
    findOneByApiKey: jest.fn(() => Promise.resolve(mockPartner)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        { provide: PartnerRepository, useValue: mockPartnerRepo },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
    mockPartner = {
      id: '67746a2b-d693-47e1-99f5-f44572aee307',
      name: 'Bukalapak',
      api_key: '5st43WouSdVwCcu4TWeP3N',
      api_secret: 'dUeDUxSmpsV0ZTR3VHUWE4PSIsImFs',
      pic_email: 'admin@bukalapak.com',
      pic_phone: '+6285712312332',
      created_at: '2023-01-01T05:26:21.766Z',
      updated_at: '2023-01-01T05:26:21.766Z',
      deleted_at: null,
    };
  });

  afterEach(() => jest.clearAllMocks());

  describe('createNewPartner', () => {
    it('should return new partner just created', async () => {
      // arrange
      const partnerDto: CreatePartnerRequestDto = pick(mockPartner, [
        'name',
        'pic_email',
        'pic_phone',
      ]);
      const spyCreateNewPartner = jest
        .spyOn(mockPartnerRepo, 'createNewPartner')
        .mockResolvedValue(mockPartner);

      // act
      const partner = await appService.createPartner(partnerDto);

      // assert
      expect(partner).toEqual(mockPartner);
      expect(spyCreateNewPartner).toHaveBeenCalledTimes(1);
      expect(spyCreateNewPartner).toHaveBeenCalledWith(partnerDto);
    });
  });

  describe('findPartnerById', () => {
    it('should return a partner', async () => {
      // arrange
      const partnerDto = plainToInstance(IdPartnerRequestDto, {
        id: mockPartner.id,
      });
      const id = partnerDto.id;
      const spyFindOneByIdPartner = jest
        .spyOn(mockPartnerRepo, 'findOneByIdPartner')
        .mockResolvedValue(mockPartner);

      // act
      const partner = await appService.findPartnerById(id);

      // assert
      expect(partner).toEqual(mockPartner);
      expect(spyFindOneByIdPartner).toHaveBeenCalledTimes(1);
      expect(spyFindOneByIdPartner).toHaveBeenCalledWith(id);
    });

    it('should throw not found exception', async () => {
      // arrange
      const id = '67746a2b-d693-47e1-99f5-f44572aee309';
      const spyFindOneByIdPartner = jest
        .spyOn(mockPartnerRepo, 'findOneByIdPartner')
        .mockReturnValue(null);

      // act
      const findPartnerById = appService.findPartnerById(id);

      // assert
      await expect(findPartnerById).rejects.toEqual(
        new NotFoundException(`Partner with id ${id} doesn't exist`),
      );
      expect(spyFindOneByIdPartner).toHaveBeenCalledTimes(1);
      expect(spyFindOneByIdPartner).toHaveBeenCalledWith(id);
    });
  });

  describe('findPartnerByApiKey', () => {
    it('should return a partner', async () => {
      // arrange
      const apikey = mockPartner.api_key;
      const spyFindOneByApiKey = jest
        .spyOn(mockPartnerRepo, 'findOneByApiKey')
        .mockResolvedValue(mockPartner);

      // act
      const partner = await appService.findPartnerByApiKey(apikey);

      // assert
      expect(partner).toEqual(mockPartner);
      expect(spyFindOneByApiKey).toHaveBeenCalledTimes(1);
      expect(spyFindOneByApiKey).toHaveBeenCalledWith(apikey);
    });

    it('should throw not found exception', async () => {
      // arrange
      const apikey = 'NotExistApiKey';
      const spyFindOneByApiKey = jest
        .spyOn(mockPartnerRepo, 'findOneByApiKey')
        .mockResolvedValue(null);

      // act
      const findPartnerByApiKey = appService.findPartnerByApiKey(apikey);

      // assert
      await expect(findPartnerByApiKey).rejects.toEqual(
        new NotFoundException(`Partner with API Key ${apikey} doesn't exist`),
      );
      expect(spyFindOneByApiKey).toHaveBeenCalledTimes(1);
      expect(spyFindOneByApiKey).toHaveBeenCalledWith(apikey);
    });
  });
});
