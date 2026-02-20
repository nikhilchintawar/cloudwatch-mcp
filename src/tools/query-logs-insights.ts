/**
 * CloudWatch Logs Insights Query tool
 * Execute advanced queries using CloudWatch Logs Insights
 */

import {
  StartQueryCommand,
  GetQueryResultsCommand,
  QueryStatus,
} from '@aws-sdk/client-cloudwatch-logs';
import { z } from 'zod';
import { getCloudWatchLogsClient } from '../utils/aws-client.js';
import { getConfig } from '../utils/config.js';
import { parseTime } from '../utils/time-parser.js';
import type { LogsInsightsResult } from '../types.js';

export const queryLogsInsightsSchema = z.object({
  logGroups: z
    .array(z.string())
    .min(1)
    .optional()
    .describe('Log group names to query. Uses CLOUDWATCH_LOG_GROUP env var if not provided'),
  query: z
    .string()
    .describe('CloudWatch Logs Insights query string'),
  startTime: z
    .string()
    .describe('Start time - relative (30m, 1h, 2d, 1w) or ISO 8601'),
  endTime: z
    .string()
    .optional()
    .describe('End time - relative or ISO 8601 (default: now)'),
  limit: z
    .number()
    .min(1)
    .max(10000)
    .default(1000)
    .optional()
    .describe('Maximum number of results to return (default: 1000)'),
});

export type QueryLogsInsightsInput = z.infer<typeof queryLogsInsightsSchema>;

const POLL_INTERVAL_MS = 500;
const MAX_POLL_ATTEMPTS = 120; // 60 seconds max wait

export async function queryLogsInsights(input: QueryLogsInsightsInput): Promise<LogsInsightsResult> {
  const client = getCloudWatchLogsClient();
  const config = getConfig();

  let logGroups = input.logGroups;
  if (!logGroups || logGroups.length === 0) {
    if (!config.defaultLogGroup) {
      throw new Error('logGroups is required. Provide it as a parameter or set CLOUDWATCH_LOG_GROUP environment variable.');
    }
    logGroups = [config.defaultLogGroup];
  }

  const { query, startTime, endTime, limit = 1000 } = input;

  const now = Date.now();
  const startTimestamp = parseTime(startTime, now);
  const endTimestamp = endTime ? parseTime(endTime, now) : now;

  if (startTimestamp >= endTimestamp) {
    throw new Error('startTime must be before endTime');
  }

  // Start the query
  const startCommand = new StartQueryCommand({
    logGroupNames: logGroups,
    queryString: query,
    startTime: Math.floor(startTimestamp / 1000), // Logs Insights uses seconds
    endTime: Math.floor(endTimestamp / 1000),
    limit,
  });

  const startResponse = await client.send(startCommand);
  const queryId = startResponse.queryId;

  if (!queryId) {
    throw new Error('Failed to start Logs Insights query');
  }

  // Poll for results
  let attempts = 0;
  while (attempts < MAX_POLL_ATTEMPTS) {
    const resultsCommand = new GetQueryResultsCommand({ queryId });
    const resultsResponse = await client.send(resultsCommand);

    const status = resultsResponse.status;

    if (status === QueryStatus.Complete) {
      const results: Record<string, string>[] = [];

      if (resultsResponse.results) {
        for (const row of resultsResponse.results) {
          const record: Record<string, string> = {};
          for (const field of row) {
            if (field.field && field.value !== undefined) {
              record[field.field] = field.value;
            }
          }
          results.push(record);
        }
      }

      return {
        status: 'Complete',
        results,
        statistics: resultsResponse.statistics ? {
          recordsMatched: resultsResponse.statistics.recordsMatched || 0,
          recordsScanned: resultsResponse.statistics.recordsScanned || 0,
          bytesScanned: resultsResponse.statistics.bytesScanned || 0,
        } : undefined,
      };
    }

    if (status === QueryStatus.Failed || status === QueryStatus.Cancelled) {
      throw new Error(`Logs Insights query ${status.toLowerCase()}`);
    }

    // Query still running, wait and retry
    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));
    attempts++;
  }

  throw new Error('Logs Insights query timed out');
}
