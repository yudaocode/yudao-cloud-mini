import { BaseController } from '../common/base.controller';
import { ApiResponse } from '../common/response';
import { TestService } from '../service/test.service';
export declare class TestController extends BaseController {
    testService: TestService;
    hello(): Promise<ApiResponse>;
    checkDatabase(): Promise<ApiResponse>;
    checkRedis(): Promise<ApiResponse>;
    health(): Promise<ApiResponse>;
    create(body: any): Promise<ApiResponse>;
    list(): Promise<ApiResponse>;
}
