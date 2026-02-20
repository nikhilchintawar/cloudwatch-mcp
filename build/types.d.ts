/**
 * Type definitions for CloudWatch MCP server
 */
export interface LogGroup {
    name: string;
    arn?: string;
    creationTime?: number;
    retentionInDays?: number;
    storedBytes?: number;
}
export interface LogStream {
    name: string;
    creationTime?: number;
    firstEventTime?: number;
    lastEventTime?: number;
    lastIngestionTime?: number;
    storedBytes?: number;
}
export interface LogEvent {
    timestamp: number;
    message: string;
    logStreamName?: string;
    eventId?: string;
}
export interface LogsInsightsResult {
    status: string;
    results: Record<string, string>[];
    statistics?: {
        recordsMatched: number;
        recordsScanned: number;
        bytesScanned: number;
    };
}
//# sourceMappingURL=types.d.ts.map