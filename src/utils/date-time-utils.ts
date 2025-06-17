export class DateTimeUtils {
  static formatISODate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleString();
  }
}
