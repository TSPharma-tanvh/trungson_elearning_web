import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export class DateTimeUtils {
  // Format ISO string as-is (stay in UTC)
  static formatISODateFromString(isoString: string): string {
    return isoString ? dayjs.utc(isoString).format('DD/MM/YYYY hh:mm A') : '';
  }

  static formatISODateFromDate(input?: Date): string {
    if (!input) return '';
    const date = typeof input === 'string' ? dayjs(input) : dayjs(input.toISOString());
    return date.format('DD/MM/YYYY hh:mm A');
  }

  static formatISODateToString(input?: string | Date): string {
    if (!input) return '';
    let date: Date;
    if (typeof input === 'string') {
      date = new Date(input);
    } else {
      date = input;
    }
    if (isNaN(date.getTime())) return '';

    const pad = (n: number) => n.toString().padStart(2, '0');

    return (
      date.getFullYear() +
      '-' +
      pad(date.getMonth() + 1) +
      '-' +
      pad(date.getDate()) +
      'T' +
      pad(date.getHours()) +
      ':' +
      pad(date.getMinutes()) +
      ':' +
      pad(date.getSeconds())
    );
  }

  static parseLocalDateTimeString(input: string): Date | undefined {
    if (!input) return undefined;

    const date = input.endsWith('Z') ? dayjs.utc(input).local() : dayjs(input);
    if (!date.isValid()) return undefined;

    return date.toDate();
  }
}
