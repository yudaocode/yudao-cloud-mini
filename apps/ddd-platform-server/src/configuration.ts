import * as crossDomain from '@midwayjs/cross-domain';
import { App, Configuration } from '@midwayjs/decorator';
import * as info from '@midwayjs/info';
import * as jwt from '@midwayjs/jwt';
import * as koa from '@midwayjs/koa';
import * as redis from '@midwayjs/redis';
import * as security from '@midwayjs/security';
import * as staticFile from '@midwayjs/static-file';
import * as swagger from '@midwayjs/swagger';
import * as typeorm from '@midwayjs/typeorm';
import * as upload from '@midwayjs/upload';
import * as validate from '@midwayjs/validate';
import { join } from 'path';

@Configuration({
  imports: [
    koa,
    validate,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
    crossDomain,
    staticFile,
    upload,
    typeorm,
    redis,
    jwt,
    swagger,
    security,
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app!: koa.Application;

  async onReady() {
    console.log('DDD Platform Server is ready!');
  }
}
