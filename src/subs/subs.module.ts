import { Module } from '@nestjs/common';
import { SubsService } from './subs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SubSchema } from './schemas/sub.schema';
import { SubsController } from './subs.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Sub', schema: SubSchema }])
  ],
  providers: [SubsService],
  controllers: [SubsController]
})
export class SubsModule {}
