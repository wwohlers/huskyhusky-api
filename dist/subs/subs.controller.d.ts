import { SubsService } from './subs.service';
import { SingleStringDto } from '../dto/single-string.dto';
export declare class SubsController {
    private subsService;
    constructor(subsService: SubsService);
    subscribe(dto: SingleStringDto): Promise<import("./interfaces/sub.interface").Sub>;
    unsubscribe(dto: SingleStringDto): Promise<any>;
    getAllSubs(): Promise<string[]>;
}
