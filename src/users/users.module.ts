import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { AccessControlService } from '../auth/shared/access-control.service';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  providers: [UsersService, AccessControlService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
