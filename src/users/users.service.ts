import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryUsersDto } from './dtos/query-user.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async getAllUsers(query: QueryUsersDto) {
    const pgNum = +(query.pgNum ?? 1);
    const pgSize = +(query.pgSize ?? 10);
    const skip = (pgNum - 1) * pgSize;
    const take = pgSize;

    const where: Prisma.UserWhereInput = {
      ...(query.name && {
        name: { contains: query.name, mode: 'insensitive' },
      }),
      ...(query.role && { role: query.role }),
    };

    const user = await this.prismaService.user.findMany({
      skip,
      take,
      where,
    });

    const userCount = await this.prismaService.user.count({ where });

    return {
      user,
      meta: {
        count: userCount,
      },
    };
  }

  getUserById(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  getUserByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async createUser(createUserData: Prisma.UserCreateInput) {
    const user = await this.prismaService.user.create({
      data: {
        ...createUserData,
      },
    });

    return user;
  }

  async updateUserById(id: string, updateUserData: Prisma.UserUpdateInput) {
    const user = await this.prismaService.user.update({
      where: {
        id,
      },
      data: updateUserData,
    });

    return {
      statusCode: 200,
      message: 'Successfully update this user data!',
      user,
    };
  }

  async deleteUserById(id: string) {
    await this.prismaService.user.delete({
      where: {
        id,
      },
    });

    return {
      statusCode: 200,
      message: 'Successfully delete the user!',
    };
  }
}
