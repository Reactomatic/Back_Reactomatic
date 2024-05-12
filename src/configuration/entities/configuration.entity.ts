import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Configuration {
    constructor(configuration?: Partial<Configuration>) {
        this.id = configuration?.id;
        this.name = configuration?.name;
        this.price = configuration?.price;
        this.user_id = configuration?.user_id;
        this.processor_id = configuration?.processor_id;
        this.motherboard_id = configuration?.motherboard_id;
        this.gpu_id = configuration?.gpu_id;
        this.ventirad_id = configuration?.ventirad_id;
        this.memory_id = configuration?.memory_id;
        this.storage_id = configuration?.storage_id;
        this.externaldevice_id = configuration?.externaldevice_id;
        this.case_id = configuration?.case_id;
        this.powersupply_id = configuration?.powersupply_id;
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

    @Column({
        nullable: true
    })
    processor_id: number;

    @Column({
        nullable: true
    })
    motherboard_id: number;

    @Column({
        nullable: true
    })
    gpu_id: number;

    @Column({
        nullable: true
    })
    ventirad_id: number;

    @Column({
        nullable: true
    })
    memory_id: number;

    @Column({
        nullable: true
    })
    storage_id: number;

    @Column({
        nullable: true
    })
    externaldevice_id: number;

    @Column({
        nullable: true
    })
    case_id: number;

    @Column({
        nullable: true
    })
    powersupply_id: number;
}
