import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { pick } from 'lodash';
import { AppService } from './app.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { IdPartnerDto } from './dto/id-partner.dto';
import { Partner } from './entity/partner.entity';
import { PartnerRepository } from './repository/partner.repository';

describe('AppService', () => {
  let appService: AppService;
  let mockPartner: Partner;

  const mockPartnerRepo = {
    createNewPartner: jest.fn(() => Promise.resolve(mockPartner)),
    findOneById: jest.fn(() => Promise.resolve(mockPartner)),
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
      const partnerDto: CreatePartnerDto = pick(mockPartner, [
        'name',
        'pic_email',
        'pic_phone',
      ]);
      const createNewPartnerSpy = jest
        .spyOn(mockPartnerRepo, 'createNewPartner')
        .mockResolvedValue(mockPartner as Partner);

      // act
      const partner = await appService.createPartner(partnerDto);

      // assert
      expect(partner).toEqual(mockPartner);
      expect(createNewPartnerSpy).toHaveBeenCalledTimes(1);
      expect(createNewPartnerSpy).toHaveBeenCalledWith(partnerDto);
    });
  });

  describe('findPartnerById', () => {
    it('should return a partner', async () => {
      // arrange
      const partnerDto = plainToInstance(IdPartnerDto, { id: mockPartner.id });
      const id = partnerDto.id;
      const findOneByIdSpy = jest
        .spyOn(mockPartnerRepo, 'findOneById')
        .mockResolvedValue(mockPartner as Partner);

      // act
      const partner = await appService.findPartnerById(id);

      // assert
      expect(partner).toEqual(mockPartner);
      expect(findOneByIdSpy).toHaveBeenCalledTimes(1);
      expect(findOneByIdSpy).toHaveBeenCalledWith(id);
    });

    it('should throw not found exception', async () => {
      // arrange
      const id = '67746a2b-d693-47e1-99f5-f44572aee309';
      const findOneByIdSpy = jest
        .spyOn(mockPartnerRepo, 'findOneById')
        .mockResolvedValue(null);

      // act
      const findPartnerById = appService.findPartnerById(id);

      // assert
      await expect(findPartnerById).rejects.toEqual(
        new NotFoundException(`Partner with id ${id} doesn't exist`),
      );
      expect(findOneByIdSpy).toHaveBeenCalledTimes(1);
      expect(findOneByIdSpy).toHaveBeenCalledWith(id);
    });
  });

  describe('findPartnerByApiKey', () => {
    it('should return a partner', async () => {
      // arrange
      const apikey = mockPartner.api_key;
      const findOneByApiKeySpy = jest
        .spyOn(mockPartnerRepo, 'findOneByApiKey')
        .mockResolvedValue(mockPartner as Partner);

      // act
      const partner = await appService.findPartnerByApiKey(apikey);

      // assert
      expect(partner).toEqual(mockPartner);
      expect(findOneByApiKeySpy).toHaveBeenCalledTimes(1);
      expect(findOneByApiKeySpy).toHaveBeenCalledWith(apikey);
    });

    it('should throw not found exception', async () => {
      // arrange
      const apikey = 'NotExistApiKey';
      const findOneByApiKeySpy = jest
        .spyOn(mockPartnerRepo, 'findOneByApiKey')
        .mockResolvedValue(null);

      // act
      const findPartnerByApiKey = appService.findPartnerByApiKey(apikey);

      // assert
      await expect(findPartnerByApiKey).rejects.toEqual(
        new NotFoundException(`Partner with API Key ${apikey} doesn't exist`),
      );
      expect(findOneByApiKeySpy).toHaveBeenCalledTimes(1);
      expect(findOneByApiKeySpy).toHaveBeenCalledWith(apikey);
    });
  });
});
