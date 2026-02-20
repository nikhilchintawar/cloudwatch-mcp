/**
 * List CloudWatch Log Groups tool
 */

import {
  DescribeLogGroupsCommand,
  type LogGroup as AWSLogGroup,
} from '@aws-sdk/client-cloudwatch-logs';
import { z } from 'zod';
import { getCloudWatchLogsClient } from '../utils/aws-client.js';
import type { LogGroup } from '../types.js';

export const listLogGroupsSchema = z.object({
  prefix: z
    .string()
    .optional()
    .describe('Filter log groups by name prefix'),
  limit: z
    .number()
    .min(1)
    .max(50)
    .default(50)
    .optional()
    .describe('Maximum number of log groups to return (default: 50)'),
});

export type ListLogGroupsInput = z.infer<typeof listLogGroupsSchema>;

export async function listLogGroups(input: ListLogGroupsInput): Promise<LogGroup[]> {
  const client = getCloudWatchLogsClient();
  const { prefix, limit = 50 } = input;

  const logGroups: LogGroup[] = [];
  let nextToken: string | undefined;

  do {
    const command = new DescribeLogGroupsCommand({
      logGroupNamePrefix: prefix,
      limit: Math.min(limit - logGroups.length, 50),
      nextToken,
    });

    const response = await client.send(command);

    if (response.logGroups) {
      for (const group of response.logGroups) {
        logGroups.push(mapLogGroup(group));
        if (logGroups.length >= limit) break;
      }
    }

    nextToken = response.nextToken;
  } while (nextToken && logGroups.length < limit);

  return logGroups;
}

function mapLogGroup(group: AWSLogGroup): LogGroup {
  return {
    name: group.logGroupName || '',
    arn: group.arn,
    creationTime: group.creationTime,
    retentionInDays: group.retentionInDays,
    storedBytes: group.storedBytes,
  };
}
