-- 创建DDD平台数据库
CREATE DATABASE IF NOT EXISTS `ddd_platform` DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `ddd_platform`;

-- 测试实体表
CREATE TABLE IF NOT EXISTS `test_entities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '名称',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT '描述',
  `type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'TEST' COMMENT '类型',
  `metadata` json DEFAULT NULL COMMENT '元数据',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_created_at` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='测试实体表';

-- 插入测试数据
INSERT INTO `test_entities` (`name`, `description`, `type`) VALUES
('技术验证项目', 'Midway.js和MySQL连接测试', 'VALIDATION'),
('Redis测试项目', 'Redis连接和缓存功能测试', 'CACHE_TEST'),
('AMIS集成项目', 'AMIS前端组件集成测试', 'FRONTEND_TEST');
