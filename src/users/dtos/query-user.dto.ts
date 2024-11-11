import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '../enums/roles.enum';

export class QueryUsersDto {
  @IsString()
  @IsOptional()
  pgNum?: string;

  @IsString()
  @IsOptional()
  pgSize?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsEmail()
  email?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
