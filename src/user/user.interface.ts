export interface User {
    id: number
    name: string
    email: string
}

export abstract class IUser {
    abstract findUser(id: number): IUser;
}
