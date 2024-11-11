import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Role } from './enums/roles.enum';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { QueryUsersDto } from './dtos/query-user.dto';

@UseGuards(AccessTokenGuard)
@Controller('/api/protected/users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  getAllUsers(@Query() query: QueryUsersDto) {
    return this.usersService.getAllUsers(query);
  }

  @Get('/me')
  getMyProfile(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    // @ts-ignore
    const userId = request.user.sub;
    return this.usersService.getUserById(userId);
  }

  @Get('/:id')
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.getUserById(id);
    if (!user) throw new HttpException('User not found!', 404);
    return user;
  }

  @Roles(Role.MEMBER, Role.BLOGGER, Role.ADMINISTRATOR)
  @UseGuards(RoleGuard)
  @Patch('/:id')
  @UseInterceptors(FileInterceptor('photo'))
  async updateProfileById(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    try {
      if (photo) {
        const uploadedImage = await this.cloudinaryService.uploadFile(
          photo,
          true,
        );
        body.image = uploadedImage.secure_url;
      }
      const user = await this.usersService.getUserById(id);
      if (!user) return new HttpException('User not found!', 404);
      return this.usersService.updateUserById(id, body);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Roles(Role.ADMINISTRATOR)
  @UseGuards(RoleGuard)
  @Delete('/:id')
  async deleteUserById(@Param('id') id: string) {
    const user = await this.usersService.getUserById(id);
    if (!user) return new HttpException('User not found!', 404);
    return this.usersService.deleteUserById(id);
  }
}
