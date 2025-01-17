// src/types/fertilizerTypes.ts

// Fertilizer Allocation Status
export type FertilizerAllocationStatus = 
  | 'PENDING'
  | 'READY'
  | 'COLLECTED'
  | 'EXPIRED';

// Season Type
export type Season = 'YALA' | 'MAHA';

// Fertilizer Type
export interface Fertilizer {
  id: number;
  name: string;
  description?: string;
  unitPrice: number;
  availableQuantity: number;
}

// Fertilizer Allocation
export interface FertilizerAllocation {
  id: number;
  farmerNic: string;
  allocatedAmount: number;
  season: Season;
  year: number;
  status: FertilizerAllocationStatus;
  distributionDate?: string;
  distributionLocation?: string;
  referenceNumber: string;
  expiryDate?: string;
  collectionDate?: string;
}

// Fertilizer Quota
export interface FertilizerQuota {
  id: number;
  farmerNic: string;
  season: Season;
  year: number;
  allocatedAmount: number;
  remainingAmount: number;
  lastAllocationDate?: string;
}

// Fertilizer Statistics
export interface FertilizerStats {
  totalAllocations: number;
  activeFarmers: number;
  currentSeason: string;
  collectionRate: number;
  collectedCount: number;
  pendingCount: number;
  expiredCount: number;
}

// Request Types
export interface UpdateCollectionStatusRequest {
  allocationId: number;
  status: FertilizerAllocationStatus;
}

// Response Types
export interface AllocationResponse {
  data: FertilizerAllocation[];
  totalPages: number;
  currentPage: number;
  totalElements: number;
}

export interface QuotaResponse {
  data: FertilizerQuota[];
  totalPages: number;
  currentPage: number;
  totalElements: number;
}