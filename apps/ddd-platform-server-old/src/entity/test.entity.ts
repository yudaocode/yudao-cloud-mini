import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('test_entities')
export class TestEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 200, comment: '名称' })
  name!: string;

  @Column({ type: 'text', nullable: true, comment: '描述' })
  description?: string;

  @Column({ length: 50, default: 'TEST', comment: '类型' })
  type!: string;

  @Column({ type: 'json', nullable: true, comment: '元数据' })
  metadata?: any;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt!: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt!: Date;
}
