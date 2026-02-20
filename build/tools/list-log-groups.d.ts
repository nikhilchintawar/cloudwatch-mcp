/**
 * List CloudWatch Log Groups tool
 */
import { z } from 'zod';
import type { LogGroup } from '../types.js';
export declare const listLogGroupsSchema: z.ZodObject<{
    prefix: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    prefix?: string | undefined;
    limit?: number | undefined;
}, {
    prefix?: string | undefined;
    limit?: number | undefined;
}>;
export type ListLogGroupsInput = z.infer<typeof listLogGroupsSchema>;
export declare function listLogGroups(input: ListLogGroupsInput): Promise<LogGroup[]>;
//# sourceMappingURL=list-log-groups.d.ts.map