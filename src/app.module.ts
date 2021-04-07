import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { ArticlesModule } from './articles/articles.module';
import { SubsModule } from './subs/subs.module';
import { ArticleSchema } from './articles/schemas/article.schema';
import { Article } from './articles/interfaces/article.interface';
import { UserSchema } from './users/schemas/user.schema';
import { Sub } from './subs/interfaces/sub.interface';
import { SubSchema } from './subs/schemas/sub.schema';
import { Model } from 'mongoose';
import { User } from './users/interfaces/user.interface';
import morph from './migration-script';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }),
    MongooseModule.forFeature([
      { name: 'Article', schema: ArticleSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Sub', schema: SubSchema }
    ]),
    UsersModule,
    EmailModule,
    ArticlesModule,
    SubsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Article') private articleModel: Model<Article>,
    @InjectModel('Sub') private subModel: Model<Sub>,
  ) {
  }

  onModuleInit() {
  }
}
