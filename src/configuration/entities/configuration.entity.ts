import { Component } from 'src/component/entities/component.entity';
import { Entity, Column, ManyToMany, PrimaryGeneratedColumn, JoinTable } from 'typeorm';

@Entity()
export class Configuration {
    constructor(configuration?: Partial<Configuration>) {
        this.id = configuration?.id;
        this.name = configuration?.name;
        this.price = configuration?.price;
        this.user_id = configuration?.user_id;
        this.processors = configuration?.processors;
        this.motherboards = configuration?.motherboards;
        this.gpus = configuration?.gpus;
        this.ventirads = configuration?.ventirads;
        this.memorys = configuration?.memorys;
        this.storages = configuration?.storages;
        this.externaldevices = configuration?.externaldevices;
        this.cases = configuration?.cases;
        this.powersupplys = configuration?.powersupplys;
    }
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    price: number;

    @Column({
        nullable: true
    })
    user_id: number;

    @ManyToMany(() => Component)
    @JoinTable()
    processors: Component[];

    @ManyToMany(() => Component)
    @JoinTable()
    motherboards: Component[];

    @ManyToMany(() => Component)
    @JoinTable()
    gpus: Component[];

    @ManyToMany(() => Component)
    @JoinTable()
    ventirads: Component[];

    @ManyToMany(() => Component)
    @JoinTable()
    memorys: Component[];

    @ManyToMany(() => Component)
    @JoinTable()
    storages: Component[];

    @ManyToMany(() => Component)
    @JoinTable()
    externaldevices: Component[];

    @ManyToMany(() => Component)
    @JoinTable()
    cases: Component[];

    @ManyToMany(() => Component)
    @JoinTable()
    powersupplys: Component[];
}
