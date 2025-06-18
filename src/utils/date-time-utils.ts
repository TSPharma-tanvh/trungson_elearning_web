import dayjs from 'dayjs';

export class DateTimeUtils {
  static formatISODate(isoString: string): string {
    return isoString ? dayjs(isoString).format('DD/MM/YYYY hh:mm A') : '';
  }
}
