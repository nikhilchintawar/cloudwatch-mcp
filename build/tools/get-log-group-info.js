/**
 * Get CloudWatch Log Group Info tool
 * Retrieves detailed information about a specific log group
 */
import { DescribeLogGroupsCommand, } from '@aws-sdk/client-cloudwatch-logs';
import { z } from 'zod';
import { getCloudWatchLogsClient } from '../utils/aws-client.js';
import { getConfig } from '../utils/config.js';
export const getLogGroupInfoSchema = z.object({
    logGroup: z
        .string()
        .optional()
        .describe('Log group name. Uses CLOUDWATCH_LOG_GROUP env var if not provided'),
});
export async function getLogGroupInfo(input) {
    const client = getCloudWatchLogsClient();
    const config = getConfig();
    const logGroup = input.logGroup || config.defaultLogGroup;
    if (!logGroup) {
        throw new Error('logGroup is required. Provide it as a parameter or set CLOUDWATCH_LOG_GROUP environment variable.');
    }
    const command = new DescribeLogGroupsCommand({
        logGroupNamePrefix: logGroup,
        limit: 1,
    });
    const response = await client.send(command);
    // Find exact match
    const group = response.logGroups?.find(g => g.logGroupName === logGroup);
    if (!group) {
        throw new Error(`Log group not found: ${logGroup}`);
    }
    return {
        name: group.logGroupName || '',
        arn: group.arn,
        creationTime: group.creationTime,
        retentionInDays: group.retentionInDays,
        storedBytes: group.storedBytes,
        metricFilterCount: group.metricFilterCount,
        kmsKeyId: group.kmsKeyId,
        dataProtectionStatus: group.dataProtectionStatus,
    };
}
//# sourceMappingURL=get-log-group-info.js.map