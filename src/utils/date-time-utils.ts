import dayjs from 'dayjs';

export class DateTimeUtils {
  static formatISODateFromString(isoString: string): string {
    return isoString ? dayjs(isoString).format('DD/MM/YYYY hh:mm A') : '';
  }

  static formatISODateFromDate(input?: Date): string {
    if (!input) return '';
    const date = typeof input === 'string' ? dayjs(input) : dayjs(input.toISOString());
    return date.format('DD/MM/YYYY hh:mm A');
  }
}
