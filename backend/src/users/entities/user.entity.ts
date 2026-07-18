import { Role } from '../../common/enums/role.enum';

export class User {
  id!: number;
  name!: string;
  email!: string;
  password!: string;
  role!: Role;
  avatar?: string;
  bio?: string;
  createdAt!: Date;
}
