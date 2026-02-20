/**
 * List CloudWatch Log Streams tool
 * Supports filtering by prefix and date for service-based log streams
 */
import { z } from 'zod';
import type { LogStream } from '../types.js';
export declare const listLogStreamsSchema: z.ZodObject<{
    logGroup: z.ZodOptional<z.ZodString>;
    prefix: z.ZodOptional<z.ZodString>;
    date: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    orderBy: z.ZodOptional<z.ZodDefault<z.ZodEnum<["LogStreamName", "LastEventTime"]>>>;
}, "strip", z.ZodTypeAny, {
    prefix?: string | undefined;
    limit?: number | undefined;
    logGroup?: string | undefined;
    date?: string | undefined;
    orderBy?: "LogStreamName" | "LastEventTime" | undefined;
}, {
    prefix?: string | undefined;
    limit?: number | undefined;
    logGroup?: string | undefined;
    date?: string | undefined;
    orderBy?: "LogStreamName" | "LastEventTime" | undefined;
}>;
export type ListLogStreamsInput = z.infer<typeof listLogStreamsSchema>;
export declare function listLogStreams(input: ListLogStreamsInput): Promise<LogStream[]>;
//# sourceMappingURL=list-log-streams.d.ts.map