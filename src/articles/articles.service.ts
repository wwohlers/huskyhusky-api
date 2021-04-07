import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from './interfaces/article.interface';
import { UpdateArticleDto } from '../dto/update-article';
import { User } from '../users/interfaces/user.interface';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { Comment } from './interfaces/comment.interface';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';

const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel('Article') private articleModel: Model<Article>
  ) {}

  /**
   * Create a new empty Article.
   * @param userId author of the article
   */
  async createArticle(reqUser: User): Promise<Article> {
    const article = new this.articleModel({
      author: reqUser._id,
      name: `untitled-${Date.now()}`,
      title: "Untitled Article",
      tags: [],
      comments: []
    });
    return article.save();
  }

  /**
   * Updates an Article.
   * @param reqUser requesting user
   * @param dto all article data to update to
   */
  async updateArticle(reqUser: User, dto: UpdateArticleDto): Promise<Article> {
    const article = await this.articleModel.findById(dto._id);
    const canEdit = article.author.toString() === reqUser._id.toString() || reqUser.admin;
    if (!canEdit) throw new UnauthorizedException("Unauthorized to edit");

    Object.assign(article, dto);
    article.updatedAt = Math.floor(Date.now() / 1000);
    return article.save();
  }

  /**
   * Uploads an Image to the server.
   * @param req
   * @param res
   */
  async uploadImage(@Req() req, @Res() res): Promise<string> {
    const upload = multer({
      storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read',
        key: function(request, file, cb) {
          cb(null, `${Date.now().toString()}`);
        },
      }),
    }).array('upload', 1);

    return new Promise((resolve, reject) => {
      try {
        upload(req, res, function(error) {
          if (error) {
            reject(error);
          }
          resolve(req.files[0].location);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Deletes the given article.
   * @param reqUser requesting user
   * @param articleId id of the article to delete
   */
  async deleteArticle(reqUser: User, articleId: string): Promise<void> {
    const article = await this.articleModel.findById(articleId);
    const canEdit = article.author === reqUser._id.toString() || reqUser.admin;
    if (!canEdit) throw new UnauthorizedException("Unauthorized to delete");

    await article.remove();
  }

  /**
   * Gets an Article by id, and populates its author information.
   * @param articleId id of article to fetch
   */
  async getArticleById(articleId: string): Promise<Article> {
    const article = await this.articleModel
      .findById(articleId)
      .populate('author');
    this.secureUser(<User>article.author);
    return article;
  }

  /**
   * Gets an Article by its name.
   * @param name name of the article to fetch
   */
  async getArticleByName(name: string): Promise<Article> {
    const article = await this.articleModel
      .findOne({ name })
      .populate('author');
    this.secureUser(<User>article.author);
    return article;
  }

  /**
   * Gets all articles.
   * @param isPublic whether to fetch only public articles
   */
  async getAllArticles(isPublic: boolean): Promise<Article[]> {
    let articles;
    if (isPublic) {
      articles = await this.articleModel
        .find({ public: true })
        .populate('author');
    } else {
      articles = await this.articleModel.find().populate('author');
    }
    for (const article of articles) {
      this.secureUser(<User>article.author);
    }
    return articles;
  }

  /**
   * Process a Click to an Article.
   * @param articleId article that was clicked on
   */
  async click(articleId: string): Promise<void> {
    await this.articleModel.findByIdAndUpdate(articleId, { $inc: { 'clicks': 1 }});
  }

  /**
   * Get top Articles (to be displayed on the front page).
   * @param limit number of articles to retrieve
   */
  async getTopArticles(limit: number): Promise<Article[]> {
    const recentArticles = await this.articleModel
      .find({ public: true })
      .sort({ 'createdAt': -1 })
      .limit(limit * 2)
      .populate('author');
    for (const article of recentArticles) {
      const now = Math.floor(Date.now() / 1000);
      const ageInHours = Math.max(0.5, (now - article.createdAt) / (60 * 60));
      const clicksPerHour = article.clicks / ageInHours;
      article['relevance'] = Math.sqrt(clicksPerHour) / ageInHours;
      this.secureUser(<User>article.author);
    }
    return recentArticles.sort((a, b) => b['relevance'] - a['relevance']).slice(0, limit);
  }

  /**
   * Get Articles within a time range.
   * @param lowerBound least time (as unix timestamp)
   * @param upperBound greatest time (as unix timestamp)
   */
  async getArticlesWithinTimeRange(lowerBound: number, upperBound: number): Promise<Article[]> {
    const articles = await this.articleModel.find({
      public: true,
      createdAt: { $gt: lowerBound, $lt: upperBound }
    })
      .populate('author');
    for (const article of articles) {
      this.secureUser(<User>article.author);
    }
    return articles;
  }

  /**
   * Get all public Articles written by an author.
   * @param userId author id
   */
  async getArticlesByAuthor(userId: string): Promise<Article[]> {
    const articles = await this.articleModel.find({
      public: true,
      author: userId
    })
      .populate('author');
    for (const article of articles) {
      this.secureUser(<User>article.author);
    }
    return articles;
  }

  /**
   * Get all public Articles that have a given tag.
   * @param tag tag to look for
   */
  async getArticlesByTag(tag: string): Promise<Article[]> {
    const articles = await this.articleModel.find({
      public: true,
      tags: tag
    })
      .populate('author');
    for (const article of articles) {
      this.secureUser(<User>article.author);
    }
    return articles;
  }

  /**
   * Gets all tags used by any Article.
   */
  async getAllTags(): Promise<string[]> {
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

  /**
   * Searches published Articles for any matching the given query.
   * @param query query to search
   */
  async searchArticles(query: string): Promise<Article[]> {
    const articles = await this.articleModel
      .find({
        $text: { $search: query },
        score: { $meta: "textScore" },
        public: true
      })
      .sort({ score: { $meta: 'textScore' } })
      .populate('author');
    for (const article of articles) {
      this.secureUser(<User>article.author);
    }
    return articles;
  }

  /**
   * Post a Comment to an Article.
   * @param dto contains info about the comment to post
   */
  async postComment(dto: CreateCommentDto): Promise<Comment> {
    const article = await this.articleModel.findById(dto.articleId);
    if (!article) throw new NotFoundException("Article not found");
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

  /**
   * Delete a Comment from an Article.
   * @param articleId id of article to delete comment from
   * @param commentId id of comment to delete
   */
  async deleteComment(articleId: string, commentId: string): Promise<void> {
    const article = await this.articleModel.findById(articleId);
    if (!article) throw new NotFoundException("Article not found");
    article.comments = article.comments.filter(c => c['_id'].toString() !== commentId);
    article.markModified('comments');
    await article.save();
  }

  /**
   * Removes all sensitive info from a User object.
   * @param user
   * @private
   */
  private secureUser(user: User) {
    delete user.tokens;
    delete user.resetKey;
    delete user.password;
  }
}
