import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesOnBlogsController } from './categories-on-blogs.controller';

describe('CategoriesOnBlogsController', () => {
  let controller: CategoriesOnBlogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesOnBlogsController],
    }).compile();

    controller = module.get<CategoriesOnBlogsController>(CategoriesOnBlogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
