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
import { CategoriesOnBlogsService } from './categories-on-blogs.service';
import { CategoriesOnBlogsDto } from './dtos/query-categories-on-blogs.dto';
import { CreateCategoryOnBlogDto } from './dtos/create-category-on-blog.dto';
import { UpdateCategoryOnBlogDto } from './dtos/update-category-on-blog.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enums/roles.enum';

@Controller('/api/protected/categories-on-blogs')
export class CategoriesOnBlogsController {
  constructor(private categoriesOnBlogs: CategoriesOnBlogsService) {}

  @Get('/:blogSlug')
  getAllCategoriesOnBlogsByBlogSlug(
    @Param('blogSlug') blogSlug: string,
    @Query() query: CategoriesOnBlogsDto,
  ) {
    return this.categoriesOnBlogs.getAllCategoriesOnBlogsByBlogSlug(
      blogSlug,
      query,
    );
  }

  @Get('/get/:id')
  async getCategoryOnBlogById(@Param('id') id: string) {
    const categoryOnBlog = this.categoriesOnBlogs.getCategoryOnBlogById(id);

    if (!categoryOnBlog) {
      throw new HttpException(
        'Category relation not found!',
        HttpStatus.NOT_FOUND,
      );
    }

    return categoryOnBlog;
  }

  @Roles(Role.ADMINISTRATOR, Role.BLOGGER)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Post('/:slug')
  addNewCategoryOnBlog(
    @Param('slug') slug: string,
    @Body() body: CreateCategoryOnBlogDto,
  ) {
    return this.categoriesOnBlogs.addNewCategoryOnBlog(slug, body.categoryId);
  }

  @Roles(Role.ADMINISTRATOR, Role.BLOGGER)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Patch('/:id')
  updateCategoryOnBlog(
    @Param('id') id: string,
    @Body() body: UpdateCategoryOnBlogDto,
  ) {
    return this.categoriesOnBlogs.updateCategoryOnBlog(id, body.categoryId);
  }

  @Roles(Role.ADMINISTRATOR, Role.BLOGGER)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Delete('/:id')
  deleteCategoryOnBlog(@Param('id') id: string) {
    return this.categoriesOnBlogs.deleteCategoryOnBlogById(id);
  }
}
