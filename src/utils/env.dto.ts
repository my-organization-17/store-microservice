import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUrl } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  readonly NODE_ENV: string;

  @IsString()
  @IsNotEmpty()
  readonly TRANSPORT_URL: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  readonly HTTP_PORT: number;

  @IsUrl(
    { protocols: ['mysql'], require_tld: false, require_protocol: true },
    { message: 'DATABASE_URL must be a valid MySQL URL' },
  )
  @IsNotEmpty()
  readonly DATABASE_URL: string;
}
