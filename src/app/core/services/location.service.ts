import { Injectable } from '@angular/core';
import {
  calculateHaversineDistance,
  isPointInCircle,
  calculateBearing,
  formatDistance,
  getLocationName
} from '@shared/utils/geolocation.util';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor() {}

  /**
   * Calculate distance between two points
   */
  calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    return calculateHaversineDistance(lat1, lng1, lat2, lng2);
  }

  /**
   * Calculate distance and return formatted string
   */
  calculateFormattedDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): string {
    const distance = this.calculateDistance(lat1, lng1, lat2, lng2);
    return formatDistance(distance);
  }

  /**
   * Check if point is within circle
   */
  isPointInZone(
    pointLat: number,
    pointLng: number,
    zoneLat: number,
    zoneLng: number,
    radiusMeters: number
  ): boolean {
    return isPointInCircle(pointLat, pointLng, zoneLat, zoneLng, radiusMeters);
  }

  /**
   * Calculate bearing between two points
   */
  calculateBearing(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    return calculateBearing(lat1, lng1, lat2, lng2);
  }

  /**
   * Get location name from coordinates
   */
  getLocationName(lat: number, lng: number): string {
    return getLocationName(lat, lng);
  }

  /**
   * Get distance in meters as a number
   */
  getDistanceInMeters(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    return Math.round(this.calculateDistance(lat1, lng1, lat2, lng2));
  }

  /**
   * Get compass direction from bearing
   */
  getCompassDirection(bearing: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                        'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(bearing / 22.5) % 16;
    return directions[index];
  }
}
