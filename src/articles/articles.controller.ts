import {
  BadRequestException,
  Body,
  Controller,
  Delete, Get, Param,
  Patch,
  Post,
  Req,
  Res, UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { IsUserGuard } from '../users/guards/is-user.guard';
import { AuthorizedRequest } from '../users/interfaces/authorized-request.interface';
import { UpdateArticleDto } from '../dto/update-article';
import { SingleStringDto } from '../dto/single-string.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { IsAdminGuard } from '../users/guards/is-admin.guard';

@Controller('articles')
export class ArticlesController {
  constructor(
    private articlesService: ArticlesService
  ){}

  @UseGuards(IsUserGuard)
  @Post()
  async createArticle(
    @Req() req: AuthorizedRequest
  ) {
    return this.articlesService.createArticle(req.user);
  }

  @UseGuards(IsUserGuard)
  @Patch()
  async updateArticle(
    @Req() req: AuthorizedRequest,
    @Body(ValidationPipe) dto: UpdateArticleDto
  ) {
    return this.articlesService.updateArticle(req.user, dto);
  }

  @UseGuards(IsUserGuard)
  @Delete('/:id')
  async deleteArticle(
    @Req() req: AuthorizedRequest,
    @Param() params
  ) {
    return this.articlesService.deleteArticle(req.user, params.id);
  }

  @UseGuards(IsUserGuard)
  @Post('/upload')
  async uploadImage(
    @Req() req,
    @Res() res
  ) {
    const uri = await this.articlesService.uploadImage(req, res);
    res.send(uri);
  }

  @Get('/:id')
  async getArticle(
    @Param() params
  ) {
    return this.articlesService.getArticleById(params.id);
  }

  @Post('/by-name')
  async getArticleByName(
    @Body(ValidationPipe) dto: SingleStringDto
  ) {
    return this.articlesService.getArticleByName(dto.value);
  }

  @Get('/all/:public')
  async getArticles(
    @Req() req,
    @Param() params
  ) {
    if (params.public !== 'true' && !req.user) {
      throw new UnauthorizedException("Cannot retrieve not public articles without authentication");
    }
    return this.articlesService.getAllArticles(params.public === 'true');
  }

  @Post('/click/:id')
  async clickArticle(
    @Param() params
  ) {
    return this.articlesService.click(params.id);
  }

  @Get('/top/:limit')
  async getTopArticles(
    @Param() params
  ) {
    return this.articlesService.getTopArticles(params.limit);
  }

  @Get('/range/:lower/:upper')
  async getTimeRange(
    @Param() params
  ) {
    return this.articlesService.getArticlesWithinTimeRange(params.lower, params.upper);
  }

  @Get('/author/:id')
  async getArticlesByAuthor(
    @Param() params
  ) {
    return this.articlesService.getArticlesByAuthor(params.id);
  }

  @Get('/tag/:name')
  async getArticlesByTag(
    @Param() params
  ) {
    return this.articlesService.getArticlesByTag(params.name);
  }

  @Get('/tags/all')
  async getAllTags() {
    return this.articlesService.getAllTags();
  }

  @Post('/search')
  async searchArticles(
    @Body(ValidationPipe) dto: SingleStringDto
  ) {
    return this.articlesService.searchArticles(dto.value);
  }

  @Post('/comment')
  async postComment(
    @Body(ValidationPipe) dto: CreateCommentDto
  ) {
    return this.articlesService.postComment(dto);
  }

  @UseGuards(IsAdminGuard)
  @Delete('/comment/:article/:comment')
  async deleteComment(
    @Param() params
  ) {
    return this.articlesService.deleteComment(params.article, params.comment);
  }
}
