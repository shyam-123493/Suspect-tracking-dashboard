export type AlertType = 'meeting' | 'zone-entry' | 'zone-exit' | 'high-risk' | 'case-related';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  timestamp: Date;
  suspect1?: number; // Suspect ID
  suspect2?: number; // Suspect ID (for meeting alerts)
  location: string;
  lat: number;
  lng: number;
  description: string;
  distance?: number; // For meeting detection
  isDismissed: boolean;
  dismissedAt?: Date;
}
