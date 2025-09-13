import { Controller, Get } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 静态文件控制器
 * 提供HTML页面和静态资源服务
 */
@Controller('/static')
export class StaticController {
  /**
   * 提供主应用页面
   */
  @Get('/app')
  async getAppPage(ctx: Context) {
    try {
      const htmlPath = path.join(__dirname, '../public/app.html');
      console.log('Looking for app.html at:', htmlPath);
      console.log('File exists:', fs.existsSync(htmlPath));
      
      if (!fs.existsSync(htmlPath)) {
        // 尝试其他可能的路径
        const alternatePath = path.join(process.cwd(), 'src/public/app.html');
        console.log('Trying alternate path:', alternatePath);
        
        if (fs.existsSync(alternatePath)) {
          const htmlContent = fs.readFileSync(alternatePath, 'utf-8');
          ctx.type = 'text/html';
          ctx.body = htmlContent;
          return;
        }
        
        ctx.status = 404;
        ctx.body = `主应用页面未找到。尝试路径: ${htmlPath}, 备用路径: ${alternatePath}`;
        return;
      }
      
      const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
      
      ctx.type = 'text/html';
      ctx.body = htmlContent;
    } catch (error) {
      ctx.status = 500;
      ctx.body = `加载主应用页面失败: ${error.message}`;
    }
  }

  /**
   * 根路径重定向到主应用
   */
  @Get('/')
  async redirectToApp(ctx: Context) {
    ctx.redirect('/static/app');
  }

  /**
   * 提供AMIS测试页面
   */
  @Get('/amis-test')
  async getAmisTestPage(ctx: Context) {
    try {
      const htmlPath = path.join(__dirname, '../public/amis-test.html');
      
      if (!fs.existsSync(htmlPath)) {
        ctx.status = 404;
        ctx.body = 'AMIS测试页面未找到';
        return;
      }
      
      const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
      
      ctx.type = 'text/html';
      ctx.body = htmlContent;
    } catch (error) {
      ctx.status = 500;
      ctx.body = `加载页面失败: ${error.message}`;
    }
  }

  /**
   * 重定向到AMIS测试页面
   */
  @Get('/test')
  async redirectToTest(ctx: Context) {
    ctx.redirect('/static/amis-test');
  }
}
