export type CaseStatus = 'open' | 'under_investigation' | 'closed' | 'solved' | 'archived';

export interface CaseDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedDate: Date;
  uploadedBy: string;
}

export interface Case {
  id: number;
  title: string;
  description: string;
  status: CaseStatus;
  suspects: number[]; // Suspect IDs
  createdDate: Date;
  updatedDate: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  notes: string;
  caseOfficer?: string;
  documents?: CaseDocument[];
}
