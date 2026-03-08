import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CaseService } from '@core/services/case.service';
import { SuspectService } from '@core/services/suspect.service';
import { Case, CaseDocument, Suspect, Zone, CallHistory, Association } from '@shared/interfaces';

/* ──────────────────────────────────────────────
   Analysis interfaces
   ────────────────────────────────────────────── */

interface ScoreBreakdown {
  label: string;
  value: number;   // 0-100
  weight: number;  // 0-1
  weighted: number; // value * weight
}

interface SuspectFocusScore {
  suspect: Suspect;
  totalScore: number;
  breakdown: ScoreBreakdown[];
  recommendedActions: string[];
}

interface CaseAnalysis {
  overallRisk: 'critical' | 'high' | 'medium' | 'low';
  overallRiskScore: number;
  summary: string;
  suspectScores: SuspectFocusScore[];
}

@Component({
  selector: 'app-cases-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  templateUrl: './cases-list.component.html',
  styleUrl: './cases-list.component.scss'
})
export class CasesListComponent implements OnInit {
  cases: Case[] = [];
  displayedColumns: string[] = ['id', 'title', 'status', 'priority', 'suspects', 'date', 'actions'];

  /** View details panel */
  viewCase: Case | null = null;
  viewSuspects: Suspect[] = [];

  /** Edit panel */
  editCase: Case | null = null;
  editForm = {
    title: '',
    description: '',
    status: '' as string,
    priority: '' as string,
    notes: '',
    caseOfficer: ''
  };

  /** Add new case panel */
  showAddCase = false;
  allSuspects: Suspect[] = [];
  selectedSuspectIds: number[] = [];
  addForm = {
    title: '',
    description: '',
    status: 'open' as string,
    priority: 'medium' as string,
    notes: '',
    caseOfficer: ''
  };

  /** Case analysis */
  showAnalysis = false;
  analysisResult: CaseAnalysis | null = null;

  constructor(
    private caseService: CaseService,
    private suspectService: SuspectService
  ) {}

  ngOnInit() {
    this.loadCases();
    this.allSuspects = this.suspectService.getAllSuspectsArray();
  }

  private loadCases() {
    this.cases = this.caseService.getAllCasesArray();
  }

  /* ══════════════════════════════════════════════
     VIEW DETAILS
     ══════════════════════════════════════════════ */

  openView(caseItem: Case) {
    this.viewCase = caseItem;
    this.viewSuspects = caseItem.suspects
      .map(id => this.suspectService.getSuspectById(id))
      .filter((s): s is Suspect => !!s);
    this.showAnalysis = false;
    this.analysisResult = null;
  }

  closeView() {
    this.viewCase = null;
    this.viewSuspects = [];
    this.showAnalysis = false;
    this.analysisResult = null;
  }

  /* ══════════════════════════════════════════════
     EDIT CASE
     ══════════════════════════════════════════════ */

  openEdit(caseItem: Case) {
    this.editCase = { ...caseItem, documents: caseItem.documents ? [...caseItem.documents] : [] };
    this.editForm = {
      title: caseItem.title,
      description: caseItem.description,
      status: caseItem.status,
      priority: caseItem.priority,
      notes: caseItem.notes,
      caseOfficer: caseItem.caseOfficer || ''
    };
  }

  closeEdit() {
    this.editCase = null;
  }

  saveEdit() {
    if (!this.editCase) return;
    const updated: Case = {
      ...this.editCase,
      title: this.editForm.title,
      description: this.editForm.description,
      status: this.editForm.status as any,
      priority: this.editForm.priority as any,
      notes: this.editForm.notes,
      caseOfficer: this.editForm.caseOfficer,
      updatedDate: new Date()
    };
    this.caseService.updateCase(updated);
    this.loadCases();
    this.closeEdit();
  }

  attachDocument() {
    if (!this.editCase) return;
    const doc: CaseDocument = {
      id: 'doc-' + Date.now(),
      name: 'Investigation_Report_' + new Date().toISOString().slice(0, 10) + '.pdf',
      type: 'application/pdf',
      size: (Math.random() * 5 + 0.5).toFixed(1) + ' MB',
      uploadedDate: new Date(),
      uploadedBy: this.editForm.caseOfficer || 'Officer'
    };
    if (!this.editCase.documents) {
      this.editCase.documents = [];
    }
    this.editCase.documents.push(doc);
  }

  removeDocument(docId: string) {
    if (!this.editCase || !this.editCase.documents) return;
    this.editCase.documents = this.editCase.documents.filter(d => d.id !== docId);
  }

  getDocIcon(type: string): string {
    if (type.includes('pdf')) return 'picture_as_pdf';
    if (type.includes('image')) return 'image';
    if (type.includes('word') || type.includes('document')) return 'description';
    if (type.includes('spreadsheet') || type.includes('excel')) return 'table_chart';
    return 'attach_file';
  }

  /* ══════════════════════════════════════════════
     ADD NEW CASE
     ══════════════════════════════════════════════ */

  openAddCase() {
    this.showAddCase = true;
    this.selectedSuspectIds = [];
    this.addForm = {
      title: '',
      description: '',
      status: 'open',
      priority: 'medium',
      notes: '',
      caseOfficer: ''
    };
  }

  closeAddCase() {
    this.showAddCase = false;
  }

  toggleSuspect(id: number) {
    const idx = this.selectedSuspectIds.indexOf(id);
    if (idx === -1) {
      this.selectedSuspectIds.push(id);
    } else {
      this.selectedSuspectIds.splice(idx, 1);
    }
  }

  isSuspectSelected(id: number): boolean {
    return this.selectedSuspectIds.includes(id);
  }

  saveNewCase() {
    const maxId = this.cases.length > 0
      ? Math.max(...this.cases.map(c => c.id))
      : 0;

    const newCase: Case = {
      id: maxId + 1,
      title: this.addForm.title,
      description: this.addForm.description,
      status: this.addForm.status as any,
      priority: this.addForm.priority as any,
      suspects: [...this.selectedSuspectIds],
      notes: this.addForm.notes,
      caseOfficer: this.addForm.caseOfficer,
      documents: [],
      createdDate: new Date(),
      updatedDate: new Date()
    };

    this.caseService.addCase(newCase);
    this.loadCases();
    this.closeAddCase();
  }

  /* ══════════════════════════════════════════════
     CASE ANALYSIS & SUSPECT SUGGESTIONS
     ══════════════════════════════════════════════ */

  openAnalysis() {
    if (!this.viewCase) return;
    this.analysisResult = this.analyzeCase(this.viewCase);
    this.showAnalysis = true;
  }

  closeAnalysis() {
    this.showAnalysis = false;
    this.analysisResult = null;
  }

  /** Core analysis algorithm */
  private analyzeCase(caseItem: Case): CaseAnalysis {
    const caseSuspects = caseItem.suspects
      .map(id => this.suspectService.getSuspectById(id))
      .filter((s): s is Suspect => !!s);

    const caseSuspectIds = new Set(caseItem.suspects);
    const allAssociations = this.caseService.getAllAssociations();
    const zones = this.suspectService.getZones();

    const suspectScores: SuspectFocusScore[] = caseSuspects.map(suspect => {
      const breakdown: ScoreBreakdown[] = [];

      // ── Factor 1: Threat Score (30%) ──
      const threatValue = suspect.threatScore;
      breakdown.push({
        label: 'Threat Score',
        value: threatValue,
        weight: 0.30,
        weighted: Math.round(threatValue * 0.30)
      });

      // ── Factor 2: Network Density (20%) ──
      const suspectAssociations = allAssociations.filter(
        a => a.suspect1Id === suspect.id || a.suspect2Id === suspect.id
      );
      const connectionsToOtherCaseSuspects = suspectAssociations.filter(a => {
        const otherId = a.suspect1Id === suspect.id ? a.suspect2Id : a.suspect1Id;
        return caseSuspectIds.has(otherId) && otherId !== suspect.id;
      });
      const otherSuspectsCount = caseSuspects.length - 1;
      const networkValue = otherSuspectsCount > 0
        ? Math.min(100, Math.round((connectionsToOtherCaseSuspects.length / otherSuspectsCount) * 100))
        : 0;
      breakdown.push({
        label: 'Network Density',
        value: networkValue,
        weight: 0.20,
        weighted: Math.round(networkValue * 0.20)
      });

      // ── Factor 3: Activity Status (15%) ──
      const activityValue = suspect.isActive ? 100 : 0;
      breakdown.push({
        label: 'Activity Status',
        value: activityValue,
        weight: 0.15,
        weighted: Math.round(activityValue * 0.15)
      });

      // ── Factor 4: Call Activity (15%) ──
      const calls = this.suspectService.getCallHistory(suspect.id);
      const monitoredCalls = calls.filter(c => c.isMonitored);
      const monitoredRatio = calls.length > 0 ? monitoredCalls.length / calls.length : 0;
      const volumeFactor = Math.min(1, Math.log10(calls.length + 1) / 1.5);
      const callValue = Math.round(Math.min(100, monitoredRatio * volumeFactor * 100 + (calls.length > 3 ? 30 : 0)));
      breakdown.push({
        label: 'Call Activity',
        value: callValue,
        weight: 0.15,
        weighted: Math.round(callValue * 0.15)
      });

      // ── Factor 5: Zone Proximity (10%) ──
      const crimeZones = zones.filter(z => z.type === 'crime-scene' || z.severity === 'critical' || z.severity === 'high');
      let minDist = Infinity;
      crimeZones.forEach(z => {
        const dist = this.haversineDistance(suspect.lat, suspect.lng, z.lat, z.lng);
        if (dist < minDist) minDist = dist;
      });
      // Within 200m → 100, 2000m → 0
      const zoneValue = minDist === Infinity ? 0 : Math.round(Math.max(0, Math.min(100, (1 - minDist / 2000) * 100)));
      breakdown.push({
        label: 'Zone Proximity',
        value: zoneValue,
        weight: 0.10,
        weighted: Math.round(zoneValue * 0.10)
      });

      // ── Factor 6: Cross-Case Involvement (10%) ──
      const crossCaseValue = Math.min(100, (suspect.casesInvolved?.length || 0) * 33);
      breakdown.push({
        label: 'Cross-Case',
        value: crossCaseValue,
        weight: 0.10,
        weighted: Math.round(crossCaseValue * 0.10)
      });

      // Total
      const totalScore = breakdown.reduce((sum, b) => sum + b.weighted, 0);

      // Recommendations
      const recommendedActions = this.generateRecommendations(breakdown, suspect);

      return { suspect, totalScore, breakdown, recommendedActions };
    });

    // Sort descending by total score
    suspectScores.sort((a, b) => b.totalScore - a.totalScore);

    // Overall risk
    const avgScore = suspectScores.length > 0
      ? Math.round(suspectScores.reduce((s, ss) => s + ss.totalScore, 0) / suspectScores.length)
      : 0;

    let overallRisk: 'critical' | 'high' | 'medium' | 'low';
    if (avgScore >= 75) overallRisk = 'critical';
    else if (avgScore >= 55) overallRisk = 'high';
    else if (avgScore >= 35) overallRisk = 'medium';
    else overallRisk = 'low';

    const summary = this.generateCaseSummary(caseItem, suspectScores, overallRisk);

    return { overallRisk, overallRiskScore: avgScore, summary, suspectScores };
  }

  /** Haversine distance in meters */
  private haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000;
    const toRad = (deg: number) => deg * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  /** Generate recommended actions based on high-scoring factors */
  private generateRecommendations(breakdown: ScoreBreakdown[], suspect: Suspect): string[] {
    const actions: string[] = [];

    breakdown.forEach(b => {
      if (b.value >= 60) {
        switch (b.label) {
          case 'Threat Score':
            actions.push('Prioritize surveillance — high threat level');
            break;
          case 'Network Density':
            actions.push('Monitor communications with linked suspects');
            break;
          case 'Activity Status':
            actions.push('Deploy field units for active tracking');
            break;
          case 'Call Activity':
            actions.push('Intercept and analyze call patterns');
            break;
          case 'Zone Proximity':
            actions.push('Track movement near crime scenes');
            break;
          case 'Cross-Case':
            actions.push('Cross-reference with other active cases');
            break;
        }
      }
    });

    if (actions.length === 0) {
      actions.push('Continue routine monitoring');
    }
    return actions;
  }

  /** Generate case summary text */
  private generateCaseSummary(
    caseItem: Case,
    scores: SuspectFocusScore[],
    risk: 'critical' | 'high' | 'medium' | 'low'
  ): string {
    const topSuspect = scores.length > 0 ? scores[0] : null;

    const riskMessages: Record<string, string> = {
      critical: 'Immediate attention required. Multiple high-risk suspects with strong interconnections.',
      high: 'Elevated risk detected. Key suspects show significant activity patterns.',
      medium: 'Moderate risk level. Some suspects warrant closer investigation.',
      low: 'Low overall risk. Routine monitoring is recommended.'
    };

    let summary = riskMessages[risk];
    if (topSuspect) {
      summary += ` Primary focus: ${topSuspect.suspect.name} (score: ${topSuspect.totalScore}).`;
    }
    return summary;
  }

  /** Color mapping for risk levels */
  getRiskColor(risk: string): string {
    switch (risk) {
      case 'critical': return '#d32f2f';
      case 'high': return '#ff9800';
      case 'medium': return '#ffc107';
      case 'low': return '#4caf50';
      default: return '#757575';
    }
  }

  /** Get bar color for breakdown values */
  getBarColor(value: number): string {
    if (value >= 75) return '#d32f2f';
    if (value >= 50) return '#ff9800';
    if (value >= 25) return '#ffc107';
    return '#4caf50';
  }
}
