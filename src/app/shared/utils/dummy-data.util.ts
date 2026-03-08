import { Suspect, Alert, TravelHistory, Zone, Case, Association, CallHistory } from '../interfaces';

// Mumbai coordinates base
const MUMBAI_CENTER = { lat: 19.0760, lng: 72.8777 };

export const DUMMY_SUSPECTS: Suspect[] = [
  {
    id: 1,
    name: 'Rohit Patil',
    age: 35,
    photo: 'https://via.placeholder.com/150?text=Rohit',
    threatLevel: 'high',
    threatScore: 85,
    lat: 19.0760,
    lng: 72.8777,
    speed: 45,
    direction: 180,
    vehicle: 'Black Honda City',
    lastKnownLocation: 'Dadar',
    associates: [2, 3, 4],
    casesInvolved: [1, 2],
    isActive: true,
    createdDate: new Date('2024-01-15')
  },
  {
    id: 2,
    name: 'Sameer Khan',
    age: 32,
    photo: 'https://via.placeholder.com/150?text=Sameer',
    threatLevel: 'medium',
    threatScore: 65,
    lat: 19.1136,
    lng: 72.8697,
    speed: 35,
    direction: 90,
    vehicle: 'White Toyota Fortuner',
    lastKnownLocation: 'Bandra',
    associates: [1, 3, 5],
    casesInvolved: [1, 3],
    isActive: true,
    createdDate: new Date('2024-02-01')
  },
  {
    id: 3,
    name: 'Arjun Mehta',
    age: 40,
    photo: 'https://via.placeholder.com/150?text=Arjun',
    threatLevel: 'high',
    threatScore: 88,
    lat: 19.0176,
    lng: 72.8479,
    speed: 50,
    direction: 270,
    vehicle: 'Red Audi A4',
    lastKnownLocation: 'Colaba',
    associates: [1, 2, 6],
    casesInvolved: [2, 4],
    isActive: true,
    createdDate: new Date('2024-01-20')
  },
  {
    id: 4,
    name: 'Rahul Sharma',
    age: 28,
    photo: 'https://via.placeholder.com/150?text=Rahul',
    threatLevel: 'low',
    threatScore: 35,
    lat: 19.1459,
    lng: 72.8627,
    speed: 30,
    direction: 45,
    vehicle: 'Silver Maruti Swift',
    lastKnownLocation: 'Andheri',
    associates: [1, 5],
    casesInvolved: [1],
    isActive: true,
    createdDate: new Date('2024-02-10')
  },
  {
    id: 5,
    name: 'Imran Sheikh',
    age: 38,
    photo: 'https://via.placeholder.com/150?text=Imran',
    threatLevel: 'medium',
    threatScore: 72,
    lat: 19.2183,
    lng: 72.9781,
    speed: 40,
    direction: 135,
    vehicle: 'Blue Mahindra XUV500',
    lastKnownLocation: 'Powai',
    associates: [2, 6, 7],
    casesInvolved: [3, 5],
    isActive: true,
    createdDate: new Date('2024-02-05')
  },
  {
    id: 6,
    name: 'Vikas Jadhav',
    age: 42,
    photo: 'https://via.placeholder.com/150?text=Vikas',
    threatLevel: 'high',
    threatScore: 82,
    lat: 19.1136,
    lng: 72.8479,
    speed: 48,
    direction: 225,
    vehicle: 'Black Mercedes C-Class',
    lastKnownLocation: 'Bandra',
    associates: [3, 5, 8],
    casesInvolved: [2, 4],
    isActive: true,
    createdDate: new Date('2024-01-25')
  },
  {
    id: 7,
    name: 'Amit Verma',
    age: 30,
    photo: 'https://via.placeholder.com/150?text=Amit',
    threatLevel: 'low',
    threatScore: 42,
    lat: 19.0760,
    lng: 72.9081,
    speed: 32,
    direction: 0,
    vehicle: 'Green Tata Nexon',
    lastKnownLocation: 'Marine Lines',
    associates: [2, 5],
    casesInvolved: [3],
    isActive: true,
    createdDate: new Date('2024-02-15')
  },
  {
    id: 8,
    name: 'Karan Singh',
    age: 36,
    photo: 'https://via.placeholder.com/150?text=Karan',
    threatLevel: 'medium',
    threatScore: 68,
    lat: 19.0883,
    lng: 72.8385,
    speed: 38,
    direction: 315,
    vehicle: 'Orange Bajaj Auto Rickshaw',
    lastKnownLocation: 'Fort',
    associates: [3, 6],
    casesInvolved: [4, 5],
    isActive: true,
    createdDate: new Date('2024-02-08')
  }
];

export const DUMMY_ZONES: Zone[] = [
  {
    id: 'zone-1',
    name: 'Bandra Crime Scene',
    type: 'crime-scene',
    lat: 19.1136,
    lng: 72.8697,
    radius: 400,
    severity: 'high',
    description: 'Active crime scene - Jewelry heist location',
    createdDate: new Date('2024-02-01'),
    color: '#D32F2F'
  },
  {
    id: 'zone-2',
    name: 'Mumbai Airport Restricted',
    type: 'airport',
    lat: 19.0896,
    lng: 72.8656,
    radius: 800,
    severity: 'critical',
    description: 'International airport restricted perimeter',
    createdDate: new Date('2024-01-01'),
    color: '#F57C00'
  },
  {
    id: 'zone-3',
    name: 'RBI Central Bank',
    type: 'bank',
    lat: 19.0760,
    lng: 72.8777,
    radius: 300,
    severity: 'high',
    description: 'Reserve Bank of India - high security zone',
    createdDate: new Date('2024-01-15'),
    color: '#1976D2'
  },
  {
    id: 'zone-4',
    name: 'Mumbai Police HQ',
    type: 'police-hq',
    lat: 19.0176,
    lng: 72.8479,
    radius: 500,
    severity: 'critical',
    description: 'Mumbai Police Headquarters restricted area',
    createdDate: new Date('2023-12-01'),
    color: '#0097A7'
  },
  {
    id: 'zone-5',
    name: 'Dadar Drug Warehouse',
    type: 'crime-scene',
    lat: 19.0160,
    lng: 72.8395,
    radius: 350,
    severity: 'critical',
    description: 'Suspected drug storage facility under surveillance',
    createdDate: new Date('2024-02-10'),
    color: '#D32F2F'
  },
  {
    id: 'zone-6',
    name: 'Powai Tech Park',
    type: 'bank',
    lat: 19.2183,
    lng: 72.9781,
    radius: 400,
    severity: 'high',
    description: 'Cybercrime operations monitoring zone',
    createdDate: new Date('2024-02-05'),
    color: '#7B1FA2'
  },
  {
    id: 'zone-7',
    name: 'Colaba Jewelry District',
    type: 'crime-scene',
    lat: 19.0100,
    lng: 72.8320,
    radius: 350,
    severity: 'high',
    description: 'Multiple theft incidents - active investigation',
    createdDate: new Date('2024-01-22'),
    color: '#D32F2F'
  },
  {
    id: 'zone-8',
    name: 'Andheri Vehicle Hub',
    type: 'crime-scene',
    lat: 19.1459,
    lng: 72.8627,
    radius: 300,
    severity: 'medium',
    description: 'Suspected vehicle theft and chop-shop area',
    createdDate: new Date('2024-01-10'),
    color: '#E65100'
  }
];

export const DUMMY_TRAVEL_HISTORY: TravelHistory[] = [
  // Rohit Patil (ID 1)
  { id: 'th-1', suspectId: 1, date: new Date('2024-02-25'), location: 'Andheri', lat: 19.1459, lng: 72.8627, action: 'arrived', duration: 90 },
  { id: 'th-2', suspectId: 1, date: new Date('2024-02-26'), location: 'Powai', lat: 19.1200, lng: 72.9050, action: 'arrived', duration: 60 },
  { id: 'th-3', suspectId: 1, date: new Date('2024-02-27'), location: 'Bandra', lat: 19.1136, lng: 72.8697, action: 'arrived', duration: 180 },
  { id: 'th-4', suspectId: 1, date: new Date('2024-02-28'), location: 'Dadar', lat: 19.0160, lng: 72.8395, action: 'arrived', duration: 120 },
  // Sameer Khan (ID 2)
  { id: 'th-5', suspectId: 2, date: new Date('2024-02-25'), location: 'Andheri', lat: 19.1370, lng: 72.8300, action: 'arrived', duration: 100 },
  { id: 'th-6', suspectId: 2, date: new Date('2024-02-26'), location: 'Goregaon', lat: 19.1663, lng: 72.8526, action: 'arrived', duration: 200 },
  { id: 'th-7', suspectId: 2, date: new Date('2024-02-27'), location: 'Powai', lat: 19.2183, lng: 72.9781, action: 'arrived', duration: 150 },
  { id: 'th-8', suspectId: 2, date: new Date('2024-02-28'), location: 'Bandra', lat: 19.1136, lng: 72.8697, action: 'arrived', duration: 240 },
  // Arjun Mehta (ID 3)
  { id: 'th-9', suspectId: 3, date: new Date('2024-02-25'), location: 'Fort', lat: 19.0883, lng: 72.8385, action: 'arrived', duration: 90 },
  { id: 'th-10', suspectId: 3, date: new Date('2024-02-26'), location: 'Marine Lines', lat: 19.0760, lng: 72.9081, action: 'arrived', duration: 60 },
  { id: 'th-11', suspectId: 3, date: new Date('2024-02-27'), location: 'Dadar', lat: 19.0160, lng: 72.8395, action: 'arrived', duration: 120 },
  { id: 'th-12', suspectId: 3, date: new Date('2024-02-28'), location: 'Colaba', lat: 19.0176, lng: 72.8479, action: 'arrived', duration: 100 },
  // Rahul Sharma (ID 4)
  { id: 'th-13', suspectId: 4, date: new Date('2024-02-25'), location: 'Dadar', lat: 19.0160, lng: 72.8395, action: 'arrived', duration: 70 },
  { id: 'th-14', suspectId: 4, date: new Date('2024-02-26'), location: 'Bandra', lat: 19.1136, lng: 72.8697, action: 'arrived', duration: 130 },
  { id: 'th-15', suspectId: 4, date: new Date('2024-02-27'), location: 'Goregaon', lat: 19.1663, lng: 72.8526, action: 'arrived', duration: 90 },
  { id: 'th-16', suspectId: 4, date: new Date('2024-02-28'), location: 'Andheri', lat: 19.1459, lng: 72.8627, action: 'arrived', duration: 180 },
  // Imran Sheikh (ID 5)
  { id: 'th-17', suspectId: 5, date: new Date('2024-02-25'), location: 'Bandra', lat: 19.1136, lng: 72.8697, action: 'arrived', duration: 80 },
  { id: 'th-18', suspectId: 5, date: new Date('2024-02-26'), location: 'Andheri', lat: 19.1459, lng: 72.8627, action: 'arrived', duration: 100 },
  { id: 'th-19', suspectId: 5, date: new Date('2024-02-27'), location: 'Thane', lat: 19.2183, lng: 72.9600, action: 'arrived', duration: 200 },
  { id: 'th-20', suspectId: 5, date: new Date('2024-02-28'), location: 'Powai', lat: 19.2183, lng: 72.9781, action: 'arrived', duration: 160 },
  // Vikas Jadhav (ID 6)
  { id: 'th-21', suspectId: 6, date: new Date('2024-02-25'), location: 'Colaba', lat: 19.0176, lng: 72.8479, action: 'arrived', duration: 90 },
  { id: 'th-22', suspectId: 6, date: new Date('2024-02-26'), location: 'Dadar', lat: 19.0160, lng: 72.8395, action: 'arrived', duration: 120 },
  { id: 'th-23', suspectId: 6, date: new Date('2024-02-27'), location: 'Andheri', lat: 19.1459, lng: 72.8627, action: 'arrived', duration: 60 },
  { id: 'th-24', suspectId: 6, date: new Date('2024-02-28'), location: 'Bandra', lat: 19.1136, lng: 72.8479, action: 'arrived', duration: 150 },
  // Amit Verma (ID 7)
  { id: 'th-25', suspectId: 7, date: new Date('2024-02-25'), location: 'Fort', lat: 19.0883, lng: 72.8385, action: 'arrived', duration: 40 },
  { id: 'th-26', suspectId: 7, date: new Date('2024-02-26'), location: 'Dadar', lat: 19.0160, lng: 72.8395, action: 'arrived', duration: 80 },
  { id: 'th-27', suspectId: 7, date: new Date('2024-02-27'), location: 'Bandra', lat: 19.1136, lng: 72.8697, action: 'arrived', duration: 100 },
  { id: 'th-28', suspectId: 7, date: new Date('2024-02-28'), location: 'Marine Lines', lat: 19.0760, lng: 72.9081, action: 'arrived', duration: 60 },
  // Karan Singh (ID 8)
  { id: 'th-29', suspectId: 8, date: new Date('2024-02-25'), location: 'Bandra', lat: 19.1136, lng: 72.8697, action: 'arrived', duration: 75 },
  { id: 'th-30', suspectId: 8, date: new Date('2024-02-26'), location: 'Colaba', lat: 19.0176, lng: 72.8479, action: 'arrived', duration: 110 },
  { id: 'th-31', suspectId: 8, date: new Date('2024-02-27'), location: 'Dadar', lat: 19.0160, lng: 72.8395, action: 'arrived', duration: 90 },
  { id: 'th-32', suspectId: 8, date: new Date('2024-02-28'), location: 'Fort', lat: 19.0883, lng: 72.8385, action: 'arrived', duration: 130 }
];

export const DUMMY_CASES: Case[] = [
  {
    id: 1,
    title: 'Drug Trafficking Ring',
    description: 'Investigation into organized drug trafficking network operating in central Mumbai',
    status: 'under_investigation',
    suspects: [1, 2, 4],
    createdDate: new Date('2024-01-15'),
    updatedDate: new Date('2024-02-28'),
    priority: 'critical',
    notes: 'Multiple shipments traced to Dadar warehouse',
    caseOfficer: 'Inspector Desai',
    documents: [
      { id: 'doc-1', name: 'Surveillance_Report_Jan2024.pdf', type: 'PDF', size: '2.4 MB', uploadedDate: new Date('2024-01-20'), uploadedBy: 'Inspector Desai' },
      { id: 'doc-2', name: 'Phone_Intercept_Transcript.docx', type: 'DOCX', size: '1.1 MB', uploadedDate: new Date('2024-02-15'), uploadedBy: 'Officer Mehta' }
    ]
  },
  {
    id: 2,
    title: 'Jewelry Store Heist',
    description: 'Coordinated theft from high-end jewelry store in Colaba',
    status: 'open',
    suspects: [1, 3, 6],
    createdDate: new Date('2024-01-20'),
    updatedDate: new Date('2024-02-25'),
    priority: 'high',
    notes: 'CCTV shows professional execution',
    caseOfficer: 'Inspector Gupta',
    documents: [
      { id: 'doc-3', name: 'CCTV_Footage_Analysis.pdf', type: 'PDF', size: '5.8 MB', uploadedDate: new Date('2024-01-22'), uploadedBy: 'Inspector Gupta' },
      { id: 'doc-4', name: 'Witness_Statements.pdf', type: 'PDF', size: '890 KB', uploadedDate: new Date('2024-02-10'), uploadedBy: 'Officer Singh' },
      { id: 'doc-5', name: 'Insurance_Claim_Details.xlsx', type: 'XLSX', size: '340 KB', uploadedDate: new Date('2024-02-20'), uploadedBy: 'Inspector Gupta' }
    ]
  },
  {
    id: 3,
    title: 'Extortion Racket',
    description: 'Extortion scheme targeting local business owners',
    status: 'under_investigation',
    suspects: [2, 5, 7],
    createdDate: new Date('2024-02-01'),
    updatedDate: new Date('2024-02-28'),
    priority: 'high',
    notes: 'Multiple victims identified',
    caseOfficer: 'Inspector Patel',
    documents: [
      { id: 'doc-6', name: 'Victim_Statements_Compiled.pdf', type: 'PDF', size: '3.2 MB', uploadedDate: new Date('2024-02-05'), uploadedBy: 'Inspector Patel' }
    ]
  },
  {
    id: 4,
    title: 'Cybercrime Ring',
    description: 'Organized cybercrime and fraud operations',
    status: 'open',
    suspects: [3, 6, 8],
    createdDate: new Date('2024-02-10'),
    updatedDate: new Date('2024-02-27'),
    priority: 'medium',
    notes: 'Financial records being analyzed',
    caseOfficer: 'Inspector Sharma',
    documents: []
  },
  {
    id: 5,
    title: 'Vehicle Theft Ring',
    description: 'Organized vehicle theft and smuggling operation',
    status: 'closed',
    suspects: [5, 7, 8],
    createdDate: new Date('2024-01-10'),
    updatedDate: new Date('2024-02-20'),
    priority: 'medium',
    notes: 'Operation dismantled - 15 vehicles recovered',
    caseOfficer: 'Inspector Khan',
    documents: [
      { id: 'doc-7', name: 'Recovered_Vehicles_List.xlsx', type: 'XLSX', size: '420 KB', uploadedDate: new Date('2024-02-18'), uploadedBy: 'Inspector Khan' },
      { id: 'doc-8', name: 'Final_Case_Report.pdf', type: 'PDF', size: '4.5 MB', uploadedDate: new Date('2024-02-20'), uploadedBy: 'Inspector Khan' }
    ]
  }
];

export const DUMMY_ASSOCIATIONS: Association[] = [
  {
    id: 'assoc-1',
    suspect1Id: 1,
    suspect2Id: 2,
    relationType: 'accomplice',
    strength: 95,
    notes: 'Frequent meetings observed',
    lastMet: new Date('2024-02-27'),
    frequency: 'weekly'
  },
  {
    id: 'assoc-2',
    suspect1Id: 2,
    suspect2Id: 3,
    relationType: 'known_associate',
    strength: 80,
    notes: 'Business relationship',
    lastMet: new Date('2024-02-26'),
    frequency: 'monthly'
  },
  {
    id: 'assoc-3',
    suspect1Id: 3,
    suspect2Id: 6,
    relationType: 'accomplice',
    strength: 90,
    notes: 'Joint operations',
    lastMet: new Date('2024-02-28'),
    frequency: 'daily'
  },
  {
    id: 'assoc-4',
    suspect1Id: 1,
    suspect2Id: 4,
    relationType: 'known_associate',
    strength: 60,
    notes: 'Casual contact',
    lastMet: new Date('2024-02-20'),
    frequency: 'rare'
  },
  {
    id: 'assoc-5',
    suspect1Id: 5,
    suspect2Id: 2,
    relationType: 'accomplice',
    strength: 85,
    notes: 'Transportation and logistics',
    lastMet: new Date('2024-02-28'),
    frequency: 'weekly'
  },
  {
    id: 'assoc-6',
    suspect1Id: 6,
    suspect2Id: 8,
    relationType: 'known_associate',
    strength: 75,
    notes: 'Financial operations',
    lastMet: new Date('2024-02-27'),
    frequency: 'weekly'
  }
];

export const DUMMY_CALL_HISTORY: CallHistory[] = [
  // Rohit Patil (ID 1)
  { id: 'ch-1', suspectId: 1, contactName: 'Sameer Khan', contactNumber: '+91 98765 43210', callType: 'outgoing', timestamp: new Date('2024-02-28T14:30:00'), duration: 245, location: 'Dadar', isMonitored: true, notes: 'Discussed meeting location' },
  { id: 'ch-2', suspectId: 1, contactName: 'Unknown Number', contactNumber: '+91 87654 32109', callType: 'incoming', timestamp: new Date('2024-02-28T11:15:00'), duration: 180, location: 'Dadar', isMonitored: true, notes: 'Encrypted conversation detected' },
  { id: 'ch-3', suspectId: 1, contactName: 'Arjun Mehta', contactNumber: '+91 97654 12345', callType: 'outgoing', timestamp: new Date('2024-02-27T22:45:00'), duration: 420, location: 'Bandra', isMonitored: true, notes: 'Late night call - planning discussed' },
  { id: 'ch-4', suspectId: 1, contactName: 'Rahul Sharma', contactNumber: '+91 91234 56789', callType: 'missed', timestamp: new Date('2024-02-27T09:00:00'), duration: 0, location: 'Dadar', isMonitored: false },
  { id: 'ch-5', suspectId: 1, contactName: 'Unknown Number', contactNumber: '+91 88888 11111', callType: 'incoming', timestamp: new Date('2024-02-26T16:20:00'), duration: 95, location: 'Andheri', isMonitored: true },
  // Sameer Khan (ID 2)
  { id: 'ch-6', suspectId: 2, contactName: 'Rohit Patil', contactNumber: '+91 99876 54321', callType: 'incoming', timestamp: new Date('2024-02-28T14:30:00'), duration: 245, location: 'Bandra', isMonitored: true, notes: 'Discussed meeting location' },
  { id: 'ch-7', suspectId: 2, contactName: 'Imran Sheikh', contactNumber: '+91 92345 67890', callType: 'outgoing', timestamp: new Date('2024-02-28T10:00:00'), duration: 310, location: 'Bandra', isMonitored: true, notes: 'Logistics coordination' },
  { id: 'ch-8', suspectId: 2, contactName: 'Unknown Contact', contactNumber: '+91 77777 22222', callType: 'missed', timestamp: new Date('2024-02-27T20:30:00'), duration: 0, location: 'Powai', isMonitored: false },
  { id: 'ch-9', suspectId: 2, contactName: 'Legal Advisor', contactNumber: '+91 98111 22333', callType: 'outgoing', timestamp: new Date('2024-02-27T15:00:00'), duration: 600, location: 'Bandra', isMonitored: true, notes: 'Extended call with legal counsel' },
  // Arjun Mehta (ID 3)
  { id: 'ch-10', suspectId: 3, contactName: 'Vikas Jadhav', contactNumber: '+91 93456 78901', callType: 'outgoing', timestamp: new Date('2024-02-28T08:30:00'), duration: 180, location: 'Colaba', isMonitored: true, notes: 'Morning coordination call' },
  { id: 'ch-11', suspectId: 3, contactName: 'Unknown International', contactNumber: '+971 50 123 4567', callType: 'incoming', timestamp: new Date('2024-02-27T23:15:00'), duration: 540, location: 'Colaba', isMonitored: true, notes: 'International call - UAE number' },
  { id: 'ch-12', suspectId: 3, contactName: 'Rohit Patil', contactNumber: '+91 99876 54321', callType: 'incoming', timestamp: new Date('2024-02-27T22:45:00'), duration: 420, location: 'Colaba', isMonitored: true },
  // Rahul Sharma (ID 4)
  { id: 'ch-13', suspectId: 4, contactName: 'Rohit Patil', contactNumber: '+91 99876 54321', callType: 'outgoing', timestamp: new Date('2024-02-28T12:00:00'), duration: 60, location: 'Andheri', isMonitored: false },
  { id: 'ch-14', suspectId: 4, contactName: 'Family Member', contactNumber: '+91 98765 00000', callType: 'incoming', timestamp: new Date('2024-02-27T18:00:00'), duration: 300, location: 'Andheri', isMonitored: false },
  // Imran Sheikh (ID 5)
  { id: 'ch-15', suspectId: 5, contactName: 'Sameer Khan', contactNumber: '+91 98765 43210', callType: 'incoming', timestamp: new Date('2024-02-28T10:00:00'), duration: 310, location: 'Powai', isMonitored: true },
  { id: 'ch-16', suspectId: 5, contactName: 'Vikas Jadhav', contactNumber: '+91 93456 78901', callType: 'outgoing', timestamp: new Date('2024-02-27T21:00:00'), duration: 150, location: 'Powai', isMonitored: true, notes: 'Brief operational update' },
  { id: 'ch-17', suspectId: 5, contactName: 'Unknown Burner', contactNumber: '+91 70000 11111', callType: 'incoming', timestamp: new Date('2024-02-26T14:30:00'), duration: 45, location: 'Powai', isMonitored: true, notes: 'Burner phone detected' },
  // Vikas Jadhav (ID 6)
  { id: 'ch-18', suspectId: 6, contactName: 'Arjun Mehta', contactNumber: '+91 97654 12345', callType: 'incoming', timestamp: new Date('2024-02-28T08:30:00'), duration: 180, location: 'Bandra', isMonitored: true },
  { id: 'ch-19', suspectId: 6, contactName: 'Karan Singh', contactNumber: '+91 94567 89012', callType: 'outgoing', timestamp: new Date('2024-02-27T17:00:00'), duration: 220, location: 'Bandra', isMonitored: true, notes: 'Financial transaction discussion' },
  // Amit Verma (ID 7)
  { id: 'ch-20', suspectId: 7, contactName: 'Sameer Khan', contactNumber: '+91 98765 43210', callType: 'incoming', timestamp: new Date('2024-02-28T09:30:00'), duration: 90, location: 'Marine Lines', isMonitored: false },
  // Karan Singh (ID 8)
  { id: 'ch-21', suspectId: 8, contactName: 'Vikas Jadhav', contactNumber: '+91 93456 78901', callType: 'incoming', timestamp: new Date('2024-02-27T17:00:00'), duration: 220, location: 'Fort', isMonitored: true },
  { id: 'ch-22', suspectId: 8, contactName: 'Unknown Number', contactNumber: '+91 66666 33333', callType: 'missed', timestamp: new Date('2024-02-26T22:00:00'), duration: 0, location: 'Fort', isMonitored: false }
];

export const DUMMY_ALERTS: Alert[] = [];

// Helper function to get suspect by ID
export function getSuspectById(id: number): Suspect | undefined {
  return DUMMY_SUSPECTS.find(s => s.id === id);
}

// Helper function to get random location near Mumbai
export function getRandomMumbaiLocation(): { lat: number; lng: number } {
  const latVariation = (Math.random() - 0.5) * 0.1;
  const lngVariation = (Math.random() - 0.5) * 0.1;
  return {
    lat: MUMBAI_CENTER.lat + latVariation,
    lng: MUMBAI_CENTER.lng + lngVariation
  };
}
