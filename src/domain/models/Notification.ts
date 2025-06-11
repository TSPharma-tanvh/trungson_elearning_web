// src/domain/models/Notification.ts

export interface NotificationProps {
  recipientPhone?: string; // or userId, depending on your API
  title: string;
  body: string;
  scheduleTime?: string; // ISO string if needed
}

export class NotificationEntity {
  public readonly title: string;
  public readonly body: string;
  public readonly recipientPhone?: string;
  public readonly scheduleTime?: string;

  constructor(props: NotificationProps) {
    if (!props.title) {
      throw new Error('Notification title is required');
    }
    if (!props.body) {
      throw new Error('Notification body is required');
    }
    this.title = props.title;
    this.body = props.body;
    this.recipientPhone = props.recipientPhone;
    this.scheduleTime = props.scheduleTime;
  }

  toApiPayload(): Record<string, any> {
    const payload: any = {
      Title: this.title,
      Body: this.body,
    };
    if (this.recipientPhone) {
      // assume API expects array or single? adjust accordingly
      payload.PhoneNumberList = [this.recipientPhone];
    }
    if (this.scheduleTime) {
      payload.ScheduleTime = this.scheduleTime;
    }
    return payload;
  }
}
