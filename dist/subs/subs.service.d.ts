import { Model } from 'mongoose';
import { Sub } from './interfaces/sub.interface';
export declare class SubsService {
    private subModel;
    constructor(subModel: Model<Sub>);
    createSub(email: string): Promise<Sub>;
    removeSub(email: string): Promise<any>;
    getAllSubs(): Promise<string[]>;
}
