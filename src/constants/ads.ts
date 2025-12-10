export const PROPERTY_TYPES = ['VACANT_LAND', 'WITH_BUILDING', 'FARMLAND', 'PLANTATION', 'WATERFRONT'] as const;

export const LAND_SIZE_UNITS = ['SQUARE_METERS', 'ACRES', 'HECTARES', 'SQUARE_FEET', 'PLOTS'] as const;

export const LAND_TYPES = ['RESIDENTIAL', 'COMMERCIAL', 'AGRICULTURAL', 'INDUSTRIAL', 'MIXED_USE'] as const;

export const STATUS_OPTIONS = ['ACTIVE', 'SOLD', 'INACTIVE', 'PENDING', 'UNDER_REVIEW'] as const;

export const TITLE_DOCUMENT_TYPES = [
  'certificate_of_occupancy',
  'governors_consent',
  'survey_plan',
  'deed_of_assignment',
  'excision',
  'gazette',
] as const;

export const VERIFICATION_FILTER_OPTIONS = ['VERIFIED', 'PENDING', 'UNVERIFIED'] as const;

export const FEATURED_FILTER_OPTIONS = [
  { label: 'All ads', value: '' },
  { label: 'Featured only', value: 'true' },
  { label: 'Non-featured', value: 'false' },
] as const;
