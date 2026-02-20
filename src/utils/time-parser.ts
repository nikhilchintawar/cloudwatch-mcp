/**
 * Time parsing utilities for relative and absolute time strings
 */

/**
 * Parse a time string into a Unix timestamp (milliseconds)
 *
 * Supports:
 * - Relative times: "30m", "1h", "2d", "1w" (minutes, hours, days, weeks ago)
 * - ISO 8601 dates: "2026-02-20T14:30:00Z"
 * - Date strings: "2026-02-20"
 * - Unix timestamps (as numbers or strings)
 *
 * @param timeStr - Time string to parse
 * @param relativeTo - Base time for relative calculations (defaults to now)
 * @returns Unix timestamp in milliseconds
 */
export function parseTime(timeStr: string, relativeTo: number = Date.now()): number {
  // Check for relative time format (e.g., "30m", "1h", "2d", "1w")
  const relativeMatch = timeStr.match(/^(\d+)([mhdw])$/);
  if (relativeMatch) {
    const value = parseInt(relativeMatch[1], 10);
    const unit = relativeMatch[2];

    const multipliers: Record<string, number> = {
      'm': 60 * 1000,           // minutes
      'h': 60 * 60 * 1000,      // hours
      'd': 24 * 60 * 60 * 1000, // days
      'w': 7 * 24 * 60 * 60 * 1000, // weeks
    };

    return relativeTo - (value * multipliers[unit]);
  }

  // Check for Unix timestamp (number as string)
  if (/^\d{10,13}$/.test(timeStr)) {
    const ts = parseInt(timeStr, 10);
    // If it's a 10-digit timestamp (seconds), convert to milliseconds
    return ts < 1e12 ? ts * 1000 : ts;
  }

  // Try to parse as ISO 8601 or other date format
  const parsed = Date.parse(timeStr);
  if (!isNaN(parsed)) {
    return parsed;
  }

  throw new Error(`Invalid time format: "${timeStr}". Use relative (30m, 1h, 2d, 1w), ISO 8601, or Unix timestamp.`);
}

/**
 * Format a timestamp for display
 */
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toISOString();
}

/**
 * Get the start of a day (midnight UTC) for a date string
 */
export function getStartOfDay(dateStr: string): number {
  const date = new Date(dateStr + 'T00:00:00Z');
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: "${dateStr}". Use YYYY-MM-DD.`);
  }
  return date.getTime();
}

/**
 * Get the end of a day (23:59:59.999 UTC) for a date string
 */
export function getEndOfDay(dateStr: string): number {
  const date = new Date(dateStr + 'T23:59:59.999Z');
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: "${dateStr}". Use YYYY-MM-DD.`);
  }
  return date.getTime();
}
