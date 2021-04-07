import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleSchema } from './schemas/article.schema';
import { ConfigModule } from '@nestjs/config';
import { ArticlesController } from './articles.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({

    }),
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: 'Article', schema: ArticleSchema }]),
  ],
  providers: [ArticlesService],
  controllers: [ArticlesController]
})
export class ArticlesModule {}
