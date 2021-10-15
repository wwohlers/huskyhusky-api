import { Article } from './articles/interfaces/article.interface';
import { Sub } from './subs/interfaces/sub.interface';
import { Model } from 'mongoose';
import { User } from './users/interfaces/user.interface';
export declare class AppModule {
    private userModel;
    private articleModel;
    private subModel;
    constructor(userModel: Model<User>, articleModel: Model<Article>, subModel: Model<Sub>);
    onModuleInit(): void;
}
