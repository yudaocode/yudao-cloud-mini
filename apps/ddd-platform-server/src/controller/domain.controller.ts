import {
    Body,
    Controller,
    Del,
    Get,
    Inject,
    Param,
    Post,
    Put,
    Query,
} from '@midwayjs/core';
import { Domain } from '../entity/domain.entity';
import { DomainService } from '../service/domain.service';

@Controller('/api/domains')
export class DomainController {
  @Inject()
  domainService: DomainService;

  @Post('/')
  async createDomain(@Body() domainData: Partial<Domain>) {
    try {
      const domain = await this.domainService.createDomain(domainData);
      return {
        success: true,
        code: 200,
        message: '域创建成功',
        data: domain,
      };
    } catch (error) {
      return {
        success: false,
        code: 500,
        message: '域创建失败',
        error: error.message,
      };
    }
  }

  @Get('/')
  async getDomains(@Query('projectId') projectId: number) {
    try {
      const domains = await this.domainService.getDomains(projectId);
      return {
        success: true,
        code: 200,
        message: '获取域列表成功',
        data: domains,
      };
    } catch (error) {
      return {
        success: false,
        code: 500,
        message: '获取域列表失败',
        error: error.message,
      };
    }
  }

  @Get('/:id')
  async getDomain(@Param('id') id: number) {
    try {
      const domain = await this.domainService.getDomainById(id);
      if (!domain) {
        return {
          success: false,
          code: 404,
          message: '域不存在',
        };
      }
      return {
        success: true,
        code: 200,
        message: '获取域详情成功',
        data: domain,
      };
    } catch (error) {
      return {
        success: false,
        code: 500,
        message: '获取域详情失败',
        error: error.message,
      };
    }
  }

  @Put('/:id')
  async updateDomain(
    @Param('id') id: number,
    @Body() updateData: Partial<Domain>
  ) {
    try {
      const domain = await this.domainService.updateDomain(id, updateData);
      return {
        success: true,
        code: 200,
        message: '域更新成功',
        data: domain,
      };
    } catch (error) {
      return {
        success: false,
        code: 500,
        message: '域更新失败',
        error: error.message,
      };
    }
  }

  @Del('/:id')
  async deleteDomain(@Param('id') id: number) {
    try {
      const result = await this.domainService.deleteDomain(id);
      if (!result) {
        return {
          success: false,
          code: 404,
          message: '域不存在或删除失败',
        };
      }
      return {
        success: true,
        code: 200,
        message: '域删除成功',
      };
    } catch (error) {
      return {
        success: false,
        code: 500,
        message: '域删除失败',
        error: error.message,
      };
    }
  }
}
