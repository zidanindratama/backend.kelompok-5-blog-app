import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '../enums/roles.enum';

export class CreateUserDto {
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  password?: string;
}
