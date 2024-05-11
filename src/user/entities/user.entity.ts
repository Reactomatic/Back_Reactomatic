import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    constructor(user?: Partial<User>) {
        this.id = user?.id;
        this.name = user?.name;
        this.email = user?.email;
        this.password = user?.password;
        this.role = user?.role;
    }
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    role: string;
}
