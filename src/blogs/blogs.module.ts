import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AccessControlService } from '../auth/shared/access-control.service';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  providers: [BlogsService, AccessControlService],
  controllers: [BlogsController],
  exports: [BlogsService],
})
export class BlogsModule {}
