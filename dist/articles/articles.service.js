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
exports.ArticlesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const multer = require("multer");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const s3 = new AWS.S3();
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
let ArticlesService = class ArticlesService {
    constructor(articleModel) {
        this.articleModel = articleModel;
    }
    async createArticle(reqUser) {
        const article = new this.articleModel({
            author: reqUser._id,
            name: `untitled-${Date.now()}`,
            title: "Untitled Article",
            tags: [],
            comments: []
        });
        return article.save();
    }
    async updateArticle(reqUser, dto) {
        const article = await this.articleModel.findById(dto._id);
        const canEdit = article.author.toString() === reqUser._id.toString() || reqUser.admin;
        if (!canEdit)
            throw new common_1.UnauthorizedException("Unauthorized to edit");
        Object.assign(article, dto);
        article.updatedAt = Math.floor(Date.now() / 1000);
        return article.save();
    }
    async uploadImage(req, res) {
        const upload = multer({
            storage: multerS3({
                s3: s3,
                bucket: process.env.AWS_BUCKET_NAME,
                acl: 'public-read',
                key: function (request, file, cb) {
                    cb(null, `${Date.now().toString()}`);
                },
            }),
        }).array('upload', 1);
        return new Promise((resolve, reject) => {
            try {
                upload(req, res, function (error) {
                    if (error) {
                        reject(error);
                    }
                    resolve(req.files[0].location);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async deleteArticle(reqUser, articleId) {
        const article = await this.articleModel.findById(articleId);
        const canEdit = article.author === reqUser._id.toString() || reqUser.admin;
        if (!canEdit)
            throw new common_1.UnauthorizedException("Unauthorized to delete");
        await article.remove();
    }
    async getArticleById(articleId) {
        const article = await this.articleModel
            .findById(articleId)
            .populate('author');
        this.secureUser(article.author);
        return article;
    }
    async getArticleByName(name) {
        const article = await this.articleModel
            .findOne({ name })
            .populate('author');
        this.secureUser(article.author);
        return article;
    }
    async getAllArticles(isPublic) {
        let articles;
        if (isPublic) {
            articles = await this.articleModel
                .find({ public: true })
                .populate('author');
        }
        else {
            articles = await this.articleModel.find().populate('author');
        }
        for (const article of articles) {
            this.secureUser(article.author);
        }
        return articles;
    }
    async click(articleId) {
        await this.articleModel.findByIdAndUpdate(articleId, { $inc: { 'clicks': 1 } });
    }
    async getTopArticles(limit) {
        const recentArticles = await this.articleModel
            .find({ public: true })
            .sort({ 'createdAt': -1 })
            .limit(limit * 2)
            .populate('author');
        for (const article of recentArticles) {
            this.secureUser(article.author);
        }
        return recentArticles.sort((a, b) => b.createdAt - a.createdAt).slice(0, limit);
    }
    async getArticlesWithinTimeRange(lowerBound, upperBound) {
        const articles = await this.articleModel.find({
            public: true,
            createdAt: { $gt: lowerBound, $lt: upperBound }
        })
            .populate('author');
        for (const article of articles) {
            this.secureUser(article.author);
        }
        return articles;
    }
    async getArticlesByAuthor(userId) {
        const articles = await this.articleModel.find({
            public: true,
            author: userId
        })
            .populate('author');
        for (const article of articles) {
            this.secureUser(article.author);
        }
        return articles;
    }
    async getArticlesByTag(tag) {
        const articles = await this.articleModel.find({
            public: true,
            tags: tag
        })
            .populate('author');
        for (const article of articles) {
            this.secureUser(article.author);
        }
        return articles;
    }
    async getAllTags() {
        const result = await this.articleModel.aggregate([
            {
                "$group": {
                    "_id": 0,
                    "tags": { "$push": "$tags" }
                }
            },
            {
                "$project": {
                    "tags": {
                        "$reduce": {
                            "input": "$tags",
                            "initialValue": [],
                            "in": { "$setUnion": ["$$value", "$$this"] }
                        }
                    }
                }
            }
        ]).exec();
        return result[0].tags;
    }
    async searchArticles(query) {
        const articles = await this.articleModel
            .find({
            $text: { $search: query },
            score: { $meta: "textScore" },
            public: true
        })
            .sort({ score: { $meta: 'textScore' } })
            .populate('author');
        for (const article of articles) {
            this.secureUser(article.author);
        }
        return articles;
    }
    async postComment(dto) {
        const article = await this.articleModel.findById(dto.articleId);
        if (!article)
            throw new common_1.NotFoundException("Article not found");
        const comment = {
            name: dto.name,
            content: dto.content,
            createdAt: Math.floor(Date.now() / 1000)
        };
        article.comments.push(comment);
        article.markModified('comments');
        article.save().then();
        return comment;
    }
    async deleteComment(articleId, commentId) {
        const article = await this.articleModel.findById(articleId);
        if (!article)
            throw new common_1.NotFoundException("Article not found");
        article.comments = article.comments.filter(c => c['_id'].toString() !== commentId);
        article.markModified('comments');
        await article.save();
    }
    secureUser(user) {
        delete user.tokens;
        delete user.resetKey;
        delete user.password;
    }
};
__decorate([
    __param(0, common_1.Req()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ArticlesService.prototype, "uploadImage", null);
ArticlesService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel('Article')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ArticlesService);
exports.ArticlesService = ArticlesService;
//# sourceMappingURL=articles.service.js.map