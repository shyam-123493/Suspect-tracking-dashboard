import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Alert } from '@shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertsSubject = new BehaviorSubject<Alert[]>([]);
  public alerts$ = this.alertsSubject.asObservable();

  private newAlertSubject = new BehaviorSubject<Alert | null>(null);
  public newAlert$ = this.newAlertSubject.asObservable();

  constructor() {
    this.loadAlertsFromStorage();
  }

  /**
   * Add new alert
   */
  addAlert(alert: Alert): void {
    const alerts = this.alertsSubject.value;
    alerts.unshift(alert); // Add to beginning
    this.alertsSubject.next(alerts);
    this.newAlertSubject.next(alert); // Trigger modal/notification
    this.saveAlertsToStorage(alerts);
  }

  /**
   * Get all alerts
   */
  getAllAlerts(): Observable<Alert[]> {
    return this.alerts$;
  }

  /**
   * Get active (non-dismissed) alerts
   */
  getActiveAlerts(): Alert[] {
    return this.alertsSubject.value.filter(a => !a.isDismissed);
  }

  /**
   * Get recent alerts
   */
  getRecentAlerts(limit: number = 10): Alert[] {
    return this.alertsSubject.value.slice(0, limit);
  }

  /**
   * Dismiss alert
   */
  dismissAlert(alertId: string): void {
    const alerts = this.alertsSubject.value;
    const index = alerts.findIndex(a => a.id === alertId);
    if (index !== -1) {
      alerts[index] = {
        ...alerts[index],
        isDismissed: true,
        dismissedAt: new Date()
      };
      this.alertsSubject.next([...alerts]);
      this.saveAlertsToStorage(alerts);
    }
  }

  /**
   * Clear all alerts
   */
  clearAllAlerts(): void {
    this.alertsSubject.next([]);
    this.saveAlertsToStorage([]);
  }

  /**
   * Get alert count
   */
  getAlertCount(): number {
    return this.getActiveAlerts().length;
  }

  /**
   * Get critical alerts
   */
  getCriticalAlerts(): Alert[] {
    return this.getActiveAlerts().filter(a => a.severity === 'critical' || a.severity === 'high');
  }

  /**
   * Save alerts to localStorage
   */
  private saveAlertsToStorage(alerts: Alert[]): void {
    try {
      localStorage.setItem('investigation_alerts', JSON.stringify(alerts));
    } catch (e) {
      console.error('Failed to save alerts to storage', e);
    }
  }

  /**
   * Load alerts from localStorage
   */
  private loadAlertsFromStorage(): void {
    try {
      const stored = localStorage.getItem('investigation_alerts');
      if (stored) {
        const alerts = JSON.parse(stored);
        this.alertsSubject.next(alerts);
      }
    } catch (e) {
      console.error('Failed to load alerts from storage', e);
    }
  }
}
