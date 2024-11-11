import { IsOptional, IsString } from 'class-validator';

export class CategoriesOnBlogsDto {
  @IsString()
  @IsOptional()
  pgNum?: string;

  @IsString()
  @IsOptional()
  pgSize?: string;
}
