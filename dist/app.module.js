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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const app_service_1 = require("./app.service");
const users_module_1 = require("./users/users.module");
const email_module_1 = require("./email/email.module");
const articles_module_1 = require("./articles/articles.module");
const subs_module_1 = require("./subs/subs.module");
const article_schema_1 = require("./articles/schemas/article.schema");
const user_schema_1 = require("./users/schemas/user.schema");
const sub_schema_1 = require("./subs/schemas/sub.schema");
const mongoose_2 = require("mongoose");
let AppModule = class AppModule {
    constructor(userModel, articleModel, subModel) {
        this.userModel = userModel;
        this.articleModel = articleModel;
        this.subModel = subModel;
    }
    onModuleInit() {
    }
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            config_1.ConfigModule.forRoot(),
            mongoose_1.MongooseModule.forRoot(process.env.DB, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            }),
            mongoose_1.MongooseModule.forFeature([
                { name: 'Article', schema: article_schema_1.ArticleSchema },
                { name: 'User', schema: user_schema_1.UserSchema },
                { name: 'Sub', schema: sub_schema_1.SubSchema }
            ]),
            users_module_1.UsersModule,
            email_module_1.EmailModule,
            articles_module_1.ArticlesModule,
            subs_module_1.SubsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    }),
    __param(0, mongoose_1.InjectModel('User')),
    __param(1, mongoose_1.InjectModel('Article')),
    __param(2, mongoose_1.InjectModel('Sub')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map