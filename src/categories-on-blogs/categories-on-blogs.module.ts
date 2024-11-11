import { Module } from '@nestjs/common';
import { CategoriesOnBlogsService } from './categories-on-blogs.service';
import { CategoriesOnBlogsController } from './categories-on-blogs.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AccessControlService } from '../auth/shared/access-control.service';

@Module({
  imports: [PrismaModule],
  providers: [CategoriesOnBlogsService, AccessControlService],
  controllers: [CategoriesOnBlogsController],
  exports: [CategoriesOnBlogsService],
})
export class CategoriesOnBlogsModule {}
