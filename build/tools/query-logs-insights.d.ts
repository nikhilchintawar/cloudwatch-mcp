/**
 * CloudWatch Logs Insights Query tool
 * Execute advanced queries using CloudWatch Logs Insights
 */
import { z } from 'zod';
import type { LogsInsightsResult } from '../types.js';
export declare const queryLogsInsightsSchema: z.ZodObject<{
    logGroups: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    query: z.ZodString;
    startTime: z.ZodString;
    endTime: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    startTime: string;
    query: string;
    limit?: number | undefined;
    endTime?: string | undefined;
    logGroups?: string[] | undefined;
}, {
    startTime: string;
    query: string;
    limit?: number | undefined;
    endTime?: string | undefined;
    logGroups?: string[] | undefined;
}>;
export type QueryLogsInsightsInput = z.infer<typeof queryLogsInsightsSchema>;
export declare function queryLogsInsights(input: QueryLogsInsightsInput): Promise<LogsInsightsResult>;
//# sourceMappingURL=query-logs-insights.d.ts.map