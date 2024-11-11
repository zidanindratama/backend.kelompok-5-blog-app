import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesOnBlogsService } from './categories-on-blogs.service';

describe('CategoriesOnBlogsService', () => {
  let service: CategoriesOnBlogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesOnBlogsService],
    }).compile();

    service = module.get<CategoriesOnBlogsService>(CategoriesOnBlogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
