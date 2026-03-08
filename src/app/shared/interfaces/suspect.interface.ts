export interface Suspect {
  id: number;
  name: string;
  age: number;
  photo: string;
  threatLevel: 'low' | 'medium' | 'high';
  threatScore: number; // 0-100
  lat: number;
  lng: number;
  speed: number; // km/h
  direction: number; // degrees 0-360
  vehicle: string;
  lastKnownLocation: string;
  associates: number[]; // IDs of associated suspects
  casesInvolved: number[];
  isActive: boolean;
  createdDate: Date;
}
