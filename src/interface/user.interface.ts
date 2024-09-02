import { UserRole } from "../users/entities/user.entity";

export interface IUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  }