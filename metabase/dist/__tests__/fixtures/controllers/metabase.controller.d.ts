import { MetabaseService } from '../../../services/metabase.service';
export declare class MetabaseController {
    mbService: MetabaseService;
    constructor(mbService: MetabaseService);
    dashboard(): Promise<any>;
    getDataCard(id: number, filter?: any): Promise<any>;
    getDataCardFilter(id: number, type?: string, format?: string, granularity?: string, filter?: any): Promise<any>;
}
