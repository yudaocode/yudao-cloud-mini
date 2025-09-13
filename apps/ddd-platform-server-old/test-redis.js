// Redis连接测试脚本
const http = require('http');

function testRedisConnection() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 8100,
            path: '/api/test/redis-check',
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
                    data: JSON.parse(data)
                });
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.setTimeout(30000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.end();
    });
}

async function runRedisTest() {
    console.log('🔍 开始Redis连接验证...');
    console.log('📍 目标地址: 192.168.17.123:16379');
    console.log('🔑 密码: mfml.6603.9703\n');

    try {
        const result = await testRedisConnection();
        
        console.log('📊 测试结果:');
        console.log(`   HTTP状态码: ${result.statusCode}`);
        console.log(`   响应代码: ${result.data.code}`);
        console.log(`   消息: ${result.data.message}`);
        
        if (result.data.data) {
            console.log('\n📋 详细信息:');
            console.log(`   状态: ${result.data.data.status}`);
            console.log(`   主机: ${result.data.data.host || 'N/A'}`);
            console.log(`   消息: ${result.data.data.message || 'N/A'}`);
            
            if (result.data.data.testResult) {
                console.log(`   读写测试: ${result.data.data.testResult}`);
            }
            
            if (result.data.data.error) {
                console.log(`   错误信息: ${result.data.data.error}`);
            }
        }
        
        if (result.statusCode === 200 && result.data.code === 200) {
            console.log('\n✅ Redis连接验证成功！');
        } else {
            console.log('\n❌ Redis连接验证失败！');
        }

    } catch (error) {
        console.error('\n❌ Redis连接测试过程中出现错误:', error.message);
    }
}

// 运行测试
runRedisTest();
