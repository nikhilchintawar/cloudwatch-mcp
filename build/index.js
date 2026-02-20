#!/usr/bin/env node
/**
 * CloudWatch MCP Server
 *
 * A generic MCP server for searching and analyzing AWS CloudWatch logs.
 * Supports configurable log groups, time-based searches, and service-specific log stream filtering.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { listLogGroups, listLogGroupsSchema } from './tools/list-log-groups.js';
import { listLogStreams, listLogStreamsSchema } from './tools/list-log-streams.js';
import { searchLogs, searchLogsSchema } from './tools/search-logs.js';
import { queryLogsInsights, queryLogsInsightsSchema } from './tools/query-logs-insights.js';
import { getLogGroupInfo, getLogGroupInfoSchema } from './tools/get-log-group-info.js';
const server = new McpServer({
    name: 'cloudwatch-mcp',
    version: '1.0.0',
});
// Register list_log_groups tool
server.tool('list_log_groups', 'List available CloudWatch log groups with optional prefix filter', listLogGroupsSchema.shape, async (args) => {
    try {
        const result = await listLogGroups(listLogGroupsSchema.parse(args));
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                },
            ],
            isError: true,
        };
    }
});
// Register list_log_streams tool
server.tool('list_log_streams', 'List log streams in a log group with optional filtering by prefix and date (useful for service-based streams like "sprive-backend-2026-02-20")', listLogStreamsSchema.shape, async (args) => {
    try {
        const result = await listLogStreams(listLogStreamsSchema.parse(args));
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                },
            ],
            isError: true,
        };
    }
});
// Register search_logs tool
server.tool('search_logs', 'Search CloudWatch logs with filter patterns and time-based queries. Supports relative times (30m, 1h, 2d) and CloudWatch filter patterns.', searchLogsSchema.shape, async (args) => {
    try {
        const result = await searchLogs(searchLogsSchema.parse(args));
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                },
            ],
            isError: true,
        };
    }
});
// Register query_logs_insights tool
server.tool('query_logs_insights', 'Execute CloudWatch Logs Insights queries for advanced log analysis. Supports the full Logs Insights query syntax.', queryLogsInsightsSchema.shape, async (args) => {
    try {
        const result = await queryLogsInsights(queryLogsInsightsSchema.parse(args));
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                },
            ],
            isError: true,
        };
    }
});
// Register get_log_group_info tool
server.tool('get_log_group_info', 'Get detailed information about a specific CloudWatch log group including retention settings and storage', getLogGroupInfoSchema.shape, async (args) => {
    try {
        const result = await getLogGroupInfo(getLogGroupInfoSchema.parse(args));
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                },
            ],
            isError: true,
        };
    }
});
// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('CloudWatch MCP server started');
}
main().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map