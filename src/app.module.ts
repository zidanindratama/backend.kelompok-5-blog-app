import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { BlogsModule } from './blogs/blogs.module';
import { CategoriesOnBlogsModule } from './categories-on-blogs/categories-on-blogs.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    CloudinaryModule,
    AuthModule,
    CategoriesModule,
    BlogsModule,
    CategoriesOnBlogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
