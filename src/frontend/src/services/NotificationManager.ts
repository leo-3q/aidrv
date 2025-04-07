import { NotificationType } from '../components/Notification';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration: number;
}

type NotificationListener = (notification: Notification) => void;

export class NotificationManager {
  private static instance: NotificationManager;
  private listeners: NotificationListener[] = [];
  private notifications: Notification[] = [];

  private constructor() {}

  public static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  public addListener(listener: NotificationListener): void {
    this.listeners.push(listener);
  }

  public removeListener(listener: NotificationListener): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  public showNotification(
    type: NotificationType,
    message: string,
    duration: number = 5000
  ): void {
    const notification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      duration
    };

    this.notifications.push(notification);
    this.notifyListeners(notification);

    setTimeout(() => {
      this.removeNotification(notification.id);
    }, duration);
  }

  public removeNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  public clearNotifications(): void {
    this.notifications = [];
  }

  private notifyListeners(notification: Notification): void {
    this.listeners.forEach(listener => {
      try {
        listener(notification);
      } catch (error) {
        console.error('Error in notification listener:', error);
      }
    });
  }

  public showSuccess(message: string, duration?: number): void {
    this.showNotification('success', message, duration);
  }

  public showError(message: string, duration?: number): void {
    this.showNotification('error', message, duration);
  }

  public showWarning(message: string, duration?: number): void {
    this.showNotification('warning', message, duration);
  }

  public showInfo(message: string, duration?: number): void {
    this.showNotification('info', message, duration);
  }
} 