// 技术验证测试脚本
const http = require('http');

function makeRequest(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 8100,
            path: path,
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    data: data
                });
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.end();
    });
}

async function runValidationTests() {
    console.log('🚀 开始DDD平台技术验证测试...\n');

    try {
        // 1. 基础健康检查
        console.log('1. 测试服务器健康状态...');
        const pingResult = await makeRequest('/ping');
        console.log(`   状态码: ${pingResult.statusCode}`);
        console.log(`   响应: ${pingResult.data}\n`);

        // 2. Hello接口测试
        console.log('2. 测试Hello接口...');
        const helloResult = await makeRequest('/api/test/hello');
        console.log(`   状态码: ${helloResult.statusCode}`);
        console.log(`   响应: ${helloResult.data}\n`);

        // 3. 数据库连接测试 (关键验证)
        console.log('3. 测试MySQL数据库连接 (192.168.17.123:33306)...');
        const dbResult = await makeRequest('/api/test/db-check');
        console.log(`   状态码: ${dbResult.statusCode}`);
        console.log(`   响应: ${dbResult.data}\n`);

        // 4. Redis连接测试 (关键验证)
        console.log('4. 测试Redis连接 (192.168.17.123:16379)...');
        const redisResult = await makeRequest('/api/test/redis-check');
        console.log(`   状态码: ${redisResult.statusCode}`);
        console.log(`   响应: ${redisResult.data}\n`);

        console.log('✅ 技术验证测试完成！');

    } catch (error) {
        console.error('❌ 测试过程中出现错误:', error.message);
    }
}

// 运行测试
runValidationTests();
