import {
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateBlogDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  shortDescription: string;

  @IsString()
  authorId: string;

  @IsOptional()
  @IsUrl()
  image?: string;
}
