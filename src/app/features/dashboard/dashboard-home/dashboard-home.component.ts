import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SuspectService } from '@core/services/suspect.service';
import { CaseService } from '@core/services/case.service';
import { AlertService } from '@core/services/alert.service';
import { SimulationService } from '@core/services/simulation.service';
import { Suspect, Case } from '@shared/interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  totalSuspects = 0;
  openCases = 0;
  totalCases = 0;
  highRiskSuspects = 0;
  mediumRiskSuspects = 0;
  lowRiskSuspects = 0;
  recentAlerts = 0;
  isRunning = false;

  topSuspects: Suspect[] = [];
  activeCases: Case[] = [];
  casesByPriority: { priority: string; count: number }[] = [];

  private subs: Subscription[] = [];

  constructor(
    private suspectService: SuspectService,
    private caseService: CaseService,
    private alertService: AlertService,
    private simulationService: SimulationService
  ) {}

  ngOnInit() {
    this.subs.push(
      this.suspectService.getAllSuspects().subscribe(suspects => {
        this.totalSuspects = suspects.length;
        this.highRiskSuspects   = suspects.filter(s => s.threatLevel === 'high').length;
        this.mediumRiskSuspects = suspects.filter(s => s.threatLevel === 'medium').length;
        this.lowRiskSuspects    = suspects.filter(s => s.threatLevel === 'low').length;
        this.topSuspects = [...suspects]
          .sort((a, b) => b.threatScore - a.threatScore)
          .slice(0, 6);
      }),

      this.caseService.getAllCases().subscribe(cases => {
        this.totalCases = cases.length;
        this.openCases  = cases.filter(c => c.status !== 'closed').length;
        this.activeCases = cases.filter(c => c.status !== 'closed').slice(0, 5);

        const priorities = ['critical', 'high', 'medium', 'low'];
        this.casesByPriority = priorities.map(p => ({
          priority: p,
          count: cases.filter(c => c.priority === p).length
        })).filter(item => item.count > 0);
      }),

      this.alertService.getAllAlerts().subscribe(alerts => {
        this.recentAlerts = alerts.filter(a => !a.isDismissed).length;
      }),

      this.simulationService.isRunning$.subscribe(r => (this.isRunning = r))
    );
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  toggleSimulation() {
    this.simulationService.toggleSimulation();
  }
}
