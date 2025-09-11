import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Aggregate } from '../entity/aggregate.entity';
import { DDDAttribute } from '../entity/attribute.entity';
import { DDDEntity } from '../entity/entity.entity';

export interface CreateAggregateDTO {
  projectId: string;
  boundedContextId: string;
  name: string;
  description?: string;
  rootEntity?: CreateEntityDTO;
}

export interface CreateEntityDTO {
  name: string;
  description?: string;
  type: 'ENTITY' | 'VALUE_OBJECT' | 'DOMAIN_SERVICE';
  attributes?: CreateAttributeDTO[];
}

export interface CreateAttributeDTO {
  name: string;
  description?: string;
  dataType: string;
  constraints?: Record<string, any>;
}

export interface UpdateAggregateDTO {
  name?: string;
  description?: string;
  rootEntityId?: string;
}

@Provide()
export class DDDService {
  @InjectEntityModel(Aggregate)
  aggregateRepository!: Repository<Aggregate>;

  @InjectEntityModel(DDDEntity)
  entityRepository!: Repository<DDDEntity>;

  @InjectEntityModel(DDDAttribute)
  attributeRepository!: Repository<DDDAttribute>;

  /**
   * 创建聚合
   */
  async createAggregate(createAggregateDTO: CreateAggregateDTO): Promise<Aggregate> {
    const aggregate = new Aggregate();
    aggregate.id = `agg_${uuidv4().replace(/-/g, '')}`;
    aggregate.projectId = createAggregateDTO.projectId;
    aggregate.boundedContextId = createAggregateDTO.boundedContextId;
    aggregate.name = createAggregateDTO.name;
    aggregate.description = createAggregateDTO.description;
    aggregate.metadata = {
      version: '1.0.0',
      businessRules: [],
      invariants: []
    };

    // 保存聚合
    const savedAggregate = await this.aggregateRepository.save(aggregate);

    // 如果有根实体，创建根实体
    if (createAggregateDTO.rootEntity) {
      const rootEntity = await this.createEntity({
        ...createAggregateDTO.rootEntity,
        projectId: createAggregateDTO.projectId,
        aggregateId: savedAggregate.id
      });

      // 更新聚合的根实体ID
      savedAggregate.rootEntityId = rootEntity.id;
      await this.aggregateRepository.save(savedAggregate);
    }

    return savedAggregate;
  }

  /**
   * 创建实体
   */
  async createEntity(createEntityDTO: CreateEntityDTO & { projectId: string; aggregateId?: string }): Promise<DDDEntity> {
    const entity = new DDDEntity();
    entity.id = `entity_${uuidv4().replace(/-/g, '')}`;
    entity.projectId = createEntityDTO.projectId;
    entity.aggregateId = createEntityDTO.aggregateId;
    entity.name = createEntityDTO.name;
    entity.description = createEntityDTO.description;
    entity.type = createEntityDTO.type;
    entity.metadata = {
      version: '1.0.0',
      businessRules: [],
      validationRules: []
    };

    // 保存实体
    const savedEntity = await this.entityRepository.save(entity);

    // 如果有属性，创建属性
    if (createEntityDTO.attributes && createEntityDTO.attributes.length > 0) {
      for (const attrDTO of createEntityDTO.attributes) {
        await this.createAttribute({
          ...attrDTO,
          projectId: createEntityDTO.projectId,
          entityId: savedEntity.id
        });
      }
    }

    return savedEntity;
  }

  /**
   * 创建属性
   */
  async createAttribute(createAttributeDTO: CreateAttributeDTO & { projectId: string; entityId: string }): Promise<DDDAttribute> {
    const attribute = new DDDAttribute();
    attribute.id = `attr_${uuidv4().replace(/-/g, '')}`;
    attribute.projectId = createAttributeDTO.projectId;
    attribute.entityId = createAttributeDTO.entityId;
    attribute.name = createAttributeDTO.name;
    attribute.description = createAttributeDTO.description;
    attribute.dataType = createAttributeDTO.dataType;
    attribute.constraints = createAttributeDTO.constraints || {};
    attribute.metadata = {
      version: '1.0.0',
      businessMeaning: createAttributeDTO.description,
      validationRules: []
    };

    return await this.attributeRepository.save(attribute);
  }

  /**
   * 获取聚合列表
   */
  async getAggregates(projectId: string): Promise<Aggregate[]> {
    return await this.aggregateRepository.find({
      where: { projectId },
      relations: ['entities', 'rootEntity', 'boundedContext'],
      order: { updatedAt: 'DESC' }
    });
  }

  /**
   * 获取聚合详情
   */
  async getAggregateById(aggregateId: string): Promise<Aggregate | null> {
    return await this.aggregateRepository.findOne({
      where: { id: aggregateId },
      relations: ['entities', 'entities.attributes', 'rootEntity', 'boundedContext']
    });
  }

  /**
   * 更新聚合
   */
  async updateAggregate(aggregateId: string, updateAggregateDTO: UpdateAggregateDTO): Promise<Aggregate | null> {
    const aggregate = await this.aggregateRepository.findOne({
      where: { id: aggregateId }
    });

    if (!aggregate) {
      return null;
    }

    if (updateAggregateDTO.name) {
      aggregate.name = updateAggregateDTO.name;
    }

    if (updateAggregateDTO.description !== undefined) {
      aggregate.description = updateAggregateDTO.description;
    }

    if (updateAggregateDTO.rootEntityId) {
      aggregate.rootEntityId = updateAggregateDTO.rootEntityId;
    }

    return await this.aggregateRepository.save(aggregate);
  }

  /**
   * 删除聚合
   */
  async deleteAggregate(aggregateId: string): Promise<boolean> {
    // 首先删除相关的实体和属性
    const entities = await this.entityRepository.find({
      where: { aggregateId }
    });

    for (const entity of entities) {
      await this.attributeRepository.delete({ entityId: entity.id });
    }

    await this.entityRepository.delete({ aggregateId });

    // 删除聚合
    const result = await this.aggregateRepository.delete(aggregateId);
    return result.affected ? result.affected > 0 : false;
  }

  /**
   * 获取实体列表
   */
  async getEntities(projectId: string, aggregateId?: string): Promise<DDDEntity[]> {
    const where: any = { projectId };
    if (aggregateId) {
      where.aggregateId = aggregateId;
    }

    return await this.entityRepository.find({
      where,
      relations: ['attributes'],
      order: { updatedAt: 'DESC' }
    });
  }

  /**
   * 获取实体详情
   */
  async getEntityById(entityId: string): Promise<DDDEntity | null> {
    return await this.entityRepository.findOne({
      where: { id: entityId },
      relations: ['attributes', 'aggregate']
    });
  }

  /**
   * 验证聚合模型
   */
  async validateAggregateModel(aggregateId: string): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const aggregate = await this.getAggregateById(aggregateId);
    
    if (!aggregate) {
      return {
        isValid: false,
        errors: ['聚合不存在'],
        warnings: []
      };
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    // 检查是否有根实体
    if (!aggregate.rootEntityId) {
      errors.push('聚合必须有根实体');
    }

    // 检查实体是否有标识属性
    if (aggregate.entities) {
      for (const entity of aggregate.entities) {
        if (entity.type === 'ENTITY') {
          const hasIdAttribute = entity.attributes?.some(attr => 
            attr.name.toLowerCase().includes('id') || 
            attr.metadata?.isIdentifier === true
          );
          
          if (!hasIdAttribute) {
            warnings.push(`实体 ${entity.name} 缺少标识属性`);
          }
        }
      }
    }

    // 检查业务规则一致性
    // TODO: 添加更多验证规则

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 导出聚合为JSON Schema
   */
  async exportAggregateSchema(aggregateId: string): Promise<Record<string, any> | null> {
    const aggregate = await this.getAggregateById(aggregateId);
    
    if (!aggregate) {
      return null;
    }

    return {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      $id: `https://example.com/ddd/${aggregate.projectId}/aggregate/${aggregate.id}`,
      title: aggregate.name,
      description: aggregate.description,
      type: 'object',
      properties: {
        aggregateRoot: this.entityToSchema(aggregate.rootEntity),
        entities: aggregate.entities?.filter(e => e.id !== aggregate.rootEntityId)
          .map(e => this.entityToSchema(e)) || []
      },
      metadata: aggregate.metadata
    };
  }

  /**
   * 实体转换为JSON Schema
   */
  private entityToSchema(entity?: DDDEntity): Record<string, any> | null {
    if (!entity) return null;

    const properties: Record<string, any> = {};
    const required: string[] = [];

    if (entity.attributes) {
      for (const attr of entity.attributes) {
        properties[attr.name] = {
          type: this.mapDataTypeToJsonType(attr.dataType),
          description: attr.description,
          ...attr.constraints
        };

        if (attr.constraints?.isRequired) {
          required.push(attr.name);
        }
      }
    }

    return {
      entityId: entity.id,
      name: entity.name,
      description: entity.description,
      type: entity.type,
      properties,
      required,
      metadata: entity.metadata
    };
  }

  /**
   * 数据类型映射到JSON Schema类型
   */
  private mapDataTypeToJsonType(dataType: string): string {
    const typeMapping: Record<string, string> = {
      'STRING': 'string',
      'INTEGER': 'integer',
      'DECIMAL': 'number',
      'BOOLEAN': 'boolean',
      'DATE': 'string',
      'DATETIME': 'string',
      'JSON': 'object',
      'ARRAY': 'array'
    };

    return typeMapping[dataType] || 'string';
  }
}
