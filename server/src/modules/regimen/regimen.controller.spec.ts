import { Test, TestingModule } from '@nestjs/testing';
import { RegimenController } from './regimen.controller';

describe('RegimenController', () => {
  let controller: RegimenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegimenController],
    }).compile();

    controller = module.get<RegimenController>(RegimenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
