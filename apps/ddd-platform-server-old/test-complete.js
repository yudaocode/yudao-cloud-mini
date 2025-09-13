// 详细的Redis连接测试和调试脚本
const http = require('http');

function makeRequest(path, timeout = 30000) {
    return new Promise((resolve, reject) => {
        console.log(`发送请求到: http://localhost:8100${path}`);
        
        const options = {
            hostname: 'localhost',
            port: 8100,
            path: path,
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            console.log(`收到响应，状态码: ${res.statusCode}`);
            
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    resolve({
                        statusCode: res.statusCode,
                        data: parsedData,
                        rawData: data
                    });
                } catch (parseError) {
                    resolve({
                        statusCode: res.statusCode,
                        data: null,
                        rawData: data,
                        parseError: parseError.message
                    });
                }
            });
        });

        req.on('error', (err) => {
            console.error('请求错误:', err.message);
            reject(err);
        });

        req.setTimeout(timeout, () => {
            console.error(`请求超时 (${timeout}ms)`);
            req.destroy();
            reject(new Error(`Request timeout after ${timeout}ms`));
        });

        req.end();
    });
}

async function testAllEndpoints() {
    console.log('🚀 开始完整的技术验证测试...\n');

    // 1. 基础健康检查
    try {
        console.log('1️⃣ 测试基础健康检查...');
        const pingResult = await makeRequest('/ping', 5000);
        console.log(`   ✅ Ping测试成功: ${pingResult.statusCode}`);
        console.log(`   📄 响应: ${JSON.stringify(pingResult.data, null, 2)}\n`);
    } catch (error) {
        console.log(`   ❌ Ping测试失败: ${error.message}\n`);
        return; // 如果基础检查失败，不继续测试
    }

    // 2. Hello接口测试
    try {
        console.log('2️⃣ 测试Hello接口...');
        const helloResult = await makeRequest('/api/test/hello', 5000);
        console.log(`   ✅ Hello测试成功: ${helloResult.statusCode}`);
        console.log(`   📄 响应: ${JSON.stringify(helloResult.data, null, 2)}\n`);
    } catch (error) {
        console.log(`   ❌ Hello测试失败: ${error.message}\n`);
    }

    // 3. 数据库连接测试
    try {
        console.log('3️⃣ 测试MySQL数据库连接 (192.168.17.123:33306)...');
        const dbResult = await makeRequest('/api/test/db-check', 15000);
        console.log(`   状态码: ${dbResult.statusCode}`);
        if (dbResult.data) {
            console.log(`   💾 数据库测试结果:`);
            console.log(`      - 状态: ${dbResult.data.data?.status || 'unknown'}`);
            console.log(`      - 消息: ${dbResult.data.message}`);
            if (dbResult.data.data?.version) {
                console.log(`      - 版本: ${dbResult.data.data.version}`);
            }
            if (dbResult.data.data?.error) {
                console.log(`      - 错误: ${dbResult.data.data.error}`);
            }
        }
        console.log('');
    } catch (error) {
        console.log(`   ❌ 数据库测试失败: ${error.message}\n`);
    }

    // 4. Redis连接测试（重点）
    try {
        console.log('4️⃣ 测试Redis连接 (192.168.17.123:16379)...');
        console.log('   🔄 正在连接Redis服务器...');
        
        const redisResult = await makeRequest('/api/test/redis-check', 30000);
        console.log(`   状态码: ${redisResult.statusCode}`);
        
        if (redisResult.data) {
            console.log(`   🔴 Redis测试结果:`);
            console.log(`      - 状态: ${redisResult.data.data?.status || 'unknown'}`);
            console.log(`      - 消息: ${redisResult.data.message}`);
            console.log(`      - 主机: ${redisResult.data.data?.host || 'N/A'}`);
            
            if (redisResult.data.data?.testResult) {
                console.log(`      - 读写测试: ${redisResult.data.data.testResult}`);
            }
            
            if (redisResult.data.data?.error) {
                console.log(`      - 错误详情: ${redisResult.data.data.error}`);
            }
            
            if (redisResult.data.data?.serverInfo) {
                console.log(`      - 服务器信息: ${redisResult.data.data.serverInfo}`);
            }
        } else {
            console.log(`   📄 原始响应: ${redisResult.rawData}`);
            if (redisResult.parseError) {
                console.log(`   ⚠️ 解析错误: ${redisResult.parseError}`);
            }
        }
        console.log('');
        
    } catch (error) {
        console.log(`   ❌ Redis测试失败: ${error.message}\n`);
    }

    console.log('🏁 技术验证测试完成！');
}

// 运行完整测试
testAllEndpoints().catch(console.error);
