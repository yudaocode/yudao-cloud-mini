const { Bootstrap } = require('@midwayjs/bootstrap');

console.log('🚀 Starting DDD Platform Server...');

// 设置环境变量
if (!process.env.MIDWAY_SERVER_TYPE) {
  process.env.MIDWAY_SERVER_TYPE = 'koa';
}

// 启动应用
Bootstrap.run().then(() => {
  console.log('✅ DDD Platform Server started successfully!');
}).catch(err => {
  console.error('❌ DDD Platform Server startup failed:', err);
  process.exit(1);
});
