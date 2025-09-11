import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Aggregate } from './aggregate.entity';
import { Project } from './project.entity';

/**
 * DDD领域实体
 */
@Entity('ddd_domains')
export class Domain {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id!: string;

  @Column({ name: 'project_id', type: 'varchar', length: 50 })
  projectId!: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 20 })
  type!: 'CORE' | 'SUPPORTING' | 'GENERIC';

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

  @OneToMany(() => BoundedContext, boundedContext => boundedContext.domain)
  boundedContexts!: BoundedContext[];
}

/**
 * DDD限界上下文实体
 */
@Entity('ddd_bounded_contexts')
export class BoundedContext {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id!: string;

  @Column({ name: 'project_id', type: 'varchar', length: 50 })
  projectId!: string;

  @Column({ name: 'domain_id', type: 'varchar', length: 50 })
  domainId!: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

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

  @ManyToOne(() => Domain)
  @JoinColumn({ name: 'domain_id' })
  domain!: Domain;

  @OneToMany(() => Aggregate, aggregate => aggregate.boundedContext)
  aggregates!: Aggregate[];
}
