import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AccessControlService } from '../auth/shared/access-control.service';

@Module({
  imports: [PrismaModule],
  providers: [CategoriesService, AccessControlService],
  controllers: [CategoriesController],
  exports: [CategoriesService],
})
export class CategoriesModule {}
