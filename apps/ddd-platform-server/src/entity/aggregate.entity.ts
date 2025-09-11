import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { BoundedContext } from './domain.entity';
import { DDDEntity } from './entity.entity';
import { Project } from './project.entity';

/**
 * DDD聚合实体
 */
@Entity('ddd_aggregates')
export class Aggregate {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id!: string;

  @Column({ name: 'project_id', type: 'varchar', length: 50 })
  projectId!: string;

  @Column({ name: 'bounded_context_id', type: 'varchar', length: 50 })
  boundedContextId!: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'root_entity_id', type: 'varchar', length: 50, nullable: true })
  rootEntityId?: string;

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

  @ManyToOne(() => BoundedContext)
  @JoinColumn({ name: 'bounded_context_id' })
  boundedContext!: BoundedContext;

  @OneToMany(() => DDDEntity, entity => entity.aggregate)
  entities!: DDDEntity[];

  @ManyToOne(() => DDDEntity, { nullable: true })
  @JoinColumn({ name: 'root_entity_id' })
  rootEntity?: DDDEntity;
}
