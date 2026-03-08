import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Suspect, Zone, TravelHistory, CallHistory } from '@shared/interfaces';
import { DUMMY_SUSPECTS, DUMMY_ZONES, DUMMY_TRAVEL_HISTORY, DUMMY_CALL_HISTORY } from '@shared/utils/dummy-data.util';

@Injectable({
  providedIn: 'root'
})
export class SuspectService {
  private suspectsSubject = new BehaviorSubject<Suspect[]>(
    JSON.parse(JSON.stringify(DUMMY_SUSPECTS))
  );
  public suspects$ = this.suspectsSubject.asObservable();

  constructor() {}

  /**
   * Get all suspects as Observable
   */
  getAllSuspects(): Observable<Suspect[]> {
    return this.suspects$;
  }

  /**
   * Get all suspects as array (current value)
   */
  getAllSuspectsArray(): Suspect[] {
    return this.suspectsSubject.value;
  }

  /**
   * Get suspect by ID
   */
  getSuspectById(id: number): Suspect | undefined {
    return this.suspectsSubject.value.find(s => s.id === id);
  }

  /**
   * Update suspect location (used by simulation)
   */
  updateSuspectLocation(id: number, lat: number, lng: number, speed: number, direction: number): void {
    const suspects = this.suspectsSubject.value;
    const index = suspects.findIndex(s => s.id === id);
    if (index !== -1) {
      suspects[index] = {
        ...suspects[index],
        lat,
        lng,
        speed,
        direction
      };
      this.suspectsSubject.next([...suspects]);
    }
  }

  /**
   * Update suspect last known location
   */
  updateSuspectLastLocation(id: number, location: string): void {
    const suspects = this.suspectsSubject.value;
    const index = suspects.findIndex(s => s.id === id);
    if (index !== -1) {
      suspects[index] = {
        ...suspects[index],
        lastKnownLocation: location
      };
      this.suspectsSubject.next([...suspects]);
    }
  }

  /**
   * Get active suspects
   */
  getActiveSuspects(): Suspect[] {
    return this.suspectsSubject.value.filter(s => s.isActive);
  }

  /**
   * Get high threat suspects
   */
  getHighThreatSuspects(): Suspect[] {
    return this.suspectsSubject.value.filter(s => s.threatLevel === 'high');
  }

  /**
   * Get suspects by case ID
   */
  getSuspectsByCase(caseId: number): Suspect[] {
    return this.suspectsSubject.value.filter(s => s.casesInvolved.includes(caseId));
  }

  /**
   * Get suspect associates
   */
  getSuspectAssociates(suspectId: number): Suspect[] {
    const suspect = this.getSuspectById(suspectId);
    if (!suspect) return [];
    return this.suspectsSubject.value.filter(s => suspect.associates.includes(s.id));
  }

  /**
   * Get all zones
   */
  getZones(): Zone[] {
    return DUMMY_ZONES;
  }

  /**
   * Get travel history for a suspect
   */
  getTravelHistory(suspectId: number): TravelHistory[] {
    return DUMMY_TRAVEL_HISTORY.filter(h => h.suspectId === suspectId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  /**
   * Get all travel history
   */
  getAllTravelHistory(): TravelHistory[] {
    return DUMMY_TRAVEL_HISTORY;
  }

  /**
   * Get call history for a suspect
   */
  getCallHistory(suspectId: number): CallHistory[] {
    return DUMMY_CALL_HISTORY.filter(c => c.suspectId === suspectId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}
