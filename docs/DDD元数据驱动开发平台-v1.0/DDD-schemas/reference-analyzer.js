/**
 * DDD元数据驱动开发平台 - 引用关系分析服务
 * 
 * 自动发现和维护Schema之间的引用关系
 * 提供使用状态分析和问题发现功能
 */

class ReferenceAnalyzer {
  constructor() {
    this.referenceMap = new Map();
    this.unusedElements = new Map();
    this.orphanedReferences = new Map();
  }

  /**
   * 分析所有Schema的引用关系
   */
  async analyzeReferences(schemas) {
    console.log('🔍 开始分析引用关系...');
    
    // 清空之前的结果
    this.referenceMap.clear();
    this.unusedElements.clear();
    this.orphanedReferences.clear();

    // 分析每个Schema的引用
    for (const [schemaName, schema] of schemas) {
      await this.analyzeSchemaReferences(schemaName, schema, schemas);
    }

    // 生成使用状态报告
    const report = this.generateUsageReport();
    
    console.log('✅ 引用关系分析完成');
    return report;
  }

  /**
   * 分析单个Schema的引用关系
   */
  async analyzeSchemaReferences(schemaName, schema, allSchemas) {
    const references = {
      schema: schemaName,
      references: [],
      referencedBy: []
    };

    // 分析当前Schema引用了哪些其他Schema的元素
    const outgoingRefs = this.findOutgoingReferences(schema, schemaName);
    references.references = outgoingRefs;

    // 分析当前Schema被哪些其他Schema引用
    const incomingRefs = this.findIncomingReferences(schema, schemaName, allSchemas);
    references.referencedBy = incomingRefs;

    this.referenceMap.set(schemaName, references);

    // 更新被引用Schema的使用状态
    await this.updateUsageStatus(schemaName, references, allSchemas);
  }

  /**
   * 查找当前Schema引用的其他Schema元素
   */
  findOutgoingReferences(schema, currentSchemaName) {
    const references = [];
    
    // 根据Schema类型查找特定引用
    switch (currentSchemaName) {
      case 'ubiquitous-language.schema.json':
        // 统一语言不引用其他Schema
        break;
        
      case 'strategic-design.schema.json':
        // 战略设计引用统一语言的术语
        if (schema.boundedContexts) {
          schema.boundedContexts.forEach(context => {
            if (context.ubiquitousLanguage) {
              context.ubiquitousLanguage.forEach(termId => {
                references.push({
                  type: 'TERM_REFERENCE',
                  source: `${currentSchemaName}:${context.id}`,
                  target: `ubiquitous-language.schema.json:${termId}`,
                  description: `限界上下文 "${context.name}" 引用术语 "${termId}"`
                });
              });
            }
          });
        }
        break;
        
      case 'tactical-design.schema.json':
        // 战术设计引用统一语言的术语和属性，以及战略设计的限界上下文
        if (schema.boundedContextId) {
          references.push({
            type: 'BOUNDED_CONTEXT_REFERENCE',
            source: currentSchemaName,
            target: `strategic-design.schema.json:${schema.boundedContextId}`,
            description: `战术设计引用限界上下文 "${schema.boundedContextId}"`
          });
        }
        
        if (schema.aggregates) {
          schema.aggregates.forEach(aggregate => {
            if (aggregate.termId) {
              references.push({
                type: 'TERM_REFERENCE',
                source: `${currentSchemaName}:${aggregate.id}`,
                target: `ubiquitous-language.schema.json:${aggregate.termId}`,
                description: `聚合 "${aggregate.name}" 引用术语 "${aggregate.termId}"`
              });
            }
          });
        }
        
        if (schema.entities) {
          schema.entities.forEach(entity => {
            if (entity.termId) {
              references.push({
                type: 'TERM_REFERENCE',
                source: `${currentSchemaName}:${entity.id}`,
                target: `ubiquitous-language.schema.json:${entity.termId}`,
                description: `实体 "${entity.name}" 引用术语 "${entity.termId}"`
              });
            }
            
            if (entity.attributes) {
              entity.attributes.forEach(attr => {
                if (attr.businessAttributeId) {
                  references.push({
                    type: 'BUSINESS_ATTRIBUTE_REFERENCE',
                    source: `${currentSchemaName}:${entity.id}:${attr.id}`,
                    target: `ubiquitous-language.schema.json:${attr.businessAttributeId}`,
                    description: `实体 "${entity.name}" 的属性 "${attr.name}" 引用业务属性 "${attr.businessAttributeId}"`
                  });
                }
              });
            }
          });
        }
        break;
        
      case 'data-transfer-objects.schema.json':
        // DTO管理引用统一语言的术语和属性，以及战略设计的限界上下文
        if (schema.boundedContextId) {
          references.push({
            type: 'BOUNDED_CONTEXT_REFERENCE',
            source: currentSchemaName,
            target: `strategic-design.schema.json:${schema.boundedContextId}`,
            description: `DTO管理引用限界上下文 "${schema.boundedContextId}"`
          });
        }
        
        if (schema.dataTransferObjects) {
          schema.dataTransferObjects.forEach(dto => {
            if (dto.termReferences) {
              dto.termReferences.forEach(termId => {
                references.push({
                  type: 'TERM_REFERENCE',
                  source: `${currentSchemaName}:${dto.id}`,
                  target: `ubiquitous-language.schema.json:${termId}`,
                  description: `DTO "${dto.name}" 引用术语 "${termId}"`
                });
              });
            }
            
            if (dto.attributes) {
              dto.attributes.forEach(attr => {
                if (attr.businessAttributeId) {
                  references.push({
                    type: 'BUSINESS_ATTRIBUTE_REFERENCE',
                    source: `${currentSchemaName}:${dto.id}:${attr.id}`,
                    target: `ubiquitous-language.schema.json:${attr.businessAttributeId}`,
                    description: `DTO "${dto.name}" 的属性 "${attr.name}" 引用业务属性 "${attr.businessAttributeId}"`
                  });
                }
              });
            }
          });
        }
        break;
        
      case 'implementation-mapping.schema.json':
        // 实现映射引用多个Schema
        if (schema.domainId) {
          references.push({
            type: 'DOMAIN_REFERENCE',
            source: currentSchemaName,
            target: `strategic-design.schema.json:${schema.domainId}`,
            description: `实现映射引用领域 "${schema.domainId}"`
          });
        }
        
        if (schema.boundedContextId) {
          references.push({
            type: 'BOUNDED_CONTEXT_REFERENCE',
            source: currentSchemaName,
            target: `strategic-design.schema.json:${schema.boundedContextId}`,
            description: `实现映射引用限界上下文 "${schema.boundedContextId}"`
          });
        }
        
        if (schema.dtoMappings) {
          schema.dtoMappings.forEach(mapping => {
            if (mapping.sourceDtoId) {
              references.push({
                type: 'DTO_REFERENCE',
                source: `${currentSchemaName}:${mapping.id}`,
                target: `data-transfer-objects.schema.json:${mapping.sourceDtoId}`,
                description: `DTO映射 "${mapping.id}" 引用源DTO "${mapping.sourceDtoId}"`
              });
            }
            if (mapping.targetDtoId) {
              references.push({
                type: 'DTO_REFERENCE',
                source: `${currentSchemaName}:${mapping.id}`,
                target: `data-transfer-objects.schema.json:${mapping.targetDtoId}`,
                description: `DTO映射 "${mapping.id}" 引用目标DTO "${mapping.targetDtoId}"`
              });
            }
          });
        }
        
        if (schema.persistenceMappings) {
          schema.persistenceMappings.forEach(mapping => {
            if (mapping.entityId) {
              references.push({
                type: 'ENTITY_REFERENCE',
                source: `${currentSchemaName}:${mapping.id}`,
                target: `tactical-design.schema.json:${mapping.entityId}`,
                description: `持久化映射 "${mapping.id}" 引用实体 "${mapping.entityId}"`
              });
            }
          });
        }
        break;
        
      case 'screen-definition.schema.json':
        // 屏幕定义引用多个Schema
        if (schema.domainId) {
          references.push({
            type: 'DOMAIN_REFERENCE',
            source: currentSchemaName,
            target: `strategic-design.schema.json:${schema.domainId}`,
            description: `屏幕定义引用领域 "${schema.domainId}"`
          });
        }
        
        if (schema.boundedContextId) {
          references.push({
            type: 'BOUNDED_CONTEXT_REFERENCE',
            source: currentSchemaName,
            target: `strategic-design.schema.json:${schema.boundedContextId}`,
            description: `屏幕定义引用限界上下文 "${schema.boundedContextId}"`
          });
        }
        
        if (schema.screens) {
          schema.screens.forEach(screen => {
            if (screen.dtoMappings) {
              screen.dtoMappings.forEach(mapping => {
                if (mapping.dtoId) {
                  references.push({
                    type: 'DTO_REFERENCE',
                    source: `${currentSchemaName}:${screen.id}:${mapping.id}`,
                    target: `data-transfer-objects.schema.json:${mapping.dtoId}`,
                    description: `屏幕 "${screen.name}" 的DTO映射引用DTO "${mapping.dtoId}"`
                  });
                }
              });
            }
          });
        }
        
        if (schema.endpointMappings) {
          schema.endpointMappings.forEach(mapping => {
            if (mapping.endpointId) {
              references.push({
                type: 'ENDPOINT_REFERENCE',
                source: `${currentSchemaName}:${mapping.id}`,
                target: `implementation-mapping.schema.json:${mapping.endpointId}`,
                description: `端点映射 "${mapping.id}" 引用端点 "${mapping.endpointId}"`
              });
            }
          });
        }
        break;
        
      case 'amis-screen-definition.schema.json':
        // amis屏幕定义引用多个Schema
        if (schema.domainId) {
          references.push({
            type: 'DOMAIN_REFERENCE',
            source: currentSchemaName,
            target: `strategic-design.schema.json:${schema.domainId}`,
            description: `amis屏幕定义引用领域 "${schema.domainId}"`
          });
        }
        
        if (schema.boundedContextId) {
          references.push({
            type: 'BOUNDED_CONTEXT_REFERENCE',
            source: currentSchemaName,
            target: `strategic-design.schema.json:${schema.boundedContextId}`,
            description: `amis屏幕定义引用限界上下文 "${schema.boundedContextId}"`
          });
        }
        
        if (schema.screens) {
          schema.screens.forEach(screen => {
            if (screen.modelBindings) {
              screen.modelBindings.forEach(binding => {
                // 这里可以根据binding的类型引用不同的Schema
                if (binding.entityId) {
                  references.push({
                    type: 'ENTITY_REFERENCE',
                    source: `${currentSchemaName}:${screen.id}:${binding.id}`,
                    target: `tactical-design.schema.json:${binding.entityId}`,
                    description: `amis屏幕 "${screen.name}" 的模型绑定引用实体 "${binding.entityId}"`
                  });
                }
              });
            }
          });
        }
        break;
    }

    return references;
  }

  /**
   * 查找当前Schema被哪些其他Schema引用
   */
  findIncomingReferences(schema, currentSchemaName, allSchemas) {
    const incomingRefs = [];
    
    for (const [otherSchemaName, otherSchema] of allSchemas) {
      if (otherSchemaName === currentSchemaName) continue;
      
      const outgoingRefs = this.findOutgoingReferences(otherSchema, otherSchemaName);
      const relevantRefs = outgoingRefs.filter(ref => 
        ref.target.startsWith(`${currentSchemaName}:`)
      );
      
      incomingRefs.push(...relevantRefs);
    }

    return incomingRefs;
  }

  /**
   * 更新使用状态
   */
  async updateUsageStatus(schemaName, references, allSchemas) {
    const schema = allSchemas.get(schemaName);
    if (!schema) return;

    // 更新usageStatus
    if (!schema.usageStatus) {
      schema.usageStatus = {};
    }

    // 根据被引用情况更新状态
    const referencedBy = references.referencedBy;
    
    schema.usageStatus.isReferencedByStrategic = referencedBy.some(ref => 
      ref.source.startsWith('strategic-design.schema.json:')
    );
    
    schema.usageStatus.isReferencedByTactical = referencedBy.some(ref => 
      ref.source.startsWith('tactical-design.schema.json:')
    );
    
    schema.usageStatus.isReferencedByDto = referencedBy.some(ref => 
      ref.source.startsWith('data-transfer-objects.schema.json:')
    );
    
    schema.usageStatus.isReferencedByImplementation = referencedBy.some(ref => 
      ref.source.startsWith('implementation-mapping.schema.json:')
    );
    
    schema.usageStatus.isReferencedByScreen = referencedBy.some(ref => 
      ref.source.startsWith('screen-definition.schema.json:') ||
      ref.source.startsWith('amis-screen-definition.schema.json:')
    );

    if (referencedBy.length > 0) {
      schema.usageStatus.lastReferencedAt = new Date().toISOString();
    }
  }

  /**
   * 发现未使用的元素
   */
  findUnusedElements(schemas) {
    console.log('🔍 发现未使用的元素...');
    
    for (const [schemaName, schema] of schemas) {
      const unused = [];
      
      switch (schemaName) {
        case 'ubiquitous-language.schema.json':
          if (schema.businessTerms) {
            schema.businessTerms.forEach(term => {
              if (!term.usageStatus?.isReferencedByStrategic && 
                  !term.usageStatus?.isReferencedByTactical && 
                  !term.usageStatus?.isReferencedByDto) {
                unused.push({
                  type: 'BUSINESS_TERM',
                  id: term.id,
                  name: term.name,
                  description: `术语 "${term.name}" 未被任何设计阶段引用`
                });
              }
            });
          }
          
          if (schema.businessAttributes) {
            schema.businessAttributes.forEach(attr => {
              if (!attr.usageStatus?.isReferencedByTactical && 
                  !attr.usageStatus?.isReferencedByDto) {
                unused.push({
                  type: 'BUSINESS_ATTRIBUTE',
                  id: attr.id,
                  name: attr.name,
                  description: `业务属性 "${attr.name}" 未被任何设计阶段引用`
                });
              }
            });
          }
          break;
          
        case 'strategic-design.schema.json':
          if (schema.boundedContexts) {
            schema.boundedContexts.forEach(context => {
              if (!context.usageStatus?.isReferencedByTactical && 
                  !context.usageStatus?.isReferencedByDto && 
                  !context.usageStatus?.isReferencedByImplementation && 
                  !context.usageStatus?.isReferencedByScreen) {
                unused.push({
                  type: 'BOUNDED_CONTEXT',
                  id: context.id,
                  name: context.name,
                  description: `限界上下文 "${context.name}" 未被任何设计阶段引用`
                });
              }
            });
          }
          break;
          
        case 'tactical-design.schema.json':
          if (schema.entities) {
            schema.entities.forEach(entity => {
              if (!entity.usageStatus?.isReferencedByImplementation) {
                unused.push({
                  type: 'ENTITY',
                  id: entity.id,
                  name: entity.name,
                  description: `实体 "${entity.name}" 未被实现映射引用`
                });
              }
            });
          }
          break;
          
        case 'data-transfer-objects.schema.json':
          if (schema.dataTransferObjects) {
            schema.dataTransferObjects.forEach(dto => {
              if (!dto.usageStatus?.isReferencedByImplementation && 
                  !dto.usageStatus?.isReferencedByScreen) {
                unused.push({
                  type: 'DTO',
                  id: dto.id,
                  name: dto.name,
                  description: `DTO "${dto.name}" 未被实现映射或屏幕定义引用`
                });
              }
            });
          }
          break;
      }
      
      if (unused.length > 0) {
        this.unusedElements.set(schemaName, unused);
      }
    }
  }

  /**
   * 发现孤立的引用
   */
  findOrphanedReferences(schemas) {
    console.log('🔍 发现孤立的引用...');
    
    for (const [schemaName, schema] of schemas) {
      const orphaned = [];
      
      // 检查引用的元素是否存在
      const references = this.referenceMap.get(schemaName);
      if (references) {
        references.references.forEach(ref => {
          const [targetSchema, targetId] = ref.target.split(':');
          const targetSchemaData = schemas.get(targetSchema);
          
          if (!targetSchemaData) {
            orphaned.push({
              type: 'MISSING_SCHEMA',
              source: ref.source,
              target: ref.target,
              description: `引用的Schema "${targetSchema}" 不存在`
            });
          } else {
            // 检查引用的元素是否存在
            const elementExists = this.checkElementExists(targetSchemaData, targetId);
            if (!elementExists) {
              orphaned.push({
                type: 'MISSING_ELEMENT',
                source: ref.source,
                target: ref.target,
                description: `引用的元素 "${targetId}" 在 "${targetSchema}" 中不存在`
              });
            }
          }
        });
      }
      
      if (orphaned.length > 0) {
        this.orphanedReferences.set(schemaName, orphaned);
      }
    }
  }

  /**
   * 检查元素是否存在
   */
  checkElementExists(schemaData, elementId) {
    // 根据元素ID的前缀判断类型并检查存在性
    if (elementId.startsWith('term_')) {
      return schemaData.businessTerms?.some(term => term.id === elementId);
    } else if (elementId.startsWith('attr_')) {
      return schemaData.businessAttributes?.some(attr => attr.id === elementId);
    } else if (elementId.startsWith('bc_')) {
      return schemaData.boundedContexts?.some(context => context.id === elementId);
    } else if (elementId.startsWith('entity_')) {
      return schemaData.entities?.some(entity => entity.id === elementId);
    } else if (elementId.startsWith('dto_')) {
      return schemaData.dataTransferObjects?.some(dto => dto.id === elementId);
    }
    
    return false;
  }

  /**
   * 生成使用状态报告
   */
  generateUsageReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalSchemas: this.referenceMap.size,
        totalReferences: 0,
        unusedElements: 0,
        orphanedReferences: 0
      },
      details: {
        references: Object.fromEntries(this.referenceMap),
        unusedElements: Object.fromEntries(this.unusedElements),
        orphanedReferences: Object.fromEntries(this.orphanedReferences)
      },
      recommendations: []
    };

    // 统计总数
    for (const [schemaName, references] of this.referenceMap) {
      report.summary.totalReferences += references.references.length;
    }
    
    for (const [schemaName, unused] of this.unusedElements) {
      report.summary.unusedElements += unused.length;
    }
    
    for (const [schemaName, orphaned] of this.orphanedReferences) {
      report.summary.orphanedReferences += orphaned.length;
    }

    // 生成建议
    if (report.summary.unusedElements > 0) {
      report.recommendations.push('发现未使用的元素，建议检查是否遗漏了设计步骤');
    }
    
    if (report.summary.orphanedReferences > 0) {
      report.recommendations.push('发现孤立的引用，建议检查引用的元素是否存在');
    }

    return report;
  }

  /**
   * 获取使用状态摘要
   */
  getUsageSummary(schemas) {
    const summary = {
      ubiquitousLanguage: {
        totalTerms: 0,
        usedTerms: 0,
        totalAttributes: 0,
        usedAttributes: 0
      },
      strategicDesign: {
        totalContexts: 0,
        usedContexts: 0
      },
      tacticalDesign: {
        totalEntities: 0,
        usedEntities: 0
      },
      dtoManagement: {
        totalDtos: 0,
        usedDtos: 0
      }
    };

    // 统计统一语言
    const ulSchema = schemas.get('ubiquitous-language.schema.json');
    if (ulSchema) {
      if (ulSchema.businessTerms) {
        summary.ubiquitousLanguage.totalTerms = ulSchema.businessTerms.length;
        summary.ubiquitousLanguage.usedTerms = ulSchema.businessTerms.filter(term => 
          term.usageStatus?.isReferencedByStrategic || 
          term.usageStatus?.isReferencedByTactical || 
          term.usageStatus?.isReferencedByDto
        ).length;
      }
      
      if (ulSchema.businessAttributes) {
        summary.ubiquitousLanguage.totalAttributes = ulSchema.businessAttributes.length;
        summary.ubiquitousLanguage.usedAttributes = ulSchema.businessAttributes.filter(attr => 
          attr.usageStatus?.isReferencedByTactical || 
          attr.usageStatus?.isReferencedByDto
        ).length;
      }
    }

    // 统计战略设计
    const sdSchema = schemas.get('strategic-design.schema.json');
    if (sdSchema) {
      if (sdSchema.boundedContexts) {
        summary.strategicDesign.totalContexts = sdSchema.boundedContexts.length;
        summary.strategicDesign.usedContexts = sdSchema.boundedContexts.filter(context => 
          context.usageStatus?.isReferencedByTactical || 
          context.usageStatus?.isReferencedByDto || 
          context.usageStatus?.isReferencedByImplementation || 
          context.usageStatus?.isReferencedByScreen
        ).length;
      }
    }

    // 统计战术设计
    const tdSchema = schemas.get('tactical-design.schema.json');
    if (tdSchema) {
      if (tdSchema.entities) {
        summary.tacticalDesign.totalEntities = tdSchema.entities.length;
        summary.tacticalDesign.usedEntities = tdSchema.entities.filter(entity => 
          entity.usageStatus?.isReferencedByImplementation
        ).length;
      }
    }

    // 统计DTO管理
    const dtoSchema = schemas.get('data-transfer-objects.schema.json');
    if (dtoSchema) {
      if (dtoSchema.dataTransferObjects) {
        summary.dtoManagement.totalDtos = dtoSchema.dataTransferObjects.length;
        summary.dtoManagement.usedDtos = dtoSchema.dataTransferObjects.filter(dto => 
          dto.usageStatus?.isReferencedByImplementation || 
          dto.usageStatus?.isReferencedByScreen
        ).length;
      }
    }

    return summary;
  }
}

// 使用示例
async function main() {
  const analyzer = new ReferenceAnalyzer();
  
  // 加载所有Schema
  const schemas = new Map();
  // 这里应该加载实际的Schema数据
  
  // 分析引用关系
  const report = await analyzer.analyzeReferences(schemas);
  
  // 发现未使用的元素
  analyzer.findUnusedElements(schemas);
  
  // 发现孤立的引用
  analyzer.findOrphanedReferences(schemas);
  
  // 获取使用状态摘要
  const summary = analyzer.getUsageSummary(schemas);
  
  console.log('📊 引用关系分析报告:');
  console.log(JSON.stringify(report, null, 2));
  
  console.log('📈 使用状态摘要:');
  console.log(JSON.stringify(summary, null, 2));
}

// 如果直接运行此文件
if (require.main === module) {
  main();
}

module.exports = ReferenceAnalyzer;
