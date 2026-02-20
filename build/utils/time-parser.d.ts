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
export declare function parseTime(timeStr: string, relativeTo?: number): number;
/**
 * Format a timestamp for display
 */
export declare function formatTimestamp(timestamp: number): string;
/**
 * Get the start of a day (midnight UTC) for a date string
 */
export declare function getStartOfDay(dateStr: string): number;
/**
 * Get the end of a day (23:59:59.999 UTC) for a date string
 */
export declare function getEndOfDay(dateStr: string): number;
//# sourceMappingURL=time-parser.d.ts.map