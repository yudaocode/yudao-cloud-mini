// 简化的测试验证服务器
const Koa = require('koa');
const mysql = require('mysql2/promise');
const Redis = require('redis');

const app = new Koa();

// 全局错误处理
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error('Request Error:', err);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: err.message,
      error: err.toString()
    };
  }
});

// 基础路由处理
app.use(async (ctx, next) => {
  console.log(`[${new Date().toISOString()}] ${ctx.method} ${ctx.url}`);
  
  if (ctx.path === '/ping') {
    ctx.body = { 
      code: 200, 
      message: 'pong', 
      timestamp: Date.now(),
      server: 'DDD Platform Validation Server'
    };
    return;
  }
  
  if (ctx.path === '/api/test/hello') {
    ctx.body = {
      code: 200,
      message: '成功',
      data: {
        message: 'Hello from DDD Platform!',
        timestamp: Date.now(),
        server: 'Simple Validation Server',
        version: '1.0.0'
      }
    };
    return;
  }
  
  if (ctx.path === '/api/test/db-check') {
    try {
      // 测试MySQL数据库连接：192.168.17.123:33306
      const connection = await mysql.createConnection({
        host: '192.168.17.123',
        port: 33306,
        user: 'root',
        password: 'root',
        database: 'ddd_platform',
        connectTimeout: 10000,
        acquireTimeout: 10000,
        timeout: 10000
      });
      console.log('MySQL数据库连接成功！');
      const [rows] = await connection.execute('SELECT 1 as test, NOW() as `current_time`');
      console.log('MySQL数据库查询成功！');
      const [version] = await connection.execute('SELECT VERSION() as version');
      console.log('MySQL数据库版本：', version[0]?.version);
      await connection.end();
      
      ctx.body = {
        code: 200,
        message: '数据库连接检查完成',
        data: {
          status: 'success',
          message: 'MySQL数据库连接正常',
          host: '192.168.17.123:33306',
          database: 'ddd_platform',
          version: version[0]?.version || 'unknown',
          testQuery: rows[0]
        }
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        message: '数据库连接检查失败',
        data: {
          status: 'error',
          message: 'MySQL数据库连接失败',
          host: '192.168.17.123:33306',
          error: error.message,
          code: error.code,
          errno: error.errno
        }
      };
    }
    return;
  }
  
  if (ctx.path === '/api/test/redis-check') {
    let redisClient = null;
    try {
      // 测试Redis连接：192.168.17.123:16379
      console.log('尝试连接Redis服务器...');
      console.log('Host: 192.168.17.123:16379');
      console.log('Password: mfml.6603.1400');
      
      // 尝试多种连接方式
      const connectionConfigs = [
        // 配置1：带密码
        {
          socket: {
            host: '192.168.17.123',
            port: 16379,
            connectTimeout: 10000,
            commandTimeout: 10000
          },
          password: 'mfml.6603.1400'
        },
        // 配置2：不带密码
        {
          socket: {
            host: '192.168.17.123',
            port: 16379,
            connectTimeout: 10000,
            commandTimeout: 10000
          }
        }
      ];
      
      let connectionError = null;
      let connected = false;
      
      for (let i = 0; i < connectionConfigs.length && !connected; i++) {
        try {
          console.log(`尝试连接配置 ${i + 1}/${connectionConfigs.length}...`);
          
          redisClient = Redis.createClient(connectionConfigs[i]);
          
          redisClient.on('error', (err) => {
            console.error(`Redis Client Error (配置${i + 1}):`, err.message);
            connectionError = err;
          });
          
          await redisClient.connect();
          connected = true;
          console.log(`Redis连接成功！使用配置 ${i + 1}`);
          break;
          
        } catch (error) {
          console.error(`配置 ${i + 1} 连接失败:`, error.message);
          connectionError = error;
          if (redisClient) {
            try {
              await redisClient.quit();
            } catch (quitError) {
              console.error('关闭Redis客户端失败:', quitError.message);
            }
            redisClient = null;
          }
        }
      }
      
      if (!connected) {
        throw connectionError || new Error('所有连接配置都失败');
      }
      
      const testKey = `test_key_${Date.now()}`;
      const testValue = `test_value_${Date.now()}`;
      
      await redisClient.setEx(testKey, 60, testValue);
      const retrievedValue = await redisClient.get(testKey);
      await redisClient.del(testKey);
      
      const info = await redisClient.info('server');
      
      await redisClient.quit();
      
      ctx.body = {
        code: 200,
        message: 'Redis连接检查完成',
        data: {
          status: 'success',
          message: 'Redis连接正常',
          host: '192.168.17.123:16379',
          testResult: retrievedValue === testValue ? '读写测试通过' : '读写测试失败',
          testData: {
            key: testKey,
            setValue: testValue,
            getValue: retrievedValue
          },
          serverInfo: info.split('\r\n')[0]
        }
      };
    } catch (error) {
      console.error('Redis连接最终失败:', error.message);
      
      // 确保清理资源
      if (redisClient) {
        try {
          await redisClient.quit();
        } catch (quitError) {
          console.error('关闭Redis客户端失败:', quitError.message);
        }
      }
      
      ctx.body = {
        code: 500,
        message: 'Redis连接检查失败',
        data: {
          status: 'error',
          message: 'Redis连接失败',
          host: '192.168.17.123:16379',
          error: error.message,
          errorType: error.name || 'Unknown',
          suggestions: [
            '请检查Redis服务器是否正在运行',
            '请验证Redis密码是否正确',
            '请检查网络连接是否正常',
            '请确认Redis服务器地址和端口'
          ]
        }
      };
    }
    return;
  }
  
  await next();
});

// 404处理
app.use(async (ctx) => {
  ctx.status = 404;
  ctx.body = {
    code: 404,
    message: 'API not found',
    path: ctx.path,
    availableEndpoints: [
      'GET /ping',
      'GET /api/test/hello',
      'GET /api/test/db-check',
      'GET /api/test/redis-check'
    ]
  };
});

const PORT = 8100;

app.listen(PORT, () => {
  console.log('🚀 DDD平台技术验证服务器启动成功！');
  console.log(`🌐 服务地址: http://localhost:${PORT}`);
  console.log('📋 可用接口:');
  console.log('  - GET /ping (健康检查)');
  console.log('  - GET /api/test/hello (基础测试)');
  console.log('  - GET /api/test/db-check (数据库连接验证)');
  console.log('  - GET /api/test/redis-check (Redis连接验证)');
  console.log('');
  console.log('开始技术验证...');
});
