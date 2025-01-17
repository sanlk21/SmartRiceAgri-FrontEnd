// src/types/landTypes.js

// Land Status Enum
export const LandStatus = {
    PENDING: 'PENDING',
    VERIFIED: 'VERIFIED',
    REJECTED: 'REJECTED'
  };
  
  // Request DTO
  export class LandRequestDTO {
    constructor(data) {
      this.size = data.size;
      this.location = data.location;
      this.district = data.district;
      this.document = data.document; // File object
    }
  }
  
  // Response DTO
  export class LandResponseDTO {
    constructor(data) {
      this.id = data.id;
      this.farmerNic = data.farmerNic;
      this.size = data.size;
      this.location = data.location;
      this.district = data.district;
      this.documentName = data.documentName;
      this.documentType = data.documentType;
      this.documentPath = data.documentPath;
      this.status = data.status;
      this.nitrogenQuota = data.nitrogenQuota;
      this.phosphorusQuota = data.phosphorusQuota;
      this.potassiumQuota = data.potassiumQuota;
      this.totalNpkQuota = data.totalNpkQuota;
    }
  }
  
  // Validation functions
  export const validateLandRequest = (data) => {
    const errors = {};
  
    if (!data.size || data.size <= 0) {
      errors.size = 'Size must be greater than 0';
    }
  
    if (!data.location?.trim()) {
      errors.location = 'Location is required';
    }
  
    if (!data.district?.trim()) {
      errors.district = 'District is required';
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };