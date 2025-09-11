import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Project } from './project.entity';

/**
 * DDD屏幕定义实体
 */
@Entity('ddd_screens')
export class Screen {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id!: string;

  @Column({ name: 'project_id', type: 'varchar', length: 50 })
  projectId!: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 20 })
  type!: 'LIST' | 'FORM' | 'DETAIL' | 'DASHBOARD';

  @Column({ name: 'source_aggregate_id', type: 'varchar', length: 50, nullable: true })
  sourceAggregateId?: string;

  @Column({ name: 'amis_schema', type: 'jsonb' })
  amisSchema!: Record<string, any>;

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
}

/**
 * 屏幕模板实体
 */
@Entity('ddd_screen_templates')
export class ScreenTemplate {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 20 })
  type!: 'LIST' | 'FORM' | 'DETAIL' | 'DASHBOARD';

  @Column({ name: 'template_content', type: 'jsonb' })
  templateContent!: Record<string, any>;

  @Column({ name: 'is_system', type: 'boolean', default: false })
  isSystem!: boolean;

  @Column({ name: 'created_by', type: 'varchar', length: 50, nullable: true })
  createdBy?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
