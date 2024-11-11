import { IsOptional, IsString } from 'class-validator';

export class CreateCategoryOnBlogDto {
  @IsString()
  categoryId: string;
}
