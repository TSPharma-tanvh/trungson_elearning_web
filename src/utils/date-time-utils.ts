import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const DateTimeUtils = {
  formatISODateStringToString(isoString: string): string {
    return isoString ? dayjs(isoString).format('DD/MM/YYYY hh:mm A') : '';
  },

  formatDateTimeToDateString(input?: Date): string {
    if (!input) return '';
    const date = typeof input === 'string' ? dayjs(input) : dayjs(input.toISOString());
    return date.format('DD/MM/YYYY hh:mm A');
  },

  formatISODateToString(input?: string | Date): string {
    if (!input) return '';
    let date: Date;
    if (typeof input === 'string') {
      date = new Date(input);
    } else {
      date = input;
    }
    if (isNaN(date.getTime())) return '';

    const pad = (n: number): string => n.toString().padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  },

  formatStringToDateTime(input: string): Date | undefined {
    if (!input) return undefined;
    const date = input.endsWith('Z') ? dayjs.utc(input).local() : dayjs(input);
    if (!date.isValid()) return undefined;
    return date.toDate();
  },
};
