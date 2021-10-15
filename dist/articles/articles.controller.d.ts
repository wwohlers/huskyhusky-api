import { ArticlesService } from './articles.service';
import { AuthorizedRequest } from '../users/interfaces/authorized-request.interface';
import { UpdateArticleDto } from '../dto/update-article';
import { SingleStringDto } from '../dto/single-string.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';
export declare class ArticlesController {
    private articlesService;
    constructor(articlesService: ArticlesService);
    createArticle(req: AuthorizedRequest): Promise<import("./interfaces/article.interface").Article>;
    updateArticle(req: AuthorizedRequest, dto: UpdateArticleDto): Promise<import("./interfaces/article.interface").Article>;
    deleteArticle(req: AuthorizedRequest, params: any): Promise<void>;
    uploadImage(req: any, res: any): Promise<void>;
    getArticle(params: any): Promise<import("./interfaces/article.interface").Article>;
    getArticleByName(dto: SingleStringDto): Promise<import("./interfaces/article.interface").Article>;
    getArticles(req: any, params: any): Promise<import("./interfaces/article.interface").Article[]>;
    clickArticle(params: any): Promise<void>;
    getTopArticles(params: any): Promise<import("./interfaces/article.interface").Article[]>;
    getTimeRange(params: any): Promise<import("./interfaces/article.interface").Article[]>;
    getArticlesByAuthor(params: any): Promise<import("./interfaces/article.interface").Article[]>;
    getArticlesByTag(params: any): Promise<import("./interfaces/article.interface").Article[]>;
    getAllTags(): Promise<string[]>;
    searchArticles(dto: SingleStringDto): Promise<import("./interfaces/article.interface").Article[]>;
    postComment(dto: CreateCommentDto): Promise<import("./interfaces/comment.interface").Comment>;
    deleteComment(params: any): Promise<void>;
}
