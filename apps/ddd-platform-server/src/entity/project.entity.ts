import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('ddd_projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, comment: '项目名称' })
  name: string;

  @Column({ length: 500, comment: '项目描述', nullable: true })
  description: string;

  @Column({ length: 50, comment: '项目状态', default: 'active' })
  status: string;

  @Column({ length: 100, comment: '创建者' })
  creator: string;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
