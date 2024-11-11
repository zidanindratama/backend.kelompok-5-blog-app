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
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { QueryCategoriesDto } from './dtos/query-categories.dto';
import { CategoryDto } from './dtos/category.dto';
import { PrismaService } from '../prisma/prisma.service';
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

@Controller('/api/protected/categories')
export class CategoriesController {
  constructor(
    private categoriesService: CategoriesService,
    private prismaService: PrismaService,
  ) {}

  @Get()
  getAllCategories(@Query() query: QueryCategoriesDto) {
    return this.categoriesService.getAllCategories(query);
  }

  @Get('/:slug')
  async getCategoryBySlug(@Param('slug') slug: string) {
    const category = await this.categoriesService.getCategoryBySlug(slug);
    if (!category) throw new HttpException('Category not found!', 404);
    return category;
  }

  @Roles(Role.ADMINISTRATOR)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Post()
  createCategory(@Body() body: CategoryDto) {
    try {
      return this.categoriesService.createCategory(body);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update category',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Roles(Role.ADMINISTRATOR)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Patch('/:slug')
  async updateCategoryBySlug(
    @Param('slug') slug: string,
    @Body() body: CategoryDto,
  ) {
    try {
      const category = await this.prismaService.category.findUnique({
        where: {
          slug: slug,
        },
      });
      if (!category) throw new HttpException('Category not found!', 404);
      const slugUpdate = slugify(body.name);
      return this.categoriesService.updateCategoryBySlug(
        slug,
        slugUpdate,
        body,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update category',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Roles(Role.ADMINISTRATOR)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Delete('/:slug')
  async deleteCategoryBySlug(@Param('slug') slug: string) {
    const category = await this.prismaService.category.findUnique({
      where: {
        slug: slug,
      },
    });
    if (!category) throw new HttpException('Category not found!', 404);
    return this.categoriesService.deleteCategoryBySlug(slug);
  }
}
