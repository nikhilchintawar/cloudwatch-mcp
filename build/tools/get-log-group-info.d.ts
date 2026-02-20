/**
 * Get CloudWatch Log Group Info tool
 * Retrieves detailed information about a specific log group
 */
import { z } from 'zod';
import type { LogGroup } from '../types.js';
export declare const getLogGroupInfoSchema: z.ZodObject<{
    logGroup: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    logGroup?: string | undefined;
}, {
    logGroup?: string | undefined;
}>;
export type GetLogGroupInfoInput = z.infer<typeof getLogGroupInfoSchema>;
export interface LogGroupInfo extends LogGroup {
    metricFilterCount?: number;
    kmsKeyId?: string;
    dataProtectionStatus?: string;
}
export declare function getLogGroupInfo(input: GetLogGroupInfoInput): Promise<LogGroupInfo>;
//# sourceMappingURL=get-log-group-info.d.ts.map