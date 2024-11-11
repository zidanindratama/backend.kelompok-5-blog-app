import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryBlogDto } from './dtos/query-blog.dto';
import { Prisma } from '@prisma/client';

const slugify = (title: string) => {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .trim();
};

@Injectable()
export class BlogsService {
  constructor(private prismaService: PrismaService) {}

  async getAllBlogs(query: QueryBlogDto) {
    const isPaginated = query.isPaginated === 'false' ? false : true;

    const pgNum = isPaginated ? +(query.pgNum ?? 1) : undefined;
    const pgSize = isPaginated ? +(query.pgSize ?? 10) : undefined;
    const skip = isPaginated ? (pgNum - 1) * pgSize : undefined;
    const take = isPaginated ? pgSize : undefined;

    const where: Prisma.BlogWhereInput = {
      ...(query.title && {
        title: { contains: query.title, mode: 'insensitive' },
      }),
      ...(query.category && {
        categories: {
          some: {
            category: {
              name: { contains: query.category, mode: 'insensitive' },
            },
          },
        },
      }),
      ...(query.author && {
        author: {
          name: { contains: query.author, mode: 'insensitive' },
        },
      }),
    };

    const blogs = await this.prismaService.blog.findMany({
      skip,
      take,
      where,
      include: {
        author: true,
        categories: {
          include: {
            category: {
              select: {
                name: true,
                slug: true,
                id: true,
              },
            },
          },
        },
      },
    });

    const blogsCount = await this.prismaService.blog.count({ where });

    return {
      blogs,
      meta: {
        count: blogsCount,
      },
    };
  }

  getBlogBySlug(slug: string) {
    return this.prismaService.blog.findUnique({
      where: {
        slug,
      },
      include: {
        author: true,
        categories: true,
      },
    });
  }

  async createBlog(createBlogData: Prisma.BlogUncheckedCreateInput) {
    const slug = slugify(createBlogData.title);

    return this.prismaService.blog.create({
      data: {
        ...createBlogData,
        slug,
      },
    });
  }

  async updateBlogBySlug(
    slug: string,
    slugUpdate: string,
    updateBlogData: Prisma.BlogUncheckedUpdateInput,
  ) {
    return this.prismaService.blog.update({
      where: {
        slug,
      },
      data: {
        ...updateBlogData,
        slug: slugUpdate,
      },
    });
  }

  async deleteBlogBySlug(slug: string) {
    await this.prismaService.blog.delete({
      where: {
        slug,
      },
    });

    return {
      message: 'Successfully delete the blog!',
      statusCode: 200,
    };
  }
}
