export interface TravelHistory {
  id: string;
  suspectId: number;
  date: Date;
  location: string;
  lat: number;
  lng: number;
  action: 'arrived' | 'departed' | 'passed_through' | 'stayed';
  duration?: number; // minutes stayed
  notes?: string;
}
