export type HumanDateFormatType = 'short' | 'medium' | 'long' | 'withTime' | 'fullDateTime';

/**
 * Converts a Date into a human-readable format.
 * 
 * @param date - Date object or string
 * @param format - desired format
 * @returns formatted string
 */
export function formatHumanDate(
  date: Date | string,
  format: HumanDateFormatType = 'medium'
): string {
  const d = new Date(date);

  if (isNaN(d.getTime())) return 'Invalid Date';

  const options: Record<HumanDateFormatType, Intl.DateTimeFormatOptions> = {
    short: { year: '2-digit', month: '2-digit', day: '2-digit' },               // 17/07/25
    medium: { year: 'numeric', month: 'short', day: 'numeric' },                // Jul 17, 2025
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    },                                                                          // Thursday, July 17, 2025
    withTime: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    },                                                                          // Jul 17, 2025, 05:30 PM
    fullDateTime: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    },                                                                          // Thursday, July 17, 2025 at 05:30:00 PM
  };

  return new Intl.DateTimeFormat('en-IN', options[format]).format(d);
}