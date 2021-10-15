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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const is_user_guard_1 = require("./guards/is-user.guard");
const is_admin_guard_1 = require("./guards/is-admin.guard");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async createUser(dto) {
        return this.usersService.createUser(dto);
    }
    async signIn(dto) {
        return this.usersService.signIn(dto);
    }
    async signOut(req) {
        return this.usersService.signOut(req.user, req.token);
    }
    async me(req) {
        return req.user;
    }
    async updatePassword(req, dto) {
        return this.usersService.updateUserPassword(req.user, dto);
    }
    async resetPassword(dto) {
        return this.usersService.resetUserPassword(dto);
    }
    async getAll(req) {
        if (req.user && req.user.admin) {
            return this.usersService.getAllUsers(false);
        }
        else {
            return this.usersService.getAllUsers(true);
        }
    }
    async getUserById(params) {
        return this.usersService.getUserById(params.id);
    }
    async setAdmin(params, dto) {
        return this.usersService.setAdmin(params.id, dto.value);
    }
    async setEmail(req, dto) {
        return this.usersService.setEmail(req.user, dto.value);
    }
    async setBio(req, dto) {
        return this.usersService.setBio(req.user, dto.value);
    }
    async setRemoved(params, dto) {
        return this.usersService.setRemoved(params.id, dto.value);
    }
    async requestPasswordReset(dto) {
        return this.usersService.requestPasswordReset(dto.value);
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
__decorate([
    common_1.Post('/signin'),
    __param(0, common_1.Body(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "signIn", null);
__decorate([
    common_1.UseGuards(is_user_guard_1.IsUserGuard),
    common_1.Post('/signout'),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "signOut", null);
__decorate([
    common_1.UseGuards(is_user_guard_1.IsUserGuard),
    common_1.Get('/me'),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "me", null);
__decorate([
    common_1.UseGuards(is_user_guard_1.IsUserGuard),
    common_1.Post('/update-password'),
    __param(0, common_1.Req()),
    __param(1, common_1.Body(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updatePassword", null);
__decorate([
    common_1.Post('/reset-password'),
    __param(0, common_1.Body(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "resetPassword", null);
__decorate([
    common_1.Get(),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAll", null);
__decorate([
    common_1.Get('/by-id/:id'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserById", null);
__decorate([
    common_1.UseGuards(is_admin_guard_1.IsAdminGuard),
    common_1.Patch('/admin/:id'),
    __param(0, common_1.Param()),
    __param(1, common_1.Body(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "setAdmin", null);
__decorate([
    common_1.UseGuards(is_user_guard_1.IsUserGuard),
    common_1.Patch('/email'),
    __param(0, common_1.Req()),
    __param(1, common_1.Body(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "setEmail", null);
__decorate([
    common_1.UseGuards(is_user_guard_1.IsUserGuard),
    common_1.Patch('/bio'),
    __param(0, common_1.Req()),
    __param(1, common_1.Body(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "setBio", null);
__decorate([
    common_1.UseGuards(is_admin_guard_1.IsAdminGuard),
    common_1.Patch('/removed/:id'),
    __param(0, common_1.Param()),
    __param(1, common_1.Body(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "setRemoved", null);
__decorate([
    common_1.Post('/request-reset-password'),
    __param(0, common_1.Body(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "requestPasswordReset", null);
UsersController = __decorate([
    common_1.Controller('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map