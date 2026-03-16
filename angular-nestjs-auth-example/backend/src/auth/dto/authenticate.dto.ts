import { IsString, IsNotEmpty } from 'class-validator';

export class AuthenticateDto {
  @IsString()
  @IsNotEmpty()
  uid!: string;
}
