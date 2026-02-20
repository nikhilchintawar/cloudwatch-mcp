# CloudWatch MCP Server

A Model Context Protocol (MCP) server for searching and analyzing AWS CloudWatch logs. Supports configurable log groups, time-based searches, and service-specific log stream filtering.

## Features

- **list_log_groups** - Browse available CloudWatch log groups
- **list_log_streams** - Filter streams by prefix and date (perfect for service-based streams like `sprive-backend-2026-02-20`)
- **search_logs** - Search logs by time range and CloudWatch filter patterns
- **query_logs_insights** - Execute advanced CloudWatch Logs Insights queries
- **get_log_group_info** - Get log group metadata (retention, storage, etc.)

## Installation

### Using npx (Recommended)

No installation required. Add directly to your config:

**Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "cloudwatch": {
      "command": "npx",
      "args": ["-y", "github:nikhilchintawar/cloudwatch-mcp"],
      "env": {
        "AWS_REGION": "eu-west-2",
        "AWS_PROFILE": "your-profile",
        "CLOUDWATCH_LOG_GROUP": "/aws/eks/spv-default-prod-eks/application"
      }
    }
  }
}
```

**Claude Code** (`~/.claude/settings.json`):

```json
{
  "mcpServers": {
    "cloudwatch": {
      "command": "npx",
      "args": ["-y", "github:nikhilchintawar/cloudwatch-mcp"],
      "env": {
        "AWS_REGION": "eu-west-2",
        "AWS_PROFILE": "your-profile",
        "CLOUDWATCH_LOG_GROUP": "/aws/eks/spv-default-prod-eks/application"
      }
    }
  }
}
```

### Manual Installation

```bash
# Clone the repository
git clone https://github.com/nikhilchintawar/cloudwatch-mcp.git
cd cloudwatch-mcp

# Install dependencies
npm install

# Build
npm run build
```

Then add to your config:

```json
{
  "mcpServers": {
    "cloudwatch": {
      "command": "node",
      "args": ["/absolute/path/to/cloudwatch-mcp/build/index.js"],
      "env": {
        "AWS_REGION": "eu-west-2",
        "AWS_PROFILE": "your-profile",
        "CLOUDWATCH_LOG_GROUP": "/aws/eks/spv-default-prod-eks/application"
      }
    }
  }
}
```

## Configuration

### Config File Locations

- **Claude Desktop (macOS):** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Claude Desktop (Windows):** `%APPDATA%\Claude\claude_desktop_config.json`
- **Claude Code:** `~/.claude/settings.json`

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AWS_REGION` | Yes | AWS region (e.g., `eu-west-2`) |
| `CLOUDWATCH_LOG_GROUP` | No | Default log group path |
| `CLOUDWATCH_LOG_STREAM_PREFIX` | No | Default stream prefix filter |

### AWS Authentication

The server uses the AWS SDK's default credential provider chain. Choose one method:

**Option 1: AWS Profile** (Recommended)
```json
{
  "env": {
    "AWS_REGION": "eu-west-2",
    "AWS_PROFILE": "your-profile-name"
  }
}
```

**Option 2: Temporary Credentials**
```json
{
  "env": {
    "AWS_REGION": "eu-west-2",
    "AWS_ACCESS_KEY_ID": "your-access-key",
    "AWS_SECRET_ACCESS_KEY": "your-secret-key",
    "AWS_SESSION_TOKEN": "your-session-token"
  }
}
```

**Option 3: AWS SSO**
```bash
# Login first
aws sso login --profile your-sso-profile
```
```json
{
  "env": {
    "AWS_REGION": "eu-west-2",
    "AWS_PROFILE": "your-sso-profile"
  }
}
```

**Option 4: IAM Role** - Automatic when running on EC2, ECS, or Lambda.

## Usage Examples

Once configured, you can use natural language to interact with CloudWatch:

- "Search for errors in the last hour"
- "Show me logs from sprive-backend for today"
- "Find all ERROR or WARN messages in the past 30 minutes"
- "Run a Logs Insights query to count errors by service"
- "List all log streams for 2026-02-20"

## Available Tools

### `list_log_groups`

List available CloudWatch log groups.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `prefix` | No | Filter by name prefix |
| `limit` | No | Max results (default: 50) |

### `list_log_streams`

List log streams with smart date/service filtering.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `logGroup` | No | Log group name (uses env var default) |
| `prefix` | No | Filter by stream prefix (e.g., `sprive-backend`) |
| `date` | No | Filter by date (`YYYY-MM-DD`) |
| `limit` | No | Max results (default: 50) |
| `orderBy` | No | `LogStreamName` or `LastEventTime` (default) |

### `search_logs`

Search logs using CloudWatch filter patterns.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `logGroup` | No | Log group name |
| `logStreams` | No | Specific stream names to search |
| `logStreamPrefix` | No | Filter streams by prefix |
| `filterPattern` | No | CloudWatch filter pattern |
| `startTime` | Yes | Relative (`30m`, `1h`, `2d`) or ISO 8601 |
| `endTime` | No | End time (default: now) |
| `limit` | No | Max results (default: 100) |

### `query_logs_insights`

Execute CloudWatch Logs Insights queries.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `logGroups` | No | Array of log group names |
| `query` | Yes | Logs Insights query string |
| `startTime` | Yes | Start time |
| `endTime` | No | End time (default: now) |
| `limit` | No | Max results (default: 1000) |

### `get_log_group_info`

Get detailed information about a log group.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `logGroup` | No | Log group name |

## Time Formats

The `startTime` and `endTime` parameters support:

- **Relative**: `30m`, `1h`, `2d`, `1w` (minutes, hours, days, weeks ago)
- **ISO 8601**: `2026-02-20T14:30:00Z`
- **Date**: `2026-02-20`
- **Unix timestamp**: `1740067200000` (ms) or `1740067200` (s)

## Filter Patterns

CloudWatch filter patterns for searching logs:

- Simple text: `ERROR`
- OR pattern: `?ERROR ?WARN`
- JSON field: `{ $.level = "error" }`
- Multiple conditions: `{ $.status >= 400 && $.duration > 1000 }`

See [AWS documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html) for full syntax.

## Development

```bash
# Watch mode for development
npm run dev

# Build for production
npm run build

# Test with MCP Inspector
AWS_REGION=eu-west-2 AWS_PROFILE=your-profile \
  npx @modelcontextprotocol/inspector node build/index.js
```

## License

MIT
