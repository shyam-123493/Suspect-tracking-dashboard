import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SimulationService } from '@core/services/simulation.service';
import { SuspectService } from '@core/services/suspect.service';
import { Suspect } from '@shared/interfaces';
import { Subscription } from 'rxjs';
import * as L from 'leaflet';
import 'leaflet.heat';

@Component({
  selector: 'app-investigation-map',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatCardModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './investigation-map.component.html',
  styleUrl: './investigation-map.component.scss'
})
export class InvestigationMapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapElement', { static: false }) mapElement!: ElementRef;

  isRunning = false;
  showTravelHistory = false;
  showZones = true;
  showHeatmap = false;
  selectedSuspect: Suspect | null = null;
  isMapLoading = true;

  /** Single-suspect tracking mode */
  singleSuspectMode = false;
  focusedSuspectId: number | null = null;
  focusedSuspect: Suspect | null = null;

  private map!: L.Map;
  private markerLayer = L.featureGroup();
  private zoneLayer = L.featureGroup();
  private travelLayer = L.featureGroup();
  private trailLayer = L.featureGroup();
  private suspects: Suspect[] = [];
  private suspectMarkers: Map<number | string, L.Marker> = new Map();
  private trailCoords: Map<number, [number, number][]> = new Map();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private heatLayer: any = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private simulationService: SimulationService,
    private suspectService: SuspectService,
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const suspectId = params['suspect'] ? Number(params['suspect']) : null;
      if (suspectId) {
        this.focusedSuspectId = suspectId;
        this.singleSuspectMode = true;
        this.showTravelHistory = true;
        this.focusedSuspect = this.suspectService.getSuspectById(suspectId) || null;
      }
    });
    this.setupSubscriptions();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeMap();
      this.isMapLoading = false;
    }, 300);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.map) {
      this.map.remove();
    }
  }

  private initializeMap() {
    const el = this.mapElement.nativeElement;
    this.map = L.map(el, {
      center: [19.0760, 72.8777],
      zoom: 12,
      zoomControl: true,
      attributionControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    this.markerLayer.addTo(this.map);
    this.zoneLayer.addTo(this.map);
    this.travelLayer.addTo(this.map);
    this.trailLayer.addTo(this.map);

    this.map.invalidateSize({ animate: false });
    this.suspects = this.suspectService.getAllSuspectsArray();

    if (this.singleSuspectMode && this.focusedSuspectId) {
      this.initSingleSuspectMode();
    } else {
      this.fitMapToSuspects();
      this.map.invalidateSize({ animate: false });
      this.updateMapMarkers();
      this.drawZones();
    }
  }

  private initSingleSuspectMode() {
    const suspect = this.suspects.find(s => s.id === this.focusedSuspectId);
    if (!suspect) return;

    this.focusedSuspect = suspect;
    this.selectedSuspect = suspect;

    // Build travel trail: historical locations + current position
    const history = this.suspectService.getTravelHistory(suspect.id);
    const trailPoints: [number, number][] = [];
    const sorted = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    sorted.forEach(h => trailPoints.push([h.lat, h.lng]));
    trailPoints.push([suspect.lat, suspect.lng]);

    this.trailCoords.set(suspect.id, trailPoints);

    // Draw trail polyline
    this.drawSuspectTrail(suspect, trailPoints);

    // Add historical location markers
    sorted.forEach((h, i) => {
      const histMarker = L.circleMarker([h.lat, h.lng], {
        radius: 7,
        fillColor: '#fff',
        color: this.getThreatColor(suspect.threatLevel),
        weight: 3,
        fillOpacity: 1
      });
      histMarker.bindPopup(`
        <div style="font-size:12px;">
          <strong>${h.location}</strong><br>
          ${h.action} - ${new Date(h.date).toLocaleDateString()}<br>
          Duration: ${h.duration || 'N/A'} min<br>
          <span style="color:#999;">${h.lat.toFixed(4)}, ${h.lng.toFixed(4)}</span>
        </div>
      `);
      histMarker.bindTooltip(`Stop ${i + 1}: ${h.location}`, { direction: 'top', offset: [0, -8] });
      histMarker.addTo(this.trailLayer);
    });

    // Add current position marker
    const icon = this.createSuspectIcon(suspect);
    const marker = L.marker([suspect.lat, suspect.lng], { icon });
    marker.bindPopup(this.buildPopupContent(suspect), { maxWidth: 250, className: 'suspect-popup' });
    marker.bindTooltip(`${suspect.name} | ${suspect.speed} km/h | LIVE`, { direction: 'top', offset: [0, -25], permanent: true });
    marker.on('click', () => {
      this.ngZone.run(() => { this.selectedSuspect = suspect; });
    });
    marker.addTo(this.markerLayer);
    this.suspectMarkers.set(suspect.id, marker);

    // Fit map to trail bounds
    if (trailPoints.length > 1) {
      const bounds = L.latLngBounds(trailPoints);
      this.map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14, animate: false });
    } else {
      this.map.setView([suspect.lat, suspect.lng], 14, { animate: false });
    }

    this.drawZones();
  }

  private drawSuspectTrail(suspect: Suspect, points: [number, number][]) {
    if (points.length < 2) return;
    const color = this.getThreatColor(suspect.threatLevel);

    const polyline = L.polyline(points, {
      color,
      weight: 4,
      opacity: 0.7,
      smoothFactor: 1,
      dashArray: '10 6'
    });
    polyline.addTo(this.trailLayer);

    // Direction indicators at midpoints
    for (let i = 1; i < points.length; i++) {
      const midLat = (points[i - 1][0] + points[i][0]) / 2;
      const midLng = (points[i - 1][1] + points[i][1]) / 2;
      L.circleMarker([midLat, midLng], {
        radius: 4, fillColor: color, color: '#fff', weight: 2, fillOpacity: 1
      }).addTo(this.trailLayer);
    }
  }

  private fitMapToSuspects() {
    if (this.suspects.length === 0) {
      this.map.setView([19.0760, 72.8777], 13);
      return;
    }
    const bounds = L.latLngBounds(this.suspects.map(s => [s.lat, s.lng] as [number, number]));
    this.map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14, animate: false });
    if (this.map.getZoom() < 12) {
      this.map.setZoom(12, { animate: false });
    }
  }

  private setupSubscriptions() {
    this.subscriptions.push(
      this.simulationService.isRunning$.subscribe(running => { this.isRunning = running; })
    );

    this.subscriptions.push(
      this.suspectService.suspects$.subscribe(suspects => {
        this.suspects = suspects;
        if (this.map) {
          if (this.singleSuspectMode && this.focusedSuspectId) {
            this.updateSingleSuspectTracking();
          } else {
            this.updateMapMarkers();
            if (this.showTravelHistory) { this.drawTravelHistory(); }
            if (this.showHeatmap) { this.drawHeatmap(); }
          }
        }
      })
    );
  }

  private updateSingleSuspectTracking() {
    const suspect = this.suspects.find(s => s.id === this.focusedSuspectId);
    if (!suspect) return;

    this.focusedSuspect = suspect;
    if (this.selectedSuspect?.id === suspect.id) { this.selectedSuspect = suspect; }

    if (this.suspectMarkers.has(suspect.id)) {
      const marker = this.suspectMarkers.get(suspect.id)!;
      marker.setLatLng([suspect.lat, suspect.lng]);
      marker.setPopupContent(this.buildPopupContent(suspect));
      marker.setTooltipContent(`${suspect.name} | ${suspect.speed} km/h | LIVE`);
    }

    // Extend trail with new position
    const trail = this.trailCoords.get(suspect.id);
    if (trail) {
      trail.push([suspect.lat, suspect.lng]);
      this.trailLayer.clearLayers();
      const history = this.suspectService.getTravelHistory(suspect.id);
      const sorted = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      sorted.forEach((h, i) => {
        const hm = L.circleMarker([h.lat, h.lng], {
          radius: 7, fillColor: '#fff', color: this.getThreatColor(suspect.threatLevel), weight: 3, fillOpacity: 1
        });
        hm.bindTooltip(`Stop ${i + 1}: ${h.location}`, { direction: 'top', offset: [0, -8] });
        hm.addTo(this.trailLayer);
      });
      this.drawSuspectTrail(suspect, trail);
    }
  }

  private updateMapMarkers() {
    this.suspects.forEach(suspect => {
      if (this.suspectMarkers.has(suspect.id)) {
        const marker = this.suspectMarkers.get(suspect.id)!;
        marker.setLatLng([suspect.lat, suspect.lng]);
        marker.setPopupContent(this.buildPopupContent(suspect));
        marker.setTooltipContent(`${suspect.name} | ${suspect.speed} km/h | ${suspect.threatLevel.toUpperCase()}`);
      } else {
        const icon = this.createSuspectIcon(suspect);
        const marker = L.marker([suspect.lat, suspect.lng], { icon });
        marker.bindPopup(this.buildPopupContent(suspect), { maxWidth: 250, className: 'suspect-popup' });
        marker.bindTooltip(`${suspect.name} | ${suspect.speed} km/h | ${suspect.threatLevel.toUpperCase()}`, { direction: 'top', offset: [0, -25] });
        marker.on('click', () => {
          this.ngZone.run(() => { this.selectedSuspect = suspect; });
        });
        marker.addTo(this.markerLayer);
        this.suspectMarkers.set(suspect.id, marker);
      }
    });
  }

  private buildPopupContent(suspect: Suspect): string {
    const color = this.getThreatColor(suspect.threatLevel);
    return `
      <div style="font-size:13px; line-height:1.6; min-width:180px;">
        <div style="font-size:15px; font-weight:700; margin-bottom:4px; color:${color};">${suspect.name}</div>
        <div style="display:flex; align-items:center; gap:6px; margin-bottom:6px;">
          <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${color};"></span>
          <span style="font-weight:600; text-transform:uppercase; font-size:11px; color:${color};">${suspect.threatLevel} THREAT</span>
        </div>
        <div><b>Location:</b> ${suspect.lat.toFixed(4)}, ${suspect.lng.toFixed(4)}</div>
        <div><b>Speed:</b> ${suspect.speed} km/h</div>
        <div><b>Vehicle:</b> ${suspect.vehicle}</div>
        <div><b>Last Known:</b> ${suspect.lastKnownLocation || 'N/A'}</div>
        <div><b>Associates:</b> ${suspect.associates.length} linked</div>
      </div>
    `;
  }

  private drawZones() {
    this.zoneLayer.clearLayers();
    const zones = this.suspectService.getZones();
    zones.forEach(zone => {
      const color = this.getZoneColor(zone.type);
      // Circle with higher opacity for better visibility
      const circle = L.circle([zone.lat, zone.lng], {
        radius: zone.radius,
        fillColor: color,
        color,
        weight: 3,
        opacity: 0.8,
        fillOpacity: 0.25,
        dashArray: zone.severity === 'critical' ? '' : '8 4'
      });
      circle.bindPopup(`
        <div style="font-size:13px; line-height:1.5;">
          <div style="font-weight:700; color:${color}; font-size:14px; margin-bottom:4px;">${zone.name}</div>
          <div><b>Type:</b> ${zone.type.replace('-', ' ').toUpperCase()}</div>
          <div><b>Severity:</b> <span style="color:${zone.severity === 'critical' ? '#d32f2f' : '#ff9800'}; font-weight:600;">${zone.severity.toUpperCase()}</span></div>
          <div><b>Radius:</b> ${zone.radius}m</div>
          <div style="color:#666; margin-top:4px;">${zone.description}</div>
        </div>
      `);
      circle.addTo(this.zoneLayer);

      // Add zone label marker at center
      const labelIcon = L.divIcon({
        className: 'zone-label-icon',
        html: `<div style="
          background: ${color};
          color: white;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          white-space: nowrap;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
          text-align: center;
          opacity: 0.9;
        ">${zone.name}</div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });
      L.marker([zone.lat, zone.lng], { icon: labelIcon, interactive: false }).addTo(this.zoneLayer);
    });
  }

  private drawTravelHistory() {
    this.travelLayer.clearLayers();
    if (!this.showTravelHistory) return;
    this.suspects.forEach(suspect => {
      const history = this.suspectService.getTravelHistory(suspect.id);
      if (history && history.length > 1) {
        const latlngs: [number, number][] = history.map(h => [h.lat, h.lng]);
        L.polyline(latlngs, { color: this.getThreatColor(suspect.threatLevel), weight: 3, opacity: 0.6, dashArray: '8 4' })
          .addTo(this.travelLayer);
      }
    });
  }

  private getThreatColor(threat: string): string {
    switch (threat.toLowerCase()) {
      case 'high': return '#d32f2f';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#757575';
    }
  }

  private getZoneColor(type: string): string {
    switch (type.toLowerCase()) {
      case 'crime-scene': return '#d32f2f';
      case 'airport': return '#e65100';
      case 'bank': return '#1565c0';
      case 'police-hq': return '#2e7d32';
      default: return '#757575';
    }
  }

  toggleSimulation() { this.simulationService.toggleSimulation(); }
  closeSuspectInfo() { this.selectedSuspect = null; }

  showAllSuspects() {
    this.singleSuspectMode = false;
    this.focusedSuspectId = null;
    this.focusedSuspect = null;
    this.selectedSuspect = null;
    this.markerLayer.clearLayers();
    this.trailLayer.clearLayers();
    this.travelLayer.clearLayers();
    this.suspectMarkers.clear();
    this.trailCoords.clear();
    this.suspects = this.suspectService.getAllSuspectsArray();
    this.fitMapToSuspects();
    this.map.invalidateSize({ animate: false });
    this.updateMapMarkers();
    this.router.navigate(['/map'], { queryParams: {} });
  }

  onShowTravelHistoryChange() { this.drawTravelHistory(); }
  onShowZonesChange() {
    if (this.showZones) { this.zoneLayer.addTo(this.map); } else { this.map.removeLayer(this.zoneLayer); }
  }
  onShowHeatmapChange() {
    if (this.showHeatmap) {
      this.drawHeatmap();
    } else {
      this.removeHeatmap();
    }
  }

  private drawHeatmap() {
    this.removeHeatmap();

    // Build heat points from all suspect locations + their travel history
    const heatPoints: [number, number, number][] = [];

    this.suspects.forEach(suspect => {
      // Current position - intensity based on threat score
      const intensity = suspect.threatScore / 100;
      heatPoints.push([suspect.lat, suspect.lng, intensity]);

      // Add travel history locations
      const history = this.suspectService.getTravelHistory(suspect.id);
      history.forEach(h => {
        heatPoints.push([h.lat, h.lng, intensity * 0.6]);
      });
    });

    // Create heat layer using leaflet.heat
    this.heatLayer = (L as any).heatLayer(heatPoints, {
      radius: 50,
      blur: 30,
      maxZoom: 13,
      max: 1.0,
      minOpacity: 0.4,
      gradient: {
        0.2: '#0000ff',
        0.4: '#00ccff',
        0.6: '#00ff00',
        0.8: '#ffff00',
        1.0: '#ff0000'
      }
    });
    this.heatLayer.addTo(this.map);
  }

  private removeHeatmap() {
    if (this.heatLayer) {
      this.map.removeLayer(this.heatLayer);
      this.heatLayer = null;
    }
  }

  private createSuspectIcon(suspect: Suspect): L.DivIcon {
    const color = this.getThreatColor(suspect.threatLevel);
    const initials = suspect.name.split(' ').map(n => n.charAt(0)).join('');
    const pulse = suspect.threatLevel === 'high'
      ? `<div class="pulse-ring" style="border-color:${color};"></div>` : '';

    return L.divIcon({
      className: 'suspect-div-icon',
      html: `
        <div class="suspect-marker-wrapper">
          ${pulse}
          <div class="marker-dot" style="background:${color}; border-color:${color};">
            <span class="marker-initials">${initials}</span>
          </div>
          <span class="marker-label">${suspect.name.split(' ')[0]}</span>
          <span class="marker-speed">${suspect.speed} km/h</span>
        </div>
      `,
      iconSize: [42, 60],
      iconAnchor: [21, 50],
      popupAnchor: [0, -50]
    });
  }
}
