import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sub } from './interfaces/sub.interface';

@Injectable()
export class SubsService {
  constructor(
    @InjectModel('Sub') private subModel: Model<Sub>
  ) {}

  /**
   * Subscribes an email.
   * @param email
   */
  async createSub(email: string): Promise<Sub> {
    const sub = new this.subModel({ email });
    return sub.save();
  }

  /**
   * Unsubscribes an email.
   * @param email
   */
  async removeSub(email: string): Promise<any> {
    return this.subModel.findOneAndDelete({ email });
  }

  /**
   * Get a list of all emails subscribed.
   */
  async getAllSubs(): Promise<string[]> {
    const subs = await this.subModel.find();
    return subs.map(s => s.email);
  }
}
