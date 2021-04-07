import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { GetUserMiddleware } from './middleware/get-user.middleware';
import { EmailModule } from '../email/email.module';
import { UsersController } from './users.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' }
    }),
    EmailModule
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply getUser middleware to all routes
    consumer.apply(GetUserMiddleware).forRoutes('*');
  }
}
