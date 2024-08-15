import { UserRole } from "../entities/user.entity";

export interface IUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  }