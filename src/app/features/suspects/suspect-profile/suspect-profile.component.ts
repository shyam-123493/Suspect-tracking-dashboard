import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SuspectService } from '@core/services/suspect.service';
import { CaseService } from '@core/services/case.service';
import { Suspect, TravelHistory, Case, CallHistory } from '@shared/interfaces';

@Component({
  selector: 'app-suspect-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './suspect-profile.component.html',
  styleUrl: './suspect-profile.component.scss'
})
export class SuspectProfileComponent implements OnInit {
  suspect: Suspect | null = null;
  associates: Suspect[] = [];
  travelHistory: TravelHistory[] = [];
  cases: Case[] = [];
  callHistory: CallHistory[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private suspectService: SuspectService,
    private caseService: CaseService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.suspect = this.suspectService.getSuspectById(id) || null;

    if (this.suspect) {
      this.associates = this.suspectService.getSuspectAssociates(id);
      this.travelHistory = this.suspectService.getTravelHistory(id);
      this.cases = this.caseService.getCasesBySuspect(id);
      this.callHistory = this.suspectService.getCallHistory(id);
    }
  }

  goBack() {
    this.router.navigate(['/suspects']);
  }

  viewOnMap() {
    if (this.suspect) {
      this.router.navigate(['/map'], { queryParams: { suspect: this.suspect.id } });
    }
  }

  getActionColor(action: string): string {
    switch (action.toLowerCase()) {
      case 'arrived':  return 'arrived';
      case 'departed': return 'departed';
      case 'spotted':  return 'spotted';
      default:         return 'default';
    }
  }

  getCallIcon(callType: string): string {
    switch (callType) {
      case 'incoming': return 'call_received';
      case 'outgoing': return 'call_made';
      case 'missed':   return 'call_missed';
      default:         return 'call';
    }
  }

  getCallColor(callType: string): string {
    switch (callType) {
      case 'incoming': return 'incoming';
      case 'outgoing': return 'outgoing';
      case 'missed':   return 'missed';
      default:         return 'default';
    }
  }

  formatDuration(seconds: number): string {
    if (seconds === 0) return '--';
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return min > 0 ? `${min}m ${sec}s` : `${sec}s`;
  }

  get incomingCount(): number {
    return this.callHistory.filter(c => c.callType === 'incoming').length;
  }

  get outgoingCount(): number {
    return this.callHistory.filter(c => c.callType === 'outgoing').length;
  }

  get missedCount(): number {
    return this.callHistory.filter(c => c.callType === 'missed').length;
  }
}
