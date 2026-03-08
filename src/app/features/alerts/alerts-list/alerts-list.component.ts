import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AlertService } from '@core/services/alert.service';
import { Alert } from '@shared/interfaces';

@Component({
  selector: 'app-alerts-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './alerts-list.component.html',
  styleUrl: './alerts-list.component.scss'
})
export class AlertsListComponent implements OnInit {
  alerts: Alert[] = [];

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.alertService.getAllAlerts().subscribe(alerts => {
      this.alerts = alerts.filter(a => !a.isDismissed);
    });
  }

  getAlertIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'meeting':
        return 'people';
      case 'zone-entry':
        return 'location_on';
      case 'zone-exit':
        return 'exit_to_app';
      case 'high-risk':
        return 'warning';
      default:
        return 'notifications';
    }
  }

  dismissAlert(alertId: string) {
    this.alertService.dismissAlert(alertId);
  }

  clearAllAlerts() {
    this.alertService.clearAllAlerts();
  }

  trackByAlertId(index: number, alert: Alert) {
    return alert.id;
  }
}
