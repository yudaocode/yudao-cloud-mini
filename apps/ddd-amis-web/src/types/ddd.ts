// DDD模型类型定义
export interface DDDAggregate {
  id: string;
  name: string;
  description: string;
  boundedContextId: string;
  rootEntity: DDDRootEntity;
  entities: DDDEntity[];
  valueObjects: DDDValueObject[];
  domainServices: DDDDomainService[];
  repositories: DDDRepository[];
  factories: DDDFactory[];
  domainEvents: DDDDomainEvent[];
}

export interface DDDRootEntity {
  entityId: string;
  name: string;
  description: string;
  attributes: DDDAttribute[];
  methods: DDDMethod[];
  invariants: DDDInvariant[];
}

export interface DDDEntity {
  entityId: string;
  name: string;
  description: string;
  attributes: DDDAttribute[];
  methods: DDDMethod[];
  invariants: DDDInvariant[];
}

export interface DDDAttribute {
  attributeId: string;
  name: string;
  dataType: string;
  isRequired: boolean;
  isUnique: boolean;
  isImmutable: boolean;
  defaultValue?: any;
  constraints?: any;
  businessRules?: DDDBusinessRule[];
}

export interface DDDMethod {
  methodId: string;
  name: string;
  description: string;
  accessModifier: string;
  isStatic: boolean;
  parameters: DDDParameter[];
  returnType: string;
  businessRules?: DDDBusinessRule[];
}

export interface DDDParameter {
  parameterId: string;
  name: string;
  dataType: string;
  isRequired: boolean;
  description: string;
}

export interface DDDInvariant {
  invariantId: string;
  name: string;
  description: string;
  expression: string;
  errorMessage: string;
}

export interface DDDBusinessRule {
  ruleId: string;
  name: string;
  description: string;
  expression: string;
  errorMessage: string;
}

export interface DDDValueObject {
  valueObjectId: string;
  name: string;
  description: string;
  attributes: DDDAttribute[];
  methods: DDDMethod[];
  invariants: DDDInvariant[];
}

export interface DDDDomainService {
  serviceId: string;
  name: string;
  description: string;
  methods: DDDMethod[];
}

export interface DDDRepository {
  repositoryId: string;
  name: string;
  description: string;
  methods: DDDMethod[];
}

export interface DDDFactory {
  factoryId: string;
  name: string;
  description: string;
  methods: DDDMethod[];
}

export interface DDDDomainEvent {
  eventId: string;
  name: string;
  description: string;
  eventType: string;
  attributes: DDDAttribute[];
  handlers: DDDEventHandler[];
}

export interface DDDEventHandler {
  handlerId: string;
  name: string;
  description: string;
  handlerType: string;
  businessRules?: DDDBusinessRule[];
}

export interface DDDDTO {
  id: string;
  name: string;
  description: string;
  boundedContextId: string;
  attributes: DDDAttribute[];
  mappings?: any;
}

export interface DDDModelMapping {
  modelType: string;
  modelId: string;
  autoGeneration: {
    enabled: boolean;
    templates: string[];
    defaults: any;
  };
  amisDefaults: any;
}

// Amis屏幕定义类型
export interface AmisScreenDefinition {
  version: string;
  boundedContextId: string;
  screens: AmisScreen[];
  modelMappings: DDDModelMapping[];
  amisConfig: any;
}

export interface AmisScreen {
  id: string;
  name: string;
  description: string;
  type: string;
  route: string;
  permissions: string[];
  amisPage: any;
  modelBindings: AmisModelBinding[];
}

export interface AmisModelBinding {
  modelType: string;
  modelId: string;
  bindingType: string;
  componentPath: string;
  mappingRules: AmisMappingRule[];
}

export interface AmisMappingRule {
  sourceField: string;
  targetField: string;
  transformation: string;
  validation?: any;
  amisProps: any;
}
