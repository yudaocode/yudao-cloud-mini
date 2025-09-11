import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Aggregate } from './aggregate.entity';
import { BoundedContext } from './domain.entity';

/**
 * DDD项目实体
 * 管理DDD元数据驱动开发的项目信息
 */
@Entity('ddd_projects')
export class Project {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'owner_id', type: 'varchar', length: 50 })
  ownerId!: string;

  @Column({ type: 'varchar', length: 20, default: 'ACTIVE' })
  status!: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // 关联关系
  @OneToMany(() => BoundedContext, boundedContext => boundedContext.project)
  boundedContexts!: BoundedContext[];

  @OneToMany(() => Aggregate, aggregate => aggregate.project)
  aggregates!: Aggregate[];
}

/**
 * DDD项目成员实体
 */
@Entity('ddd_project_members')
export class ProjectMember {
  @PrimaryColumn({ name: 'project_id', type: 'varchar', length: 50 })
  projectId!: string;

  @PrimaryColumn({ name: 'user_id', type: 'varchar', length: 50 })
  userId!: string;

  @Column({ type: 'varchar', length: 20 })
  role!: 'OWNER' | 'ADMIN' | 'DEVELOPER' | 'VIEWER';

  @Column({ type: 'jsonb', nullable: true })
  permissions?: Record<string, any>;

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt!: Date;

  // 关联关系
  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project!: Project;
}
