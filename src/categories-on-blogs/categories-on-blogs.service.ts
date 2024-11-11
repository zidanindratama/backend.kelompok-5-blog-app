import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CategoriesOnBlogsDto } from './dtos/query-categories-on-blogs.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesOnBlogsService {
  constructor(private prismaService: PrismaService) {}

  async getAllCategoriesOnBlogsByBlogSlug(
    blogSlug: string,
    query: CategoriesOnBlogsDto,
  ) {
    const pgNum = +(query.pgNum ?? 1);
    const pgSize = +(query.pgSize ?? 10);
    const skip = (pgNum - 1) * pgSize;
    const take = pgSize;

    const where: Prisma.CategoriesOnBlogsWhereInput = {
      blog: {
        slug: { contains: blogSlug, mode: 'insensitive' },
      },
    };

    const categoriesOnBlogs =
      await this.prismaService.categoriesOnBlogs.findMany({
        skip,
        take,
        where,
        include: {
          blog: true,
          category: true,
        },
      });

    const categoriesOnBlogsCount =
      await this.prismaService.categoriesOnBlogs.count({
        where,
      });

    return {
      blogCategories: categoriesOnBlogs,
      meta: {
        count: categoriesOnBlogsCount,
      },
    };
  }

  async addNewCategoryOnBlog(blogSlug: string, categoryId: string) {
    const existingBlog = await this.prismaService.blog.findUnique({
      where: {
        slug: blogSlug,
      },
    });

    if (!existingBlog) {
      throw new HttpException('Blog not found!', HttpStatus.BAD_REQUEST);
    }

    const existingCategory = await this.prismaService.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!existingCategory) {
      throw new HttpException('Category not found!', HttpStatus.BAD_REQUEST);
    }

    const existingCategoriesOnBlogs =
      await this.prismaService.categoriesOnBlogs.findMany({
        where: {
          blogId: existingBlog.id,
          categoryId: categoryId,
        },
      });

    if (existingCategoriesOnBlogs.length > 0) {
      throw new HttpException(
        'Category already exists for this blog.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newCategoryOnBlog = await this.prismaService.categoriesOnBlogs.create(
      {
        data: {
          blog: {
            connect: { id: existingBlog.id },
          },
          category: {
            connect: { id: categoryId },
          },
        },
      },
    );

    return newCategoryOnBlog;
  }

  getCategoryOnBlogById(id: string) {
    return this.prismaService.categoriesOnBlogs.findUnique({
      where: { id },
      include: {
        blog: true,
        category: true,
      },
    });
  }

  async updateCategoryOnBlog(categoryOnBlogId: string, newCategoryId: string) {
    const existingCategoryOnBlog =
      await this.prismaService.categoriesOnBlogs.findUnique({
        where: { id: categoryOnBlogId },
      });

    if (!existingCategoryOnBlog) {
      throw new HttpException(
        'Category relation not found!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newCategory = await this.prismaService.category.findUnique({
      where: { id: newCategoryId },
    });

    if (!newCategory) {
      throw new HttpException(
        'New category not found!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingRelation =
      await this.prismaService.categoriesOnBlogs.findFirst({
        where: {
          blogId: existingCategoryOnBlog.blogId,
          categoryId: newCategoryId,
        },
      });

    if (existingRelation) {
      throw new HttpException(
        'This category is already associated with the blog!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedCategoryOnBlog =
      await this.prismaService.categoriesOnBlogs.update({
        where: { id: categoryOnBlogId },
        data: {
          categoryId: newCategoryId,
        },
      });

    return updatedCategoryOnBlog;
  }

  async deleteCategoryOnBlogById(id: string) {
    const existingCategoryOnBlog =
      await this.prismaService.categoriesOnBlogs.findUnique({
        where: { id },
      });

    if (!existingCategoryOnBlog) {
      throw new HttpException(
        'Category relation not found!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const deletedCategoryOnBlog =
      await this.prismaService.categoriesOnBlogs.delete({
        where: { id },
      });

    return {
      message: 'Successfully delete the blog category!',
      statusCode: 200,
    };
  }
}
