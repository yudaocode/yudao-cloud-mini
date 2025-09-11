import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Aggregate } from './aggregate.entity';
import { DDDAttribute } from './attribute.entity';
import { Project } from './project.entity';

/**
 * DDD实体
 */
@Entity('ddd_entities')
export class DDDEntity {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id!: string;

  @Column({ name: 'project_id', type: 'varchar', length: 50 })
  projectId!: string;

  @Column({ name: 'aggregate_id', type: 'varchar', length: 50, nullable: true })
  aggregateId?: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 20 })
  type!: 'ENTITY' | 'VALUE_OBJECT' | 'DOMAIN_SERVICE';

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // 关联关系
  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project!: Project;

  @ManyToOne(() => Aggregate, { nullable: true })
  @JoinColumn({ name: 'aggregate_id' })
  aggregate?: Aggregate;

  @OneToMany(() => DDDAttribute, attribute => attribute.entity)
  attributes!: DDDAttribute[];
}
