import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  firstName: string;
  lastName: string;
  isActive?: boolean;
  email: string;
  picture?: string;
  password: string;
  role: UserRole;
}