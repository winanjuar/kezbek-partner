import { Test, TestingModule } from '@nestjs/testing';
import { Partner } from 'src/entity/partner.entity';
import { DataSource } from 'typeorm';
import { PartnerRepository } from './partner.repository';
import { pick } from 'lodash';

describe('PartnerRepository', () => {
  let partnerRepository: PartnerRepository;
  let mockPartner: Partner;

  const dataSource = {
    createEntityManager: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartnerRepository,
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    partnerRepository = module.get<PartnerRepository>(PartnerRepository);
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
    it('should return new partner', async () => {
      // arrange
      const partnerDto = pick(mockPartner, ['name', 'pic_email', 'pic_phone']);

      const saveOnSpy = jest
        .spyOn(partnerRepository, 'save')
        .mockResolvedValue(mockPartner as Partner);

      // act
      const newPartner = await partnerRepository.createNewPartner(partnerDto);

      // assert
      expect(newPartner).toEqual(mockPartner);
      expect(saveOnSpy).toBeCalled();
    });
  });

  describe('findOneById', () => {
    it('should return found partner', async () => {
      // arrange
      const id = mockPartner.id;

      const findOneSpy = jest
        .spyOn(partnerRepository, 'findOne')
        .mockResolvedValue(mockPartner as Partner);

      // act
      const foundPartner = await partnerRepository.findOneById(id);

      // assert
      expect(foundPartner).toEqual(mockPartner);
      expect(findOneSpy).toHaveBeenCalledWith({ where: { id } });
    });
  });

  describe('findOneByApiKey', () => {
    it('should return found partner', async () => {
      // arrange
      const api_key = mockPartner.api_key;
      const findOneSpy = jest
        .spyOn(partnerRepository, 'findOne')
        .mockResolvedValue(mockPartner as Partner);

      // act
      const foundPartner = await partnerRepository.findOneByApiKey(api_key);

      // assert
      expect(foundPartner).toEqual(mockPartner);
      expect(findOneSpy).toHaveBeenCalledWith({ where: { api_key } });
    });
  });
});
