import { Inject, Provide } from '@midwayjs/decorator';
import { RedisService } from '@midwayjs/redis';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { TestEntity } from '../entity/test.entity';

@Provide()
export class TestService {
  @InjectEntityModel(TestEntity)
  testModel!: Repository<TestEntity>;

  @Inject()
  dataSource!: DataSource;

  @Inject()
  redisService!: RedisService;

  async getHello() {
    return { 
      message: 'Hello from Midway.js!', 
      timestamp: Date.now(),
      server: 'DDD Platform Server',
      version: '1.0.0'
    };
  }

  async checkDatabaseConnection() {
    try {
      // 测试数据库连接：192.168.17.123:33306 (user: root, pass: root)
      const result = await this.dataSource.query('SELECT 1 as test, NOW() as current_time');
      
      // 获取数据库信息
      const dbInfo = await this.dataSource.query('SELECT VERSION() as version');
      
      // 获取连接配置（使用类型断言）
      const options = this.dataSource.options as any;
      
      return {
        status: 'success',
        message: 'MySQL数据库连接正常',
        host: `${options.host || 'unknown'}:${options.port || 'unknown'}`,
        database: options.database || 'unknown',
        version: dbInfo[0]?.version || 'unknown',
        testQuery: result[0],
        connectionOptions: {
          type: this.dataSource.options.type,
          host: options.host,
          port: options.port,
          database: options.database
        }
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: 'MySQL数据库连接失败',
        host: '192.168.17.123:33306',
        error: error.message,
        details: {
          code: error.code,
          errno: error.errno,
          sqlState: error.sqlState
        }
      };
    }
  }

  async checkRedisConnection() {
    try {
      // 测试Redis连接：192.168.17.123:16379 (pass: mfml.6603.9703)
      const testKey = `test_key_${Date.now()}`;
      const testValue = `test_value_${Date.now()}`;
      
      // 执行Redis操作测试
      await this.redisService.set(testKey, testValue, 'EX', 60);
      const retrievedValue = await this.redisService.get(testKey);
      
      // 获取Redis服务器信息
      const info = await this.redisService.info('server');
      
      // 清理测试数据
      await this.redisService.del(testKey);
      
      return {
        status: 'success',
        message: 'Redis连接正常',
        host: '192.168.17.123:16379',
        testResult: retrievedValue === testValue ? '读写测试通过' : '读写测试失败',
        testData: {
          key: testKey,
          setValue: testValue,
          getValue: retrievedValue
        },
        serverInfo: info.split('\r\n')[0] // Redis版本信息
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: 'Redis连接失败',
        host: '192.168.17.123:16379',
        error: error.message,
        details: {
          code: error.code,
          name: error.name
        }
      };
    }
  }

  async create(data: any) {
    try {
      const entity = this.testModel.create({
        name: data.name || '测试项目',
        description: data.description || '这是一个测试项目',
        type: data.type || 'TEST',
        ...data
      });
      const savedResult = await this.testModel.save(entity);
      
      // 确保我们得到的是单个实体而不是数组
      const saved = Array.isArray(savedResult) ? savedResult[0] : savedResult;
      
      // 同时测试Redis缓存
      const cacheKey = `test_entity_${saved.id}`;
      await this.redisService.set(cacheKey, JSON.stringify(saved), 'EX', 300);
      
      return saved;
    } catch (error: any) {
      throw new Error(`创建测试实体失败: ${error.message}`);
    }
  }

  async findAll(pageParams?: { pageNum: number; pageSize: number; keyword?: string; orderBy?: string; orderDir?: 'ASC' | 'DESC' }) {
    try {
      const { pageNum = 1, pageSize = 10, keyword, orderBy = 'createdAt', orderDir = 'DESC' } = pageParams || {};
      
      const queryBuilder = this.testModel.createQueryBuilder('test');
      
      // 关键字搜索
      if (keyword) {
        queryBuilder.where('test.name LIKE :keyword OR test.description LIKE :keyword', {
          keyword: `%${keyword}%`
        });
      }
      
      // 排序
      queryBuilder.orderBy(`test.${orderBy}`, orderDir);
      
      // 分页
      const offset = (pageNum - 1) * pageSize;
      queryBuilder.skip(offset).take(pageSize);
      
      const [entities, total] = await queryBuilder.getManyAndCount();
      
      return {
        list: entities,
        total,
        pageNum,
        pageSize,
        pages: Math.ceil(total / pageSize),
        timestamp: Date.now()
      };
    } catch (error: any) {
      throw new Error(`查询测试实体失败: ${error.message}`);
    }
  }
}
