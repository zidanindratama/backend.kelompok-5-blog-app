import { IsOptional, IsString } from 'class-validator';

export class QueryBlogDto {
  @IsString()
  @IsOptional()
  pgNum?: string;

  @IsString()
  @IsOptional()
  pgSize?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  isPaginated?: string;

  @IsString()
  @IsOptional()
  author?: string;
}
