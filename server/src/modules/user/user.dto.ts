import { UserRole } from 'src/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CredentialDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
  id: number;
}

export class SignUpDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  role: UserRole;

  @ApiProperty()
  employeeId: string;

  @ApiPropertyOptional()
  lineId?: string;

  @ApiPropertyOptional()
  department?: string;

  @ApiPropertyOptional()
  hospital?: string;
}

export class UserInfo {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  role: UserRole;

  @ApiProperty()
  employeeId: string;

  @ApiProperty()
  department: string;

  @ApiProperty()
  hospital: string;

  @ApiPropertyOptional()
  lineId?: string;
}

export class UserInfoWithUsername extends UserInfo {
  @ApiProperty()
  username: string;
}
