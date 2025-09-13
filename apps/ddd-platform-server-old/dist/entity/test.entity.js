"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestEntity = void 0;
const typeorm_1 = require("typeorm");
let TestEntity = class TestEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TestEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200, comment: '名称' }),
    __metadata("design:type", String)
], TestEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, comment: '描述' }),
    __metadata("design:type", String)
], TestEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, default: 'TEST', comment: '类型' }),
    __metadata("design:type", String)
], TestEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true, comment: '元数据' }),
    __metadata("design:type", Object)
], TestEntity.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ comment: '创建时间' }),
    __metadata("design:type", Date)
], TestEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ comment: '更新时间' }),
    __metadata("design:type", Date)
], TestEntity.prototype, "updatedAt", void 0);
TestEntity = __decorate([
    (0, typeorm_1.Entity)('test_entities')
], TestEntity);
exports.TestEntity = TestEntity;
