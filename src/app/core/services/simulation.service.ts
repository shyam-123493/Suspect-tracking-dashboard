import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Observable, Subscription } from 'rxjs';
import { Suspect, Alert, Zone } from '@shared/interfaces';
import { SuspectService } from './suspect.service';
import { AlertService } from './alert.service';
import { LocationService } from './location.service';
import { getRandomMumbaiLocation } from '@shared/utils/dummy-data.util';
import { DUMMY_ZONES } from '@shared/utils/dummy-data.util';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  private isRunningSubject = new BehaviorSubject<boolean>(false);
  public isRunning$ = this.isRunningSubject.asObservable();

  private simulationSubscription: Subscription | null = null;
  private lastMeetingCheck: Map<string, number> = new Map(); // To avoid duplicate alerts
  private lastZoneCheck: Map<string, boolean> = new Map(); // Track zone entry/exit

  constructor(
    private suspectService: SuspectService,
    private alertService: AlertService,
    private locationService: LocationService
  ) {}

  /**
   * Start simulation
   */
  startSimulation(): void {
    if (this.isRunningSubject.value) return;

    this.isRunningSubject.next(true);

    // Simulation runs every 5 seconds
    this.simulationSubscription = interval(5000).subscribe(() => {
      this.updateSuspectLocations();
      this.detectMeetings();
      this.detectZoneEntry();
    });
  }

  /**
   * Pause simulation
   */
  pauseSimulation(): void {
    if (!this.isRunningSubject.value) return;

    this.isRunningSubject.next(false);
    if (this.simulationSubscription) {
      this.simulationSubscription.unsubscribe();
      this.simulationSubscription = null;
    }
  }

  /**
   * Resume simulation
   */
  resumeSimulation(): void {
    this.startSimulation();
  }

  /**
   * Toggle simulation
   */
  toggleSimulation(): void {
    if (this.isRunningSubject.value) {
      this.pauseSimulation();
    } else {
      this.startSimulation();
    }
  }

  /**
   * Stop simulation
   */
  stopSimulation(): void {
    this.pauseSimulation();
  }

  /**
   * Check if simulation is running
   */
  isRunning(): boolean {
    return this.isRunningSubject.value;
  }

  /**
   * Update suspect locations with random movement
   */
  private updateSuspectLocations(): void {
    const suspects = this.suspectService.getActiveSuspects();

    suspects.forEach(suspect => {
      // Random movement within small bounds
      const latVariation = (Math.random() - 0.5) * 0.002;
      const lngVariation = (Math.random() - 0.5) * 0.002;

      const newLat = suspect.lat + latVariation;
      const newLng = suspect.lng + lngVariation;

      // Random speed (20-60 km/h)
      const newSpeed = 20 + Math.random() * 40;

      // Random direction
      const newDirection = Math.random() * 360;

      this.suspectService.updateSuspectLocation(
        suspect.id,
        newLat,
        newLng,
        newSpeed,
        newDirection
      );

      // Update last known location
      const locationName = this.locationService.getLocationName(newLat, newLng);
      this.suspectService.updateSuspectLastLocation(suspect.id, locationName);
    });
  }

  /**
   * Detect meetings between suspects (< 200 meters)
   */
  private detectMeetings(): void {
    const suspects = this.suspectService.getActiveSuspects();
    const MEETING_DISTANCE = 200; // meters
    const MEETING_COOLDOWN = 60000; // 60 seconds to avoid duplicate alerts

    for (let i = 0; i < suspects.length; i++) {
      for (let j = i + 1; j < suspects.length; j++) {
        const suspect1 = suspects[i];
        const suspect2 = suspects[j];

        const distance = this.locationService.calculateDistance(
          suspect1.lat,
          suspect1.lng,
          suspect2.lat,
          suspect2.lng
        );

        if (distance < MEETING_DISTANCE) {
          const meetingKey = `meeting_${Math.min(suspect1.id, suspect2.id)}_${Math.max(
            suspect1.id,
            suspect2.id
          )}`;
          const lastMeetingTime = this.lastMeetingCheck.get(meetingKey) || 0;
          const now = Date.now();

          if (now - lastMeetingTime > MEETING_COOLDOWN) {
            this.lastMeetingCheck.set(meetingKey, now);

            const alert: Alert = {
              id: `alert_${Date.now()}_${Math.random()}`,
              type: 'meeting',
              severity: suspect1.threatScore > 70 || suspect2.threatScore > 70 ? 'high' : 'medium',
              timestamp: new Date(),
              suspect1: suspect1.id,
              suspect2: suspect2.id,
              location: this.locationService.getLocationName(suspect1.lat, suspect1.lng),
              lat: suspect1.lat,
              lng: suspect1.lng,
              description: `${suspect1.name} met ${suspect2.name} near ${this.locationService.getLocationName(suspect1.lat, suspect1.lng)}`,
              distance: Math.round(distance),
              isDismissed: false
            };

            this.alertService.addAlert(alert);
          }
        }
      }
    }
  }

  /**
   * Detect zone entry/exit
   */
  private detectZoneEntry(): void {
    const suspects = this.suspectService.getActiveSuspects();
    const zones = DUMMY_ZONES;

    suspects.forEach(suspect => {
      zones.forEach(zone => {
        const isInZone = this.locationService.isPointInZone(
          suspect.lat,
          suspect.lng,
          zone.lat,
          zone.lng,
          zone.radius
        );

        const zoneKey = `${suspect.id}_${zone.id}`;
        const wasInZone = this.lastZoneCheck.get(zoneKey) || false;

        if (isInZone && !wasInZone) {
          // Entry alert
          this.lastZoneCheck.set(zoneKey, true);

          const alert: Alert = {
            id: `alert_${Date.now()}_${Math.random()}`,
            type: 'zone-entry',
            severity: zone.severity as any,
            timestamp: new Date(),
            suspect1: suspect.id,
            location: zone.name,
            lat: zone.lat,
            lng: zone.lng,
            description: `${suspect.name} entered restricted ${zone.name} zone`,
            isDismissed: false
          };

          this.alertService.addAlert(alert);
        } else if (!isInZone && wasInZone) {
          // Exit alert
          this.lastZoneCheck.set(zoneKey, false);

          const alert: Alert = {
            id: `alert_${Date.now()}_${Math.random()}`,
            type: 'zone-exit',
            severity: 'low',
            timestamp: new Date(),
            suspect1: suspect.id,
            location: zone.name,
            lat: zone.lat,
            lng: zone.lng,
            description: `${suspect.name} exited ${zone.name} zone`,
            isDismissed: false
          };

          this.alertService.addAlert(alert);
        }
      });
    });
  }
}
