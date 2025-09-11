import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { DDDEntity } from './entity.entity';
import { Project } from './project.entity';

/**
 * DDD实体属性
 */
@Entity('ddd_attributes')
export class DDDAttribute {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id!: string;

  @Column({ name: 'project_id', type: 'varchar', length: 50 })
  projectId!: string;

  @Column({ name: 'entity_id', type: 'varchar', length: 50 })
  entityId!: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'data_type', type: 'varchar', length: 50 })
  dataType!: string;

  @Column({ type: 'jsonb', nullable: true })
  constraints?: Record<string, any>;

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

  @ManyToOne(() => DDDEntity)
  @JoinColumn({ name: 'entity_id' })
  entity!: DDDEntity;
}
