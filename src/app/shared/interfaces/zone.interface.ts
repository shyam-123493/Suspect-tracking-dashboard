export type ZoneType = 'crime-scene' | 'airport' | 'bank' | 'police-hq' | 'restricted';

export interface Zone {
  id: string;
  name: string;
  type: ZoneType;
  lat: number;
  lng: number;
  radius: number; // meters
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  createdDate: Date;
  color: string; // hex color for map display
}
