export type CallType = 'incoming' | 'outgoing' | 'missed';

export interface CallHistory {
  id: string;
  suspectId: number;
  contactName: string;
  contactNumber: string;
  callType: CallType;
  timestamp: Date;
  duration: number; // seconds, 0 for missed
  location: string;
  isMonitored: boolean;
  notes?: string;
}
