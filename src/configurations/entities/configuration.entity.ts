import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinTable, ManyToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';

import { Component } from '../../components/entities/component.entity';

@Entity()
export class Configuration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => User, user => user.configurations, { eager: true })
  user: User;

  @ManyToMany(() => Component, { eager: true })
  @JoinTable()
  components: Component[];
}