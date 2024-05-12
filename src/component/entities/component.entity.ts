import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import {ComponentType} from "../../enum/ComponentType";

@Entity()
export class Component {
  constructor(component?: Partial<Component>) {
    this.id = component?.id;
    this.name = component?.name;
    this.price = component?.price;
    this.brand = component?.brand;
    this.type = component?.type;
    this.metadata = component?.metadata;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  type: ComponentType;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  brand: string;

  @Column('jsonb', {nullable: true})
  metadata: {key: string, value: any}[];
}
