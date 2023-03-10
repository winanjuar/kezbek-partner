import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { pick } from 'lodash';
import { Partner } from 'src/entity/partner.entity';
import { faker } from '@faker-js/faker';
import { PartnerRepository } from './partner.repository';

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

  describe('createNewPartner', () => {
    it('should return new partner', async () => {
      // arrange
      const partner = pick(mockPartner, [
        'name',
        'api_key',
        'api_secret',
        'pic_email',
        'pic_phone',
      ]) as Partner;

      const spySave = jest
        .spyOn(partnerRepository, 'save')
        .mockResolvedValue(mockPartner);

      // act
      const newPartner = await partnerRepository.createNewPartner(partner);

      // assert
      expect(newPartner.id).toBeDefined();
      expect(newPartner.api_key).toBeDefined();
      expect(newPartner.api_secret).toBeDefined();
      expect(spySave).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneById', () => {
    it('should return found partner', async () => {
      // arrange
      const id = mockPartner.id;

      const spyFineOne = jest
        .spyOn(partnerRepository, 'findOne')
        .mockResolvedValue(mockPartner);

      // act
      const foundPartner = await partnerRepository.findOneByIdPartner(id);

      // assert
      expect(foundPartner).toEqual(mockPartner);
      expect(spyFineOne).toHaveBeenCalledTimes(1);
      expect(spyFineOne).toHaveBeenCalledWith({ where: { id } });
    });
  });

  describe('findOneByApiKey', () => {
    it('should return found partner', async () => {
      // arrange
      const api_key = mockPartner.api_key;
      const spyFindOne = jest
        .spyOn(partnerRepository, 'findOne')
        .mockResolvedValue(mockPartner);

      // act
      const foundPartner = await partnerRepository.findOneByApiKey(api_key);

      // assert
      expect(foundPartner).toEqual(mockPartner);
      expect(spyFindOne).toHaveBeenCalledTimes(1);
      expect(spyFindOne).toHaveBeenCalledWith({ where: { api_key } });
    });
  });
});
