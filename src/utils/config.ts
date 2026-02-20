/**
 * Configuration management from environment variables
 */

export interface Config {
  awsRegion: string;
  defaultLogGroup?: string;
  defaultLogStreamPrefix?: string;
}

export function getConfig(): Config {
  const awsRegion = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;

  if (!awsRegion) {
    throw new Error('AWS_REGION or AWS_DEFAULT_REGION environment variable is required');
  }

  return {
    awsRegion,
    defaultLogGroup: process.env.CLOUDWATCH_LOG_GROUP,
    defaultLogStreamPrefix: process.env.CLOUDWATCH_LOG_STREAM_PREFIX,
  };
}
