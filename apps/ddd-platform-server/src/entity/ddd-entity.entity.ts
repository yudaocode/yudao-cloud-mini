import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Aggregate } from './aggregate.entity';

@Entity('ddd_entities')
export class DddEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, comment: '实体名称' })
  name: string;

  @Column({ length: 500, comment: '实体描述', nullable: true })
  description: string;

  @Column({ length: 50, comment: '实体类型', default: 'entity' })
  type: string; // entity, value_object

  @Column({ comment: '聚合根ID' })
  aggregateId: number;

  @ManyToOne(() => Aggregate)
  @JoinColumn({ name: 'aggregateId' })
  aggregate: Aggregate;

  @Column({ type: 'json', comment: '实体属性定义', nullable: true })
  properties: any;

  @Column({ type: 'json', comment: '实体配置', nullable: true })
  config: any;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
