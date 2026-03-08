export type RelationType = 'known_associate' | 'family' | 'business_partner' | 'suspect' | 'informant' | 'accomplice';

export interface Association {
  id: string;
  suspect1Id: number;
  suspect2Id: number;
  relationType: RelationType;
  strength: number; // 0-100
  notes: string;
  lastMet?: Date;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'rare' | 'unknown';
}
