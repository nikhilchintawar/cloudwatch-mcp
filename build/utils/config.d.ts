/**
 * Configuration management from environment variables
 */
export interface Config {
    awsRegion: string;
    defaultLogGroup?: string;
    defaultLogStreamPrefix?: string;
}
export declare function getConfig(): Config;
//# sourceMappingURL=config.d.ts.map