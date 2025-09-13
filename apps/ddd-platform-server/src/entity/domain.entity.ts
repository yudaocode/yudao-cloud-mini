import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Project } from './project.entity';

@Entity('ddd_domains')
export class Domain {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, comment: '域名称' })
  name: string;

  @Column({ length: 500, comment: '域描述', nullable: true })
  description: string;

  @Column({ comment: '项目ID' })
  projectId: number;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column({ type: 'json', comment: '域配置', nullable: true })
  config: any;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
