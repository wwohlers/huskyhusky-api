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
exports.ArticlesController = void 0;
const common_1 = require("@nestjs/common");
const articles_service_1 = require("./articles.service");
const is_user_guard_1 = require("../users/guards/is-user.guard");
const is_admin_guard_1 = require("../users/guards/is-admin.guard");
let ArticlesController = class ArticlesController {
    constructor(articlesService) {
        this.articlesService = articlesService;
    }
    async createArticle(req) {
        return this.articlesService.createArticle(req.user);
    }
    async updateArticle(req, dto) {
        return this.articlesService.updateArticle(req.user, dto);
    }
    async deleteArticle(req, params) {
        return this.articlesService.deleteArticle(req.user, params.id);
    }
    async uploadImage(req, res) {
        const uri = await this.articlesService.uploadImage(req, res);
        res.send(uri);
    }
    async getArticle(params) {
        return this.articlesService.getArticleById(params.id);
    }
    async getArticleByName(dto) {
        return this.articlesService.getArticleByName(dto.value);
    }
    async getArticles(req, params) {
        if (params.public !== 'true' && !req.user) {
            throw new common_1.UnauthorizedException("Cannot retrieve not public articles without authentication");
        }
        return this.articlesService.getAllArticles(params.public === 'true');
    }
    async clickArticle(params) {
        return this.articlesService.click(params.id);
    }
    async getTopArticles(params) {
        return this.articlesService.getTopArticles(params.limit);
    }
    async getTimeRange(params) {
        return this.articlesService.getArticlesWithinTimeRange(params.lower, params.upper);
    }
    async getArticlesByAuthor(params) {
        return this.articlesService.getArticlesByAuthor(params.id);
    }
    async getArticlesByTag(params) {
        return this.articlesService.getArticlesByTag(params.name);
    }
    async getAllTags() {
        return this.articlesService.getAllTags();
    }
    async searchArticles(dto) {
        return this.articlesService.searchArticles(dto.value);
    }
    async postComment(dto) {
        return this.articlesService.postComment(dto);
    }
    async deleteComment(params) {
        return this.articlesService.deleteComment(params.article, params.comment);
    }
};
__decorate([
    common_1.UseGuards(is_user_guard_1.IsUserGuard),
    common_1.Post(),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "createArticle", null);
__decorate([
    common_1.UseGuards(is_user_guard_1.IsUserGuard),
    common_1.Patch(),
    __param(0, common_1.Req()),
    __param(1, common_1.Body(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "updateArticle", null);
__decorate([
    common_1.UseGuards(is_user_guard_1.IsUserGuard),
    common_1.Delete('/:id'),
    __param(0, common_1.Req()),
    __param(1, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "deleteArticle", null);
__decorate([
    common_1.UseGuards(is_user_guard_1.IsUserGuard),
    common_1.Post('/upload'),
    __param(0, common_1.Req()),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "uploadImage", null);
__decorate([
    common_1.Get('/:id'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "getArticle", null);
__decorate([
    common_1.Post('/by-name'),
    __param(0, common_1.Body(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "getArticleByName", null);
__decorate([
    common_1.Get('/all/:public'),
    __param(0, common_1.Req()),
    __param(1, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "getArticles", null);
__decorate([
    common_1.Post('/click/:id'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "clickArticle", null);
__decorate([
    common_1.Get('/top/:limit'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "getTopArticles", null);
__decorate([
    common_1.Get('/range/:lower/:upper'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "getTimeRange", null);
__decorate([
    common_1.Get('/author/:id'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "getArticlesByAuthor", null);
__decorate([
    common_1.Get('/tag/:name'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "getArticlesByTag", null);
__decorate([
    common_1.Get('/tags/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "getAllTags", null);
__decorate([
    common_1.Post('/search'),
    __param(0, common_1.Body(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "searchArticles", null);
__decorate([
    common_1.Post('/comment'),
    __param(0, common_1.Body(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "postComment", null);
__decorate([
    common_1.UseGuards(is_admin_guard_1.IsAdminGuard),
    common_1.Delete('/comment/:article/:comment'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "deleteComment", null);
ArticlesController = __decorate([
    common_1.Controller('articles'),
    __metadata("design:paramtypes", [articles_service_1.ArticlesService])
], ArticlesController);
exports.ArticlesController = ArticlesController;
//# sourceMappingURL=articles.controller.js.map