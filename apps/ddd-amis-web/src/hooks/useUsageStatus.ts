/**
 * DDD元数据驱动开发平台 - 使用状态管理Hook
 * 
 * 提供使用状态分析和管理功能
 */

import { useState, useEffect, useCallback } from 'react';
import { analysisService, UsageSummary, UsageStatusType } from '../services/dddApiService';

export interface UseUsageStatusOptions {
  domainId?: string;
  boundedContextId?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export interface UseUsageStatusReturn {
  usageSummary: UsageSummary | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getUsageStatusType: (usageStatus: any) => UsageStatusType;
  getUsageStatusColor: (usageStatus: any) => string;
  getUsageStatusText: (usageStatus: any) => string;
}

/**
 * 使用状态管理Hook
 */
export function useUsageStatus(options: UseUsageStatusOptions = {}): UseUsageStatusReturn {
  const { domainId, boundedContextId, autoRefresh = false, refreshInterval = 30000 } = options;
  
  const [usageSummary, setUsageSummary] = useState<UsageSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsageSummary = useCallback(async () => {
    if (!domainId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await analysisService.getUsageSummary({ domainId, boundedContextId });
      
      if (response.success && response.data) {
        setUsageSummary(response.data);
      } else {
        setError(response.error?.message || '获取使用状态失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取使用状态失败');
    } finally {
      setLoading(false);
    }
  }, [domainId, boundedContextId]);

  // 初始加载
  useEffect(() => {
    fetchUsageSummary();
  }, [fetchUsageSummary]);

  // 自动刷新
  useEffect(() => {
    if (!autoRefresh || !domainId) return;

    const interval = setInterval(fetchUsageSummary, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, domainId, refreshInterval, fetchUsageSummary]);

  // 获取使用状态类型
  const getUsageStatusType = useCallback((usageStatus: any): UsageStatusType => {
    if (!usageStatus) return 'UNUSED';

    const {
      isReferencedByStrategic,
      isReferencedByTactical,
      isReferencedByDto,
      isReferencedByImplementation,
      isReferencedByScreen
    } = usageStatus;

    const referenceCount = [
      isReferencedByStrategic,
      isReferencedByTactical,
      isReferencedByDto,
      isReferencedByImplementation,
      isReferencedByScreen
    ].filter(Boolean).length;

    if (referenceCount === 0) return 'UNUSED';
    if (referenceCount === 1) return 'PARTIALLY_USED';
    return 'USED';
  }, []);

  // 获取使用状态颜色
  const getUsageStatusColor = useCallback((usageStatus: any): string => {
    const statusType = getUsageStatusType(usageStatus);
    
    switch (statusType) {
      case 'USED':
        return '#52c41a'; // 绿色
      case 'PARTIALLY_USED':
        return '#faad14'; // 橙色
      case 'UNUSED':
        return '#ff4d4f'; // 红色
      default:
        return '#d9d9d9'; // 灰色
    }
  }, [getUsageStatusType]);

  // 获取使用状态文本
  const getUsageStatusText = useCallback((usageStatus: any): string => {
    const statusType = getUsageStatusType(usageStatus);
    
    switch (statusType) {
      case 'USED':
        return '已使用';
      case 'PARTIALLY_USED':
        return '部分使用';
      case 'UNUSED':
        return '未使用';
      default:
        return '未知';
    }
  }, [getUsageStatusType]);

  return {
    usageSummary,
    loading,
    error,
    refresh: fetchUsageSummary,
    getUsageStatusType,
    getUsageStatusColor,
    getUsageStatusText,
  };
}

/**
 * 未使用元素管理Hook
 */
export function useUnusedElements(options: UseUsageStatusOptions = {}) {
  const { domainId, boundedContextId } = options;
  
  const [unusedElements, setUnusedElements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 20,
    total: 0,
    totalPages: 0,
  });

  const fetchUnusedElements = useCallback(async (page = 1, size = 20) => {
    if (!domainId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await analysisService.getUnusedElements({
        domainId,
        boundedContextId,
        page,
        size,
      });
      
      if (response.success && response.data) {
        setUnusedElements(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        setError(response.error?.message || '获取未使用元素失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取未使用元素失败');
    } finally {
      setLoading(false);
    }
  }, [domainId, boundedContextId]);

  const refresh = useCallback(() => {
    return fetchUnusedElements(pagination.page, pagination.size);
  }, [fetchUnusedElements, pagination.page, pagination.size]);

  const changePage = useCallback((page: number) => {
    fetchUnusedElements(page, pagination.size);
  }, [fetchUnusedElements, pagination.size]);

  const changeSize = useCallback((size: number) => {
    fetchUnusedElements(1, size);
  }, [fetchUnusedElements]);

  useEffect(() => {
    fetchUnusedElements();
  }, [fetchUnusedElements]);

  return {
    unusedElements,
    loading,
    error,
    pagination,
    refresh,
    changePage,
    changeSize,
  };
}

/**
 * 孤立引用管理Hook
 */
export function useOrphanedReferences(options: UseUsageStatusOptions = {}) {
  const { domainId, boundedContextId } = options;
  
  const [orphanedReferences, setOrphanedReferences] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 20,
    total: 0,
    totalPages: 0,
  });

  const fetchOrphanedReferences = useCallback(async (page = 1, size = 20) => {
    if (!domainId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await analysisService.getOrphanedReferences({
        domainId,
        boundedContextId,
        page,
        size,
      });
      
      if (response.success && response.data) {
        setOrphanedReferences(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        setError(response.error?.message || '获取孤立引用失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取孤立引用失败');
    } finally {
      setLoading(false);
    }
  }, [domainId, boundedContextId]);

  const refresh = useCallback(() => {
    return fetchOrphanedReferences(pagination.page, pagination.size);
  }, [fetchOrphanedReferences, pagination.page, pagination.size]);

  const changePage = useCallback((page: number) => {
    fetchOrphanedReferences(page, pagination.size);
  }, [fetchOrphanedReferences, pagination.size]);

  const changeSize = useCallback((size: number) => {
    fetchOrphanedReferences(1, size);
  }, [fetchOrphanedReferences]);

  useEffect(() => {
    fetchOrphanedReferences();
  }, [fetchOrphanedReferences]);

  return {
    orphanedReferences,
    loading,
    error,
    pagination,
    refresh,
    changePage,
    changeSize,
  };
}

/**
 * 设计建议Hook
 */
export function useDesignRecommendations(options: UseUsageStatusOptions & {
  focusArea?: 'TERMS' | 'CONTEXTS' | 'ENTITIES' | 'DTOS' | 'MAPPINGS';
} = {}) {
  const { domainId, boundedContextId, focusArea } = options;
  
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    if (!domainId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await analysisService.getRecommendations({
        domainId,
        boundedContextId,
        focusArea,
      });
      
      if (response.success && response.data) {
        setRecommendations(response.data);
      } else {
        setError(response.error?.message || '获取设计建议失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取设计建议失败');
    } finally {
      setLoading(false);
    }
  }, [domainId, boundedContextId, focusArea]);

  const refresh = useCallback(() => {
    return fetchRecommendations();
  }, [fetchRecommendations]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return {
    recommendations,
    loading,
    error,
    refresh,
  };
}

export default {
  useUsageStatus,
  useUnusedElements,
  useOrphanedReferences,
  useDesignRecommendations,
};
