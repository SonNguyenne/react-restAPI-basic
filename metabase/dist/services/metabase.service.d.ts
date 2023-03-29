export declare class MetabaseService {
    metabaseUsername: string;
    metabasePassword: string;
    metabaseUrl: string;
    session: string;
    constructor(metabaseUsername: string, metabasePassword: string, metabaseUrl: string);
    sessionMb(): Promise<any>;
    formatNivoLine(rows: any): unknown[];
    formatNivoBar(data: any): {
        indexBy: any;
        keys: any;
        data: any;
    };
    formatTrend(data: any): any;
    test(URL: string): number;
    getDataByGranularity(session: any, filter: any, granularity: any, id: number): Promise<any>;
    getDataByQuery(session: any, parameters: any, id: number): Promise<any>;
}
