import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Domain } from './domain.entity';

@Entity('ddd_aggregates')
export class Aggregate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, comment: '聚合根名称' })
  name: string;

  @Column({ length: 500, comment: '聚合根描述', nullable: true })
  description: string;

  @Column({ comment: '域ID' })
  domainId: number;

  @ManyToOne(() => Domain)
  @JoinColumn({ name: 'domainId' })
  domain: Domain;

  @Column({ type: 'json', comment: '聚合根配置', nullable: true })
  config: any;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
