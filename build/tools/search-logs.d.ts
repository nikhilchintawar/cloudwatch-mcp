/**
 * Search CloudWatch Logs tool
 * Searches logs using CloudWatch filter patterns with time-based queries
 */
import { z } from 'zod';
import type { LogEvent } from '../types.js';
export declare const searchLogsSchema: z.ZodObject<{
    logGroup: z.ZodOptional<z.ZodString>;
    logStreams: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    logStreamPrefix: z.ZodOptional<z.ZodString>;
    filterPattern: z.ZodOptional<z.ZodString>;
    startTime: z.ZodString;
    endTime: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    startTime: string;
    limit?: number | undefined;
    logGroup?: string | undefined;
    logStreams?: string[] | undefined;
    logStreamPrefix?: string | undefined;
    filterPattern?: string | undefined;
    endTime?: string | undefined;
}, {
    startTime: string;
    limit?: number | undefined;
    logGroup?: string | undefined;
    logStreams?: string[] | undefined;
    logStreamPrefix?: string | undefined;
    filterPattern?: string | undefined;
    endTime?: string | undefined;
}>;
export type SearchLogsInput = z.infer<typeof searchLogsSchema>;
export declare function searchLogs(input: SearchLogsInput): Promise<LogEvent[]>;
//# sourceMappingURL=search-logs.d.ts.map