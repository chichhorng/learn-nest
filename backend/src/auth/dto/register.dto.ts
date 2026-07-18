import { Role } from '../../common/enums/role.enum';

export class RegisterDto {
  name!: string;
  email!: string;
  password!: string;
  role!: Role;
}
