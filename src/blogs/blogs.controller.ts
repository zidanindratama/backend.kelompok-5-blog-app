import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogsService } from './blogs.service';
import { PrismaService } from '../prisma/prisma.service';
import { QueryBlogDto } from './dtos/query-blog.dto';
import { CreateBlogDto } from './dtos/create-blog.dto';
import { UpdateBlogDto } from './dtos/update-blog.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enums/roles.enum';

const slugify = (title: string) => {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .trim();
};

@Controller('/api/protected/blogs')
export class BlogsController {
  constructor(
    private blogService: BlogsService,
    private prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  getAllBlogs(@Query() query: QueryBlogDto) {
    return this.blogService.getAllBlogs(query);
  }

  @Get('/:slug')
  async getBlogBySlug(@Param('slug') slug: string) {
    const blog = await this.blogService.getBlogBySlug(slug);
    if (!blog) throw new HttpException('Blog not found!', 404);
    return blog;
  }

  @Roles(Role.ADMINISTRATOR, Role.BLOGGER)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createBlog(
    @Body() body: CreateBlogDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    try {
      const slug = slugify(body.title);
      const blog = await this.blogService.getBlogBySlug(slug);
      if (blog)
        throw new HttpException('Blog already exist!', HttpStatus.BAD_REQUEST);

      if (image) {
        const uploadedImage = await this.cloudinaryService.uploadFile(
          image,
          true,
        );
        body.image = uploadedImage.secure_url;
      }

      return this.blogService.createBlog(body);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create blog',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Roles(Role.ADMINISTRATOR, Role.BLOGGER)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Patch('/:slug')
  @UseInterceptors(FileInterceptor('image'))
  async updateBlog(
    @Param('slug') slug: string,
    @Body() body: UpdateBlogDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    try {
      const blog = await this.blogService.getBlogBySlug(slug);
      if (!blog) throw new HttpException('Blog not found!', 404);

      if (image) {
        const uploadedImage = await this.cloudinaryService.uploadFile(
          image,
          true,
        );
        body.image = uploadedImage.secure_url;
      }

      const slugUpdate = slugify(body.title);
      return this.blogService.updateBlogBySlug(slug, slugUpdate, body);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update blog',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Roles(Role.ADMINISTRATOR, Role.BLOGGER)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Delete('/:slug')
  async deleteBlogBySlug(@Param('slug') slug: string) {
    const blog = await this.prismaService.blog.findUnique({
      where: {
        slug: slug,
      },
    });
    if (!blog) throw new HttpException('Blog not found!', 404);
    return this.blogService.deleteBlogBySlug(slug);
  }
}
