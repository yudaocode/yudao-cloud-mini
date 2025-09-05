/**
 * DDD元数据驱动开发平台 - 使用状态指示器组件
 * 
 * 显示元素的使用状态，提供视觉反馈
 */

import React from 'react';
import { useUsageStatus, UsageStatusType } from '../hooks/useUsageStatus';

export interface UsageStatusIndicatorProps {
  usageStatus: any;
  domainId?: string;
  boundedContextId?: string;
  showTooltip?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onClick?: () => void;
}

export interface UsageStatusBadgeProps {
  statusType: UsageStatusType;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  showText?: boolean;
}

/**
 * 使用状态徽章组件
 */
export const UsageStatusBadge: React.FC<UsageStatusBadgeProps> = ({
  statusType,
  size = 'medium',
  className = '',
  showText = true,
}) => {
  const getStatusConfig = () => {
    switch (statusType) {
      case 'USED':
        return {
          color: '#52c41a',
          bgColor: '#f6ffed',
          borderColor: '#b7eb8f',
          text: '已使用',
          icon: '✓',
        };
      case 'PARTIALLY_USED':
        return {
          color: '#faad14',
          bgColor: '#fffbe6',
          borderColor: '#ffe58f',
          text: '部分使用',
          icon: '⚠',
        };
      case 'UNUSED':
        return {
          color: '#ff4d4f',
          bgColor: '#fff2f0',
          borderColor: '#ffccc7',
          text: '未使用',
          icon: '✗',
        };
      default:
        return {
          color: '#d9d9d9',
          bgColor: '#fafafa',
          borderColor: '#d9d9d9',
          text: '未知',
          icon: '?',
        };
    }
  };

  const config = getStatusConfig();
  const sizeClasses = {
    small: 'px-1 py-0.5 text-xs',
    medium: 'px-2 py-1 text-sm',
    large: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${sizeClasses[size]} ${className}`}
      style={{
        color: config.color,
        backgroundColor: config.bgColor,
        borderColor: config.borderColor,
      }}
    >
      <span className="font-medium">{config.icon}</span>
      {showText && <span>{config.text}</span>}
    </span>
  );
};

/**
 * 使用状态指示器组件
 */
export const UsageStatusIndicator: React.FC<UsageStatusIndicatorProps> = ({
  usageStatus,
  domainId,
  boundedContextId,
  showTooltip = true,
  size = 'medium',
  className = '',
  onClick,
}) => {
  const { getUsageStatusType, getUsageStatusColor, getUsageStatusText } = useUsageStatus({
    domainId,
    boundedContextId,
  });

  const statusType = getUsageStatusType(usageStatus);
  const statusColor = getUsageStatusColor(usageStatus);
  const statusText = getUsageStatusText(usageStatus);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const indicator = (
    <div
      className={`inline-flex items-center gap-2 ${onClick ? 'cursor-pointer hover:opacity-80' : ''} ${className}`}
      onClick={handleClick}
    >
      <div
        className={`w-3 h-3 rounded-full border-2 border-white shadow-sm`}
        style={{ backgroundColor: statusColor }}
      />
      {size !== 'small' && (
        <span className="text-sm text-gray-600">{statusText}</span>
      )}
    </div>
  );

  if (!showTooltip) {
    return indicator;
  }

  return (
    <div className="group relative inline-block">
      {indicator}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
        <div className="flex flex-col gap-1">
          <div className="font-medium">使用状态: {statusText}</div>
          {usageStatus && (
            <div className="text-gray-300">
              <div>战略设计: {usageStatus.isReferencedByStrategic ? '✓' : '✗'}</div>
              <div>战术设计: {usageStatus.isReferencedByTactical ? '✓' : '✗'}</div>
              <div>DTO管理: {usageStatus.isReferencedByDto ? '✓' : '✗'}</div>
              <div>实现映射: {usageStatus.isReferencedByImplementation ? '✓' : '✗'}</div>
              <div>屏幕定义: {usageStatus.isReferencedByScreen ? '✓' : '✗'}</div>
            </div>
          )}
          {usageStatus?.lastReferencedAt && (
            <div className="text-gray-300 text-xs">
              最后引用: {new Date(usageStatus.lastReferencedAt).toLocaleString()}
            </div>
          )}
        </div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
};

/**
 * 使用状态统计卡片组件
 */
export interface UsageStatsCardProps {
  title: string;
  total: number;
  used: number;
  unused: number;
  partiallyUsed?: number;
  className?: string;
  onClick?: () => void;
}

export const UsageStatsCard: React.FC<UsageStatsCardProps> = ({
  title,
  total,
  used,
  unused,
  partiallyUsed = 0,
  className = '',
  onClick,
}) => {
  const usedPercentage = total > 0 ? Math.round((used / total) * 100) : 0;
  const unusedPercentage = total > 0 ? Math.round((unused / total) * 100) : 0;
  const partiallyUsedPercentage = total > 0 ? Math.round((partiallyUsed / total) * 100) : 0;

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-200 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="text-2xl font-bold text-gray-700">{total}</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">已使用</span>
          <span className="text-sm font-medium text-green-600">{used} ({usedPercentage}%)</span>
        </div>
        
        {partiallyUsed > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">部分使用</span>
            <span className="text-sm font-medium text-orange-600">{partiallyUsed} ({partiallyUsedPercentage}%)</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">未使用</span>
          <span className="text-sm font-medium text-red-600">{unused} ({unusedPercentage}%)</span>
        </div>
      </div>
      
      <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
        <div className="flex h-2 rounded-full overflow-hidden">
          <div
            className="bg-green-500 h-full"
            style={{ width: `${usedPercentage}%` }}
          />
          {partiallyUsed > 0 && (
            <div
              className="bg-orange-500 h-full"
              style={{ width: `${partiallyUsedPercentage}%` }}
            />
          )}
          <div
            className="bg-red-500 h-full"
            style={{ width: `${unusedPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * 使用状态概览组件
 */
export interface UsageOverviewProps {
  usageSummary: any;
  domainId?: string;
  boundedContextId?: string;
  className?: string;
}

export const UsageOverview: React.FC<UsageOverviewProps> = ({
  usageSummary,
  domainId,
  boundedContextId,
  className = '',
}) => {
  if (!usageSummary) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        暂无使用状态数据
      </div>
    );
  }

  const { ubiquitousLanguage, strategicDesign, tacticalDesign, dtoManagement } = usageSummary;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      <UsageStatsCard
        title="统一语言"
        total={ubiquitousLanguage.totalTerms + ubiquitousLanguage.totalAttributes}
        used={ubiquitousLanguage.usedTerms + ubiquitousLanguage.usedAttributes}
        unused={(ubiquitousLanguage.totalTerms - ubiquitousLanguage.usedTerms) + (ubiquitousLanguage.totalAttributes - ubiquitousLanguage.usedAttributes)}
      />
      
      <UsageStatsCard
        title="战略设计"
        total={strategicDesign.totalContexts}
        used={strategicDesign.usedContexts}
        unused={strategicDesign.totalContexts - strategicDesign.usedContexts}
      />
      
      <UsageStatsCard
        title="战术设计"
        total={tacticalDesign.totalEntities}
        used={tacticalDesign.usedEntities}
        unused={tacticalDesign.totalEntities - tacticalDesign.usedEntities}
      />
      
      <UsageStatsCard
        title="DTO管理"
        total={dtoManagement.totalDtos}
        used={dtoManagement.usedDtos}
        unused={dtoManagement.totalDtos - dtoManagement.usedDtos}
      />
    </div>
  );
};

export default {
  UsageStatusIndicator,
  UsageStatusBadge,
  UsageStatsCard,
  UsageOverview,
};
