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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubsController = void 0;
const common_1 = require("@nestjs/common");
const subs_service_1 = require("./subs.service");
const is_admin_guard_1 = require("../users/guards/is-admin.guard");
let SubsController = class SubsController {
    constructor(subsService) {
        this.subsService = subsService;
    }
    async subscribe(dto) {
        return this.subsService.createSub(dto.value);
    }
    async unsubscribe(dto) {
        return this.subsService.removeSub(dto.value);
    }
    async getAllSubs() {
        return this.subsService.getAllSubs();
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubsController.prototype, "subscribe", null);
__decorate([
    common_1.Delete(),
    __param(0, common_1.Body(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubsController.prototype, "unsubscribe", null);
__decorate([
    common_1.UseGuards(is_admin_guard_1.IsAdminGuard),
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubsController.prototype, "getAllSubs", null);
SubsController = __decorate([
    common_1.Controller('subs'),
    __metadata("design:paramtypes", [subs_service_1.SubsService])
], SubsController);
exports.SubsController = SubsController;
//# sourceMappingURL=subs.controller.js.map