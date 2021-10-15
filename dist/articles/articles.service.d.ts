import { Model } from 'mongoose';
import { Article } from './interfaces/article.interface';
import { UpdateArticleDto } from '../dto/update-article';
import { User } from '../users/interfaces/user.interface';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { Comment } from './interfaces/comment.interface';
export declare class ArticlesService {
    private articleModel;
    constructor(articleModel: Model<Article>);
    createArticle(reqUser: User): Promise<Article>;
    updateArticle(reqUser: User, dto: UpdateArticleDto): Promise<Article>;
    uploadImage(req: any, res: any): Promise<string>;
    deleteArticle(reqUser: User, articleId: string): Promise<void>;
    getArticleById(articleId: string): Promise<Article>;
    getArticleByName(name: string): Promise<Article>;
    getAllArticles(isPublic: boolean): Promise<Article[]>;
    click(articleId: string): Promise<void>;
    getTopArticles(limit: number): Promise<Article[]>;
    getArticlesWithinTimeRange(lowerBound: number, upperBound: number): Promise<Article[]>;
    getArticlesByAuthor(userId: string): Promise<Article[]>;
    getArticlesByTag(tag: string): Promise<Article[]>;
    getAllTags(): Promise<string[]>;
    searchArticles(query: string): Promise<Article[]>;
    postComment(dto: CreateCommentDto): Promise<Comment>;
    deleteComment(articleId: string, commentId: string): Promise<void>;
    private secureUser;
}
