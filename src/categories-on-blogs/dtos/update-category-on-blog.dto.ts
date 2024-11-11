import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryOnBlogDto {
  @IsString()
  @IsOptional()
  categoryId?: string;
}
