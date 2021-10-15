"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlesModule = void 0;
const common_1 = require("@nestjs/common");
const articles_service_1 = require("./articles.service");
const mongoose_1 = require("@nestjs/mongoose");
const article_schema_1 = require("./schemas/article.schema");
const config_1 = require("@nestjs/config");
const articles_controller_1 = require("./articles.controller");
const platform_express_1 = require("@nestjs/platform-express");
let ArticlesModule = class ArticlesModule {
};
ArticlesModule = __decorate([
    common_1.Module({
        imports: [
            platform_express_1.MulterModule.register({}),
            config_1.ConfigModule.forRoot(),
            mongoose_1.MongooseModule.forFeature([{ name: 'Article', schema: article_schema_1.ArticleSchema }]),
        ],
        providers: [articles_service_1.ArticlesService],
        controllers: [articles_controller_1.ArticlesController]
    })
], ArticlesModule);
exports.ArticlesModule = ArticlesModule;
//# sourceMappingURL=articles.module.js.map