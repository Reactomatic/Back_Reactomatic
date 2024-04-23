import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Component {
  constructor(component?: Partial<Component>) {
    this.id = component?.id;
    this.name = component?.name;
    this.price = component?.price;
    this.brand = component?.brand;
    this.type = component?.type;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  type: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  brand: string;

  @Column("simple-array", { default: [] })
  metadata: string[];
}