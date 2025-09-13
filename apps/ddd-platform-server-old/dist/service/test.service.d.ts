import { RedisService } from '@midwayjs/redis';
import { DataSource, Repository } from 'typeorm';
import { TestEntity } from '../entity/test.entity';
export declare class TestService {
    testModel: Repository<TestEntity>;
    dataSource: DataSource;
    redisService: RedisService;
    getHello(): Promise<{
        message: string;
        timestamp: number;
        server: string;
        version: string;
    }>;
    checkDatabaseConnection(): Promise<{
        status: string;
        message: string;
        host: string;
        database: any;
        version: any;
        testQuery: any;
        connectionOptions: {
            type: "mysql" | "mariadb" | "postgres" | "cockroachdb" | "sqlite" | "mssql" | "sap" | "oracle" | "cordova" | "nativescript" | "react-native" | "sqljs" | "mongodb" | "aurora-mysql" | "aurora-postgres" | "expo" | "better-sqlite3" | "capacitor" | "spanner";
            host: any;
            port: any;
            database: any;
        };
        error?: undefined;
        details?: undefined;
    } | {
        status: string;
        message: string;
        host: string;
        error: any;
        details: {
            code: any;
            errno: any;
            sqlState: any;
        };
        database?: undefined;
        version?: undefined;
        testQuery?: undefined;
        connectionOptions?: undefined;
    }>;
    checkRedisConnection(): Promise<{
        status: string;
        message: string;
        host: string;
        testResult: string;
        testData: {
            key: string;
            setValue: string;
            getValue: string | null;
        };
        serverInfo: string;
        error?: undefined;
        details?: undefined;
    } | {
        status: string;
        message: string;
        host: string;
        error: any;
        details: {
            code: any;
            name: any;
        };
        testResult?: undefined;
        testData?: undefined;
        serverInfo?: undefined;
    }>;
    create(data: any): Promise<TestEntity>;
    findAll(pageParams?: {
        pageNum: number;
        pageSize: number;
        keyword?: string;
        orderBy?: string;
        orderDir?: 'ASC' | 'DESC';
    }): Promise<{
        list: TestEntity[];
        total: number;
        pageNum: number;
        pageSize: number;
        pages: number;
        timestamp: number;
    }>;
}
