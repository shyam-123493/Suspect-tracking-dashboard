/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in meters
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Check if a point is within a circle (geofence)
 * @param pointLat Latitude of point to check
 * @param pointLng Longitude of point to check
 * @param centerLat Latitude of circle center
 * @param centerLng Longitude of circle center
 * @param radiusMeters Radius of circle in meters
 * @returns True if point is within circle
 */
export function isPointInCircle(
  pointLat: number,
  pointLng: number,
  centerLat: number,
  centerLng: number,
  radiusMeters: number
): boolean {
  const distance = calculateHaversineDistance(
    pointLat,
    pointLng,
    centerLat,
    centerLng
  );
  return distance <= radiusMeters;
}

/**
 * Get direction/bearing between two points
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Bearing in degrees (0-360)
 */
export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);

  return ((θ * 180) / Math.PI + 360) % 360;
}

/**
 * Format distance for display
 * @param meters Distance in meters
 * @returns Formatted distance string
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return Math.round(meters) + ' m';
  }
  return (meters / 1000).toFixed(2) + ' km';
}

/**
 * Get location name from coordinates (simulated)
 * @param lat Latitude
 * @param lng Longitude
 * @returns Location name
 */
export function getLocationName(lat: number, lng: number): string {
  // Simulated location mapping for Mumbai areas
  const locations = [
    { name: 'Dadar', lat: 19.0160, lng: 72.8395 },
    { name: 'Bandra', lat: 19.1136, lng: 72.8697 },
    { name: 'Andheri', lat: 19.1459, lng: 72.8627 },
    { name: 'Powai', lat: 19.2183, lng: 72.9781 },
    { name: 'Colaba', lat: 19.0176, lng: 72.8479 },
    { name: 'Marine Lines', lat: 19.0760, lng: 72.9081 },
    { name: 'Fort', lat: 19.0883, lng: 72.8385 }
  ];

  let closestLocation = locations[0];
  let minDistance = calculateHaversineDistance(
    lat,
    lng,
    closestLocation.lat,
    closestLocation.lng
  );

  for (const location of locations) {
    const distance = calculateHaversineDistance(lat, lng, location.lat, location.lng);
    if (distance < minDistance) {
      minDistance = distance;
      closestLocation = location;
    }
  }

  return closestLocation.name;
}
