export type AdsApiRecord = {
  adId?: string;
  id?: string;
  title?: string;
  description?: string;
  price?: number | string;
  currency?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  landSize?: number | string;
  landSizeUnit?: string;
  landType?: string;
  propertyType?: string;
  status?: string;
  verification?: string;
  verificationStatus?: string;
  featured?: boolean;
  isFeatured?: boolean;
  hasTitleDocument?: boolean;
  titleDocumentType?: string;
  isFenced?: boolean;
  hasAccessRoad?: boolean;
  hasUtilities?: boolean;
  mediaFiles?: string[] | null;
  media?: Array<{ id?: string; link?: string; originalName?: string; mimeType?: string }>;
  business?: { 
    merchantCode?: string; 
    merchantName?: string; 
    tradingName?: string;
    businessDescription?: string;
    contactEmail?: string;
  };
  createdDate?: string;
  [key: string]: unknown;
};

export type ListingCard = {
  id: string;
  title: string;
  price: string;
  size: string;
  location: string;
  featured: boolean;
  imageUrl?: string;
  merchantCode?: string;
  merchantName?: string;
  status?: string;
  propertyType?: string;
  landType?: string;
  verification?: string;
};

const idFromRecord = (record: AdsApiRecord) => {
  // Prioritize numeric id field from backend
  if (record.id !== undefined && record.id !== null) {
    return String(record.id);
  }
  if (record.adId && typeof record.adId === 'string' && record.adId.trim()) {
    return record.adId;
  }
  // Fallback: generate ID from title if available
  if (record.title) {
    console.warn('Using fallback ID for record:', record);
    return `temp-${record.title.substring(0, 20).replace(/\s+/g, '-').toLowerCase()}`;
  }
  return '';
};

export const formatLabel = (value?: string | null) =>
  value
    ? value
        .toLowerCase()
        .split('_')
        .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
        .join(' ')
    : '';

export const formatPriceLabel = (price?: number | string, currency?: string) => {
  if (price === undefined || price === null || price === '') {
    return 'Price on request';
  }
  const value =
    typeof price === 'number'
      ? price.toLocaleString('en-NG')
      : Number.isNaN(Number(price))
        ? String(price)
        : Number(price).toLocaleString('en-NG');
  return `${currency ?? 'NGN'} ${value}`;
};

export const formatSizeLabel = (size?: number | string, unit?: string) => {
  if (size === undefined || size === null || size === '') {
    return 'Size unavailable';
  }
  const label = formatLabel(unit);
  return label ? `${size} ${label}` : `${size}`;
};

export const formatLocationLabel = (record: AdsApiRecord) => {
  const parts = [record.address, record.city, record.state, record.country].filter(Boolean);
  return parts.length ? parts.join(', ') : 'Location unavailable';
};

export const normalizeAdsPayload = (payload: unknown): AdsApiRecord[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload as AdsApiRecord[];
  if (typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    const collectionKeys = ['items', 'records', 'data', 'results'];
    for (const key of collectionKeys) {
      const candidate = record[key];
      if (Array.isArray(candidate)) {
        return candidate as AdsApiRecord[];
      }
    }
    return [record as AdsApiRecord];
  }
  return [];
};

export const mapToListingCards = (records: AdsApiRecord[]): ListingCard[] =>
  records
    .map((record) => {
      const id = idFromRecord(record);
      if (!id) return null;
      
      // Extract first media image
      const imageUrl = record.media?.[0]?.link ?? undefined;
      
      // Extract merchant info
      const merchantCode = record.business?.merchantCode ?? undefined;
      const merchantName = record.business?.merchantName ?? record.business?.tradingName ?? undefined;
      
      return {
        id,
        title: record.title ?? 'Untitled listing',
        price: formatPriceLabel(record.price, record.currency),
        size: formatSizeLabel(record.landSize, record.landSizeUnit),
        location: formatLocationLabel(record),
        featured: Boolean(record.featured ?? record.isFeatured ?? false),
        imageUrl,
        merchantCode,
        merchantName,
        status: record.status ?? undefined,
        propertyType: record.propertyType ?? undefined,
        landType: record.landType ?? undefined,
        verification: (record.verification ?? record.verificationStatus ?? undefined) as string | undefined,
      } as ListingCard;
    })
    .filter((listing): listing is ListingCard => Boolean(listing));
