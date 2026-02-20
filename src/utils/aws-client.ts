/**
 * AWS CloudWatch Logs client setup
 * Uses the default credential provider chain for flexible authentication
 */

import { CloudWatchLogsClient } from '@aws-sdk/client-cloudwatch-logs';
import { getConfig } from './config.js';

let client: CloudWatchLogsClient | null = null;

export function getCloudWatchLogsClient(): CloudWatchLogsClient {
  if (!client) {
    const config = getConfig();
    client = new CloudWatchLogsClient({
      region: config.awsRegion,
      // The SDK automatically uses the default credential provider chain:
      // 1. Environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN)
      // 2. Shared credentials file (~/.aws/credentials)
      // 3. AWS SSO
      // 4. IAM roles (EC2, ECS, Lambda)
      // 5. Web identity tokens (EKS)
    });
  }
  return client;
}
