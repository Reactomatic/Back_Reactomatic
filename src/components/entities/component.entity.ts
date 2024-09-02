import { ComponentType } from "src/enum/componentsType";
import { PrimaryGeneratedColumn, Index, Column, Entity } from "typeorm";


@Entity()
export class Component {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  brand: string;

  @Column()
  category: ComponentType;

  @Column({ nullable: true, type: 'json' })
  metadata?: { key: string; value: any }[];

  @Column({ nullable: true, type: 'json' })
  priceByRetailer?: { retailer: string; price: number; url: string }[];
}
