import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Case, Association } from '@shared/interfaces';
import { DUMMY_CASES, DUMMY_ASSOCIATIONS } from '@shared/utils/dummy-data.util';

@Injectable({
  providedIn: 'root'
})
export class CaseService {
  private casesSubject = new BehaviorSubject<Case[]>(
    JSON.parse(JSON.stringify(DUMMY_CASES))
  );
  public cases$ = this.casesSubject.asObservable();

  constructor() {}

  /**
   * Get all cases as Observable
   */
  getAllCases(): Observable<Case[]> {
    return this.cases$;
  }

  /**
   * Get all cases array (current value)
   */
  getAllCasesArray(): Case[] {
    return this.casesSubject.value;
  }

  /**
   * Get case by ID
   */
  getCaseById(id: number): Case | undefined {
    return this.casesSubject.value.find(c => c.id === id);
  }

  /**
   * Get open cases
   */
  getOpenCases(): Case[] {
    return this.casesSubject.value.filter(c => c.status === 'open' || c.status === 'under_investigation');
  }

  /**
   * Get cases by suspect ID
   */
  getCasesBySuspect(suspectId: number): Case[] {
    return this.casesSubject.value.filter(c => c.suspects.includes(suspectId));
  }

  /**
   * Get cases by status
   */
  getCasesByStatus(status: string): Case[] {
    return this.casesSubject.value.filter(c => c.status === status);
  }

  /**
   * Get high priority cases
   */
  getHighPriorityCases(): Case[] {
    return this.casesSubject.value.filter(c => c.priority === 'critical' || c.priority === 'high');
  }

  /**
   * Add case (future feature)
   */
  addCase(caseData: Case): void {
    const cases = this.casesSubject.value;
    cases.push(caseData);
    this.casesSubject.next([...cases]);
  }

  /**
   * Get all associations
   */
  getAllAssociations(): Association[] {
    return DUMMY_ASSOCIATIONS;
  }

  /**
   * Get associations for a specific suspect
   */
  getAssociationsForSuspect(suspectId: number): Association[] {
    return DUMMY_ASSOCIATIONS.filter(
      a => a.suspect1Id === suspectId || a.suspect2Id === suspectId
    );
  }

  /**
   * Update case
   */
  updateCase(caseData: Case): void {
    const cases = this.casesSubject.value;
    const index = cases.findIndex(c => c.id === caseData.id);
    if (index !== -1) {
      cases[index] = caseData;
      this.casesSubject.next([...cases]);
    }
  }
}
