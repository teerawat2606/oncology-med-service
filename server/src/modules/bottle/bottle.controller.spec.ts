import { Test, TestingModule } from '@nestjs/testing';
import { BottleController } from './bottle.controller';

describe('BottleController', () => {
  let controller: BottleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BottleController],
    }).compile();

    controller = module.get<BottleController>(BottleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
