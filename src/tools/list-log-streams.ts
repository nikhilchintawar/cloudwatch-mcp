/**
 * List CloudWatch Log Streams tool
 * Supports filtering by prefix and date for service-based log streams
 */

import {
  DescribeLogStreamsCommand,
  type LogStream as AWSLogStream,
} from '@aws-sdk/client-cloudwatch-logs';
import { z } from 'zod';
import { getCloudWatchLogsClient } from '../utils/aws-client.js';
import { getConfig } from '../utils/config.js';
import type { LogStream } from '../types.js';

export const listLogStreamsSchema = z.object({
  logGroup: z
    .string()
    .optional()
    .describe('Log group name. Uses CLOUDWATCH_LOG_GROUP env var if not provided'),
  prefix: z
    .string()
    .optional()
    .describe('Filter streams by name prefix (e.g., "sprive-backend")'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .describe('Filter streams containing this date (YYYY-MM-DD format)'),
  limit: z
    .number()
    .min(1)
    .max(100)
    .default(50)
    .optional()
    .describe('Maximum number of streams to return (default: 50)'),
  orderBy: z
    .enum(['LogStreamName', 'LastEventTime'])
    .default('LastEventTime')
    .optional()
    .describe('Sort order for streams (default: LastEventTime)'),
});

export type ListLogStreamsInput = z.infer<typeof listLogStreamsSchema>;

export async function listLogStreams(input: ListLogStreamsInput): Promise<LogStream[]> {
  const client = getCloudWatchLogsClient();
  const config = getConfig();

  const logGroup = input.logGroup || config.defaultLogGroup;
  if (!logGroup) {
    throw new Error('logGroup is required. Provide it as a parameter or set CLOUDWATCH_LOG_GROUP environment variable.');
  }

  const { prefix, date, limit = 50, orderBy = 'LastEventTime' } = input;

  // Build the stream prefix for filtering
  // If both prefix and date are provided, combine them (e.g., "sprive-backend-2026-02-20")
  let streamPrefix: string | undefined;
  if (prefix && date) {
    streamPrefix = `${prefix}-${date}`;
  } else if (prefix) {
    streamPrefix = prefix;
  } else if (date) {
    // If only date is provided, we'll filter results after fetching
    streamPrefix = undefined;
  }

  const logStreams: LogStream[] = [];
  let nextToken: string | undefined;

  do {
    const command = new DescribeLogStreamsCommand({
      logGroupName: logGroup,
      logStreamNamePrefix: streamPrefix,
      orderBy,
      descending: true,
      limit: Math.min(limit - logStreams.length, 50),
      nextToken,
    });

    const response = await client.send(command);

    if (response.logStreams) {
      for (const stream of response.logStreams) {
        // If date filter is provided without prefix, filter by date in stream name
        if (date && !prefix && !stream.logStreamName?.includes(date)) {
          continue;
        }

        logStreams.push(mapLogStream(stream));
        if (logStreams.length >= limit) break;
      }
    }

    nextToken = response.nextToken;
  } while (nextToken && logStreams.length < limit);

  return logStreams;
}

function mapLogStream(stream: AWSLogStream): LogStream {
  return {
    name: stream.logStreamName || '',
    creationTime: stream.creationTime,
    firstEventTime: stream.firstEventTimestamp,
    lastEventTime: stream.lastEventTimestamp,
    lastIngestionTime: stream.lastIngestionTime,
    storedBytes: stream.storedBytes,
  };
}
