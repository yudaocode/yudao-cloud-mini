/**
 * DDD元数据驱动开发平台 - 统一API服务
 * 
 * 整合所有DDD相关的API调用，提供统一的接口
 */

// 基础类型定义
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  requestId: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
}

// 使用状态相关类型
export interface UsageStatus {
  isReferencedByStrategic?: boolean;
  isReferencedByTactical?: boolean;
  isReferencedByDto?: boolean;
  isReferencedByImplementation?: boolean;
  isReferencedByScreen?: boolean;
  lastReferencedAt?: string;
}

export type UsageStatusType = 'USED' | 'PARTIALLY_USED' | 'UNUSED';

export interface UsageSummary {
  ubiquitousLanguage: {
    totalTerms: number;
    usedTerms: number;
    totalAttributes: number;
    usedAttributes: number;
  };
  strategicDesign: {
    totalContexts: number;
    usedContexts: number;
  };
  tacticalDesign: {
    totalEntities: number;
    usedEntities: number;
  };
  dtoManagement: {
    totalDtos: number;
    usedDtos: number;
  };
}

// 基础Service类
export abstract class BaseService {
  protected baseUrl: string;
  protected headers: Record<string, string>;

  constructor(baseUrl: string = '/api/ddd') {
    this.baseUrl = baseUrl;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: this.headers,
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network error',
          details: error
        },
        timestamp: new Date().toISOString(),
        requestId: this.generateRequestId()
      };
    }
  }

  protected async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return this.request<T>(url.pathname + url.search);
  }

  protected async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  protected async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  protected async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// 统一语言管理服务
export class UbiquitousLanguageService extends BaseService {
  async getUbiquitousLanguage(domainId: string): Promise<ApiResponse<any>> {
    return this.get<any>(`/ubiquitous-language/${domainId}`);
  }

  async updateUbiquitousLanguage(domainId: string, data: any): Promise<ApiResponse<any>> {
    return this.put<any>(`/ubiquitous-language/${domainId}`, data);
  }

  async getTerms(domainId: string, params?: {
    page?: number;
    size?: number;
    search?: string;
    category?: string;
    isCore?: boolean;
    usageStatus?: UsageStatusType;
  }): Promise<PaginatedResponse<any>> {
    return this.get<any[]>(`/ubiquitous-language/${domainId}/terms`, params);
  }

  async createTerm(domainId: string, term: any): Promise<ApiResponse<any>> {
    return this.post<any>(`/ubiquitous-language/${domainId}/terms`, term);
  }

  async updateTerm(domainId: string, termId: string, term: any): Promise<ApiResponse<any>> {
    return this.put<any>(`/ubiquitous-language/${domainId}/terms/${termId}`, term);
  }

  async deleteTerm(domainId: string, termId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/ubiquitous-language/${domainId}/terms/${termId}`);
  }

  async getAttributes(domainId: string, params?: {
    page?: number;
    size?: number;
    search?: string;
    dataType?: string;
    isRequired?: boolean;
    usageStatus?: UsageStatusType;
  }): Promise<PaginatedResponse<any>> {
    return this.get<any[]>(`/ubiquitous-language/${domainId}/attributes`, params);
  }

  async createAttribute(domainId: string, attribute: any): Promise<ApiResponse<any>> {
    return this.post<any>(`/ubiquitous-language/${domainId}/attributes`, attribute);
  }

  async updateAttribute(domainId: string, attributeId: string, attribute: any): Promise<ApiResponse<any>> {
    return this.put<any>(`/ubiquitous-language/${domainId}/attributes/${attributeId}`, attribute);
  }

  async deleteAttribute(domainId: string, attributeId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/ubiquitous-language/${domainId}/attributes/${attributeId}`);
  }
}

// 战略设计管理服务
export class StrategicDesignService extends BaseService {
  async getStrategicDesign(domainId: string): Promise<ApiResponse<any>> {
    return this.get<any>(`/strategic-design/${domainId}`);
  }

  async updateStrategicDesign(domainId: string, data: any): Promise<ApiResponse<any>> {
    return this.put<any>(`/strategic-design/${domainId}`, data);
  }

  async getBoundedContexts(domainId: string, params?: {
    page?: number;
    size?: number;
    search?: string;
    type?: 'CORE' | 'SUPPORTING' | 'GENERIC';
    isActive?: boolean;
    usageStatus?: UsageStatusType;
  }): Promise<PaginatedResponse<any>> {
    return this.get<any[]>(`/strategic-design/${domainId}/bounded-contexts`, params);
  }

  async createBoundedContext(domainId: string, context: any): Promise<ApiResponse<any>> {
    return this.post<any>(`/strategic-design/${domainId}/bounded-contexts`, context);
  }

  async updateBoundedContext(domainId: string, contextId: string, context: any): Promise<ApiResponse<any>> {
    return this.put<any>(`/strategic-design/${domainId}/bounded-contexts/${contextId}`, context);
  }

  async deleteBoundedContext(domainId: string, contextId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/strategic-design/${domainId}/bounded-contexts/${contextId}`);
  }
}

// 战术设计管理服务
export class TacticalDesignService extends BaseService {
  async getTacticalDesign(boundedContextId: string): Promise<ApiResponse<any>> {
    return this.get<any>(`/tactical-design/${boundedContextId}`);
  }

  async updateTacticalDesign(boundedContextId: string, data: any): Promise<ApiResponse<any>> {
    return this.put<any>(`/tactical-design/${boundedContextId}`, data);
  }

  async getAggregates(boundedContextId: string, params?: {
    page?: number;
    size?: number;
    search?: string;
    isActive?: boolean;
  }): Promise<PaginatedResponse<any>> {
    return this.get<any[]>(`/tactical-design/${boundedContextId}/aggregates`, params);
  }

  async createAggregate(boundedContextId: string, aggregate: any): Promise<ApiResponse<any>> {
    return this.post<any>(`/tactical-design/${boundedContextId}/aggregates`, aggregate);
  }

  async updateAggregate(boundedContextId: string, aggregateId: string, aggregate: any): Promise<ApiResponse<any>> {
    return this.put<any>(`/tactical-design/${boundedContextId}/aggregates/${aggregateId}`, aggregate);
  }

  async deleteAggregate(boundedContextId: string, aggregateId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/tactical-design/${boundedContextId}/aggregates/${aggregateId}`);
  }

  async getEntities(boundedContextId: string, params?: {
    page?: number;
    size?: number;
    search?: string;
    aggregateId?: string;
    isActive?: boolean;
    usageStatus?: UsageStatusType;
  }): Promise<PaginatedResponse<any>> {
    return this.get<any[]>(`/tactical-design/${boundedContextId}/entities`, params);
  }

  async createEntity(boundedContextId: string, entity: any): Promise<ApiResponse<any>> {
    return this.post<any>(`/tactical-design/${boundedContextId}/entities`, entity);
  }

  async updateEntity(boundedContextId: string, entityId: string, entity: any): Promise<ApiResponse<any>> {
    return this.put<any>(`/tactical-design/${boundedContextId}/entities/${entityId}`, entity);
  }

  async deleteEntity(boundedContextId: string, entityId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/tactical-design/${boundedContextId}/entities/${entityId}`);
  }
}

// DTO管理服务
export class DtoService extends BaseService {
  async getDataTransferObjects(boundedContextId: string): Promise<ApiResponse<any>> {
    return this.get<any>(`/data-transfer-objects/${boundedContextId}`);
  }

  async updateDataTransferObjects(boundedContextId: string, data: any): Promise<ApiResponse<any>> {
    return this.put<any>(`/data-transfer-objects/${boundedContextId}`, data);
  }

  async getDtos(boundedContextId: string, params?: {
    page?: number;
    size?: number;
    search?: string;
    type?: string;
    layer?: string;
    isActive?: boolean;
    usageStatus?: UsageStatusType;
  }): Promise<PaginatedResponse<any>> {
    return this.get<any[]>(`/data-transfer-objects/${boundedContextId}/dtos`, params);
  }

  async createDto(boundedContextId: string, dto: any): Promise<ApiResponse<any>> {
    return this.post<any>(`/data-transfer-objects/${boundedContextId}/dtos`, dto);
  }

  async updateDto(boundedContextId: string, dtoId: string, dto: any): Promise<ApiResponse<any>> {
    return this.put<any>(`/data-transfer-objects/${boundedContextId}/dtos/${dtoId}`, dto);
  }

  async deleteDto(boundedContextId: string, dtoId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/data-transfer-objects/${boundedContextId}/dtos/${dtoId}`);
  }
}

// 实现映射管理服务
export class ImplementationMappingService extends BaseService {
  async getImplementationMapping(domainId: string): Promise<ApiResponse<any>> {
    return this.get<any>(`/implementation-mapping/${domainId}`);
  }

  async updateImplementationMapping(domainId: string, data: any): Promise<ApiResponse<any>> {
    return this.put<any>(`/implementation-mapping/${domainId}`, data);
  }
}

// 屏幕定义管理服务
export class ScreenDefinitionService extends BaseService {
  async getScreenDefinition(domainId: string): Promise<ApiResponse<any>> {
    return this.get<any>(`/screen-definition/${domainId}`);
  }

  async updateScreenDefinition(domainId: string, data: any): Promise<ApiResponse<any>> {
    return this.put<any>(`/screen-definition/${domainId}`, data);
  }
}

// amis屏幕管理服务
export class AmisScreenDefinitionService extends BaseService {
  async getAmisScreenDefinition(domainId: string): Promise<ApiResponse<any>> {
    return this.get<any>(`/amis-screen-definition/${domainId}`);
  }

  async updateAmisScreenDefinition(domainId: string, data: any): Promise<ApiResponse<any>> {
    return this.put<any>(`/amis-screen-definition/${domainId}`, data);
  }
}

// 分析服务
export class AnalysisService extends BaseService {
  async analyzeReferences(params?: {
    domainId?: string;
    boundedContextId?: string;
    includeUnused?: boolean;
    includeOrphaned?: boolean;
  }): Promise<ApiResponse<any>> {
    return this.post<any>('/analysis/references', params);
  }

  async getUsageSummary(params?: {
    domainId?: string;
    boundedContextId?: string;
  }): Promise<ApiResponse<UsageSummary>> {
    return this.get<UsageSummary>('/analysis/usage-summary', params);
  }

  async getUnusedElements(params?: {
    domainId?: string;
    boundedContextId?: string;
    elementType?: string;
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<any>> {
    return this.get<any[]>('/analysis/unused-elements', params);
  }

  async getOrphanedReferences(params?: {
    domainId?: string;
    boundedContextId?: string;
    referenceType?: string;
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<any>> {
    return this.get<any[]>('/analysis/orphaned-references', params);
  }

  async getRecommendations(params?: {
    domainId?: string;
    boundedContextId?: string;
    focusArea?: 'TERMS' | 'CONTEXTS' | 'ENTITIES' | 'DTOS' | 'MAPPINGS';
  }): Promise<ApiResponse<any[]>> {
    return this.post<any[]>('/analysis/recommendations', params);
  }
}

// 统一导出所有服务实例
export const ubiquitousLanguageService = new UbiquitousLanguageService();
export const strategicDesignService = new StrategicDesignService();
export const tacticalDesignService = new TacticalDesignService();
export const dtoService = new DtoService();
export const implementationMappingService = new ImplementationMappingService();
export const screenDefinitionService = new ScreenDefinitionService();
export const amisScreenDefinitionService = new AmisScreenDefinitionService();
export const analysisService = new AnalysisService();

// 默认导出
export default {
  ubiquitousLanguageService,
  strategicDesignService,
  tacticalDesignService,
  dtoService,
  implementationMappingService,
  screenDefinitionService,
  amisScreenDefinitionService,
  analysisService,
};
