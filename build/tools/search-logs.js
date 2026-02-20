/**
 * Search CloudWatch Logs tool
 * Searches logs using CloudWatch filter patterns with time-based queries
 */
import { FilterLogEventsCommand, } from '@aws-sdk/client-cloudwatch-logs';
import { z } from 'zod';
import { getCloudWatchLogsClient } from '../utils/aws-client.js';
import { getConfig } from '../utils/config.js';
import { parseTime } from '../utils/time-parser.js';
export const searchLogsSchema = z.object({
    logGroup: z
        .string()
        .optional()
        .describe('Log group name. Uses CLOUDWATCH_LOG_GROUP env var if not provided'),
    logStreams: z
        .array(z.string())
        .optional()
        .describe('Specific log stream names to search. If not provided, searches all streams'),
    logStreamPrefix: z
        .string()
        .optional()
        .describe('Filter streams by prefix (e.g., "sprive-backend-2026-02-20")'),
    filterPattern: z
        .string()
        .optional()
        .describe('CloudWatch filter pattern (e.g., "ERROR", "?ERROR ?WARN", "{ $.level = "error" }")'),
    startTime: z
        .string()
        .describe('Start time - relative (30m, 1h, 2d, 1w) or ISO 8601 or Unix timestamp'),
    endTime: z
        .string()
        .optional()
        .describe('End time - relative or ISO 8601 or Unix timestamp (default: now)'),
    limit: z
        .number()
        .min(1)
        .max(10000)
        .default(100)
        .optional()
        .describe('Maximum number of log events to return (default: 100)'),
});
export async function searchLogs(input) {
    const client = getCloudWatchLogsClient();
    const config = getConfig();
    const logGroup = input.logGroup || config.defaultLogGroup;
    if (!logGroup) {
        throw new Error('logGroup is required. Provide it as a parameter or set CLOUDWATCH_LOG_GROUP environment variable.');
    }
    const { logStreams, logStreamPrefix, filterPattern, startTime, endTime, limit = 100, } = input;
    const now = Date.now();
    const startTimestamp = parseTime(startTime, now);
    const endTimestamp = endTime ? parseTime(endTime, now) : now;
    if (startTimestamp >= endTimestamp) {
        throw new Error('startTime must be before endTime');
    }
    const logEvents = [];
    let nextToken;
    do {
        const command = new FilterLogEventsCommand({
            logGroupName: logGroup,
            logStreamNames: logStreams && logStreams.length > 0 ? logStreams : undefined,
            logStreamNamePrefix: !logStreams?.length ? logStreamPrefix : undefined,
            filterPattern: filterPattern || undefined,
            startTime: startTimestamp,
            endTime: endTimestamp,
            limit: Math.min(limit - logEvents.length, 100),
            nextToken,
        });
        const response = await client.send(command);
        if (response.events) {
            for (const event of response.events) {
                logEvents.push(mapLogEvent(event));
                if (logEvents.length >= limit)
                    break;
            }
        }
        nextToken = response.nextToken;
    } while (nextToken && logEvents.length < limit);
    return logEvents;
}
function mapLogEvent(event) {
    return {
        timestamp: event.timestamp || 0,
        message: event.message || '',
        logStreamName: event.logStreamName,
        eventId: event.eventId,
    };
}
//# sourceMappingURL=search-logs.js.map