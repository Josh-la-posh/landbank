'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FEATURED_FILTER_OPTIONS,
  LAND_SIZE_UNITS,
  LAND_TYPES,
  PROPERTY_TYPES,
  STATUS_OPTIONS,
  TITLE_DOCUMENT_TYPES,
  VERIFICATION_FILTER_OPTIONS,
} from '@/constants/ads';
import { adsApi, complianceApi, type ComplianceData } from '@/lib/api';
import { geocodeAddress, debounce, type Coordinates } from '@/lib/geocoding';

const createAdSchema = z.object({
  propertyType: z.string().min(1, 'Property type is required'),
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Tell prospective buyers more about the land'),
  price: z.number().positive('Price is required'),
  currency: z.string().min(1, 'Currency is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  address: z.string().min(3, 'Provide the address'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  landSize: z.number().positive('Land size is required'),
  landSizeUnit: z.string().min(1, 'Select a unit'),
  landType: z.string().min(1, 'Land type is required'),
  hasTitleDocument: z.boolean(),
  titleDocumentType: z.string().optional(),
  isFenced: z.boolean(),
  hasAccessRoad: z.boolean(),
  hasUtilities: z.boolean(),
  status: z.string().min(1, 'Select a status'),
  mediaFiles: z.any().optional(),
  certificate_of_occupancy: z.any().optional(),
  governors_consent: z.any().optional(),
  survey_plan: z.any().optional(),
  deed_of_assignment: z.any().optional(),
  excision: z.any().optional(),
  gazette: z.any().optional(),
});

type CreateAdValues = z.infer<typeof createAdSchema>;

type Filters = {
  adId: string;
  pageNumber: string;
  pageSize: string;
  propertyType: string;
  landType: string;
  landSizeUnit: string;
  status: string;
  verification: string;
  isFeatured: string;
};

type AdRecord = {
  adId?: string;
  title?: string;
  description?: string;
  price?: number | string;
  currency?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  status?: string;
  landSize?: number | string;
  landSizeUnit?: string;
  landType?: string;
  createdDate?: string;
};

const DEFAULT_FILTERS: Filters = {
  adId: '',
  pageNumber: '1',
  pageSize: '6',
  propertyType: '',
  landType: '',
  landSizeUnit: '',
  status: '',
  verification: '',
  isFeatured: '',
};

const DOCUMENT_FIELDS: Array<keyof CreateAdValues> = [
  'certificate_of_occupancy',
  'governors_consent',
  'survey_plan',
  'deed_of_assignment',
  'excision',
  'gazette',
];


const formatLabel = (value: string) =>
  value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export default function AdsManagementPage(){
const [authToken, setAuthToken] = useState<string | null>(null);
const [merchantCode, setMerchantCode] = useState<string | null>(null);
const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
const filtersRef = useRef<Filters>(DEFAULT_FILTERS);
const [ads, setAds] = useState<AdRecord[]>([]);
const [loadingAds, setLoadingAds] = useState(false);
const [fetchError, setFetchError] = useState<string | null>(null);
const [createMessage, setCreateMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
const [hasAutoFetched, setHasAutoFetched] = useState(false);
const [complianceData, setComplianceData] = useState<ComplianceData | null>(null);
const [complianceLoading, setComplianceLoading] = useState(false);
const [complianceError, setComplianceError] = useState<string | null>(null);
const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
const [geocodingStatus, setGeocodingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
const [geocodingError, setGeocodingError] = useState<string | null>(null);

const {
  register,
  handleSubmit,
  reset,
  watch,
  formState: { errors, isSubmitting },
} = useForm<CreateAdValues>({
  resolver: zodResolver(createAdSchema),
  defaultValues: {
    propertyType: PROPERTY_TYPES[0],
    currency: 'NGN',
    landSizeUnit: LAND_SIZE_UNITS[0],
    landType: LAND_TYPES[0],
    hasTitleDocument: true,
    titleDocumentType: TITLE_DOCUMENT_TYPES[0],
    isFenced: false,
    hasAccessRoad: true,
    hasUtilities: true,
    status: STATUS_OPTIONS[0],
  },
});

const address = watch('address');
const city = watch('city');
const state = watch('state');
const country = watch('country');

useEffect(() => {
  if (typeof window === 'undefined') return;
  try {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    setAuthToken(token);
    setMerchantCode(parsedUser?.userCode ?? null);
  } catch (error) {
    console.error('Unable to read auth storage', error);
  }
}, []);

const fetchCompliance = useCallback(async () => {
  if (!authToken) {
    setComplianceError('Authentication required');
    return false;
  }
  setComplianceLoading(true);
  setComplianceError(null);
  try {
    const { data, error } = await complianceApi.getCompliance(authToken);
    if (!data || !data.requestSuccessful) {
      setComplianceError(error || data?.message || 'Unable to fetch compliance data');
      setComplianceData(null);
      return false;
    }
    setComplianceData(data.responseData);
    return data.responseData?.status === 'approved';
  } catch (err) {
    console.error('Fetch compliance error:', err);
    setComplianceError('Network error while fetching compliance data');
    setComplianceData(null);
    return false;
  } finally {
    setComplianceLoading(false);
  }
}, [authToken]);

useEffect(() => {
  filtersRef.current = filters;
}, [filters]);

useEffect(() => {
  const performGeocode = debounce(async () => {
    if (!address || !city || !state || !country) {
      setCoordinates(null);
      setGeocodingStatus('idle');
      setGeocodingError(null);
      return;
    }

    setCoordinates({ latitude: 3, longitude: 15 });
    // setGeocodingStatus('loading');
    // setGeocodingError(null);

    // const result = await geocodeAddress(address, city, state, country);

    // if (result.coordinates) {
    //   setCoordinates(result.coordinates);
    //   setGeocodingStatus('success');
    //   setGeocodingError(null);
    // } else {
    //   setCoordinates(null);
    //   setGeocodingStatus('error');
    //   setGeocodingError(result.error || 'Unable to find coordinates for this address');
    // }
  }, 800);

  performGeocode();
}, [address, city, state, country]);

const normalizeAds = useCallback((payload: unknown): AdRecord[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload as AdRecord[];
  const maybeArrayKeys = ['items', 'records', 'data', 'results'];
  for (const key of maybeArrayKeys) {
    const candidate = (payload as Record<string, unknown>)[key];
    if (Array.isArray(candidate)) {
      return candidate as AdRecord[];
    }
  }
  return [payload as AdRecord];
}, []);

const fetchAds = useCallback(async (override?: Partial<Filters>) => {
  if (!merchantCode) {
    setFetchError('Merchant code missing. Please sign in again.');
    return;
  }
  const currentFilters = filtersRef.current;
  const nextFilters = override ? { ...currentFilters, ...override } : currentFilters;
  if (override) {
    filtersRef.current = nextFilters;
    setFilters(nextFilters);
  }
  setLoadingAds(true);
  setFetchError(null);
  try {
    const { data, error } = await adsApi.list(
      {
        merchantCode,
        adId: nextFilters.adId || undefined,
        pageNumber: nextFilters.pageNumber,
        pageSize: nextFilters.pageSize,
        propertyType: nextFilters.propertyType,
        landType: nextFilters.landType,
        landSizeUnit: nextFilters.landSizeUnit,
        status: nextFilters.status,
        verification: nextFilters.verification,
        isFeatured: nextFilters.isFeatured,
      },
      authToken || undefined
    );

    if (!data) {
      setFetchError(error || 'Unable to fetch ads right now.');
      setAds([]);
      return;
    }

    if (!data.requestSuccessful) {
      setFetchError(data.message || error || 'Unable to fetch ads right now.');
      setAds([]);
      return;
    }

    setAds(normalizeAds(data.responseData));
  } catch (err) {
    console.error('Fetch ads error:', err);
    setFetchError('Network error while fetching ads.');
    setAds([]);
  } finally {
    setLoadingAds(false);
  }
}, [authToken, merchantCode, normalizeAds]);

useEffect(() => {
  if (!merchantCode || hasAutoFetched) return;
  setHasAutoFetched(true);
  fetchAds();
}, [fetchAds, hasAutoFetched, merchantCode]);

const buildFormData = (values: CreateAdValues) => {
  const formData = new FormData();
  formData.append('propertyType', values.propertyType);
  formData.append('title', values.title);
  formData.append('description', values.description);
  formData.append('price', values.price.toString());
  formData.append('currency', values.currency);
  // Use geocoded coordinates instead of manual input
  if (coordinates) {
    formData.append('latitude', coordinates.latitude.toString());
    formData.append('longitude', coordinates.longitude.toString());
  }
  formData.append('address', values.address);
  formData.append('city', values.city);
  formData.append('state', values.state);
  formData.append('country', values.country);
  formData.append('landSize', values.landSize.toString());
  formData.append('landSizeUnit', values.landSizeUnit);
  formData.append('landType', values.landType);
  formData.append('hasTitleDocument', values.hasTitleDocument ? 'true' : 'false');
  if (values.titleDocumentType) {
    formData.append('titleDocumentType', values.titleDocumentType);
  }
  formData.append('isFenced', values.isFenced ? 'true' : 'false');
  formData.append('hasAccessRoad', values.hasAccessRoad ? 'true' : 'false');
  formData.append('hasUtilities', values.hasUtilities ? 'true' : 'false');
  formData.append('status', values.status);
  if (merchantCode) {
    formData.append('merchantCode', merchantCode);
  }

  const mediaFiles = values.mediaFiles as FileList | undefined;
  if (mediaFiles && mediaFiles.length) {
    Array.from(mediaFiles).forEach((file) => formData.append('mediaFiles', file));
  }

  DOCUMENT_FIELDS.forEach((field) => {
    const fileList = values[field] as FileList | undefined;
    if (fileList && fileList[0]) {
      formData.append(field, fileList[0]);
    }
  });

  return formData;
};

const onSubmit = async (values: CreateAdValues) => {
  if (!merchantCode) {
    setCreateMessage({ type: 'error', text: 'Merchant code missing. Please sign in again.' });
    return;
  }
  setCreateMessage(null);
  
  // Check compliance before proceeding
  const isApproved = await fetchCompliance();
  if (!isApproved) {
    return; // Compliance check will set appropriate error messages
  }
  
  try {
    const formData = buildFormData(values);
    const { data, error } = await adsApi.create(formData, authToken || undefined);

    if (!data) {
      setCreateMessage({ type: 'error', text: error || 'Unable to create ad right now.' });
      return;
    }

    if (!data.requestSuccessful) {
      setCreateMessage({ type: 'error', text: data.message || error || 'Unable to create ad right now.' });
      return;
    }

    setCreateMessage({ type: 'success', text: data.message || 'Ad created successfully.' });
    reset();
    fetchAds();
  } catch (err) {
    console.error('Create ad error:', err);
    setCreateMessage({ type: 'error', text: 'Network error while creating ad.' });
  }
};

const statusBadgeClass = useCallback((status?: string) => {
  if (!status) return 'bg-muted text-secondary';
  const normalized = status.toLowerCase();
  if (normalized.includes('sold')) return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
  if (normalized.includes('pending')) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300';
  return 'bg-brand/10 text-brand';
}, []);

  const adsEmptyState = useMemo(() => (
  <div className="rounded-2xl border border-dashed border-border/60 bg-surface p-8 text-center text-sm text-secondary">
    {merchantCode ? 'No ads found for your current filters.' : 'Sign in again to manage your ads.'}
  </div>
), [merchantCode]);

const isComplianceApproved = complianceData?.status === 'approved';

return (
<main className="min-h-screen bg-surface-secondary px-4 py-10">
  <div className="mx-auto max-w-6xl space-y-8">
    <header>
      <p className="text-sm text-secondary">Ads manager</p>
      <h1 className="text-3xl font-semibold tracking-tight text-primary">Create and monitor your listings</h1>
      <p className="mt-2 text-base text-muted">Upload due diligence documents, manage visibility, and keep an eye on every property ad tied to your merchant profile.</p>
    </header>

    <section className="rounded-3xl border border-border/60 bg-surface p-6 shadow-lg">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-secondary">New advertisement</p>
          <h2 className="text-xl font-semibold text-primary">Share a fresh property with your buyers</h2>
        </div>
        {createMessage && (
          <div className={`${createMessage.type === 'success' ? 'text-green-600 dark:text-green-300' : 'text-brand'} text-sm`}>
            {createMessage.text}
          </div>
        )}
      </div>
      {complianceLoading && (
        <div className="mb-6 rounded-2xl border border-border/60 bg-surface-secondary/60 p-4 text-sm text-secondary">
          Checking compliance status...
        </div>
      )}
      {complianceError && (
        <div className="mb-6 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-700 dark:text-amber-300">
          <p className="font-medium">Compliance Check Failed</p>
          <p className="mt-1">{complianceError}</p>
        </div>
      )}
      {!complianceLoading && complianceData && !isComplianceApproved && (
        <div className="mb-6 rounded-2xl border border-brand/40 bg-brand/10 p-4">
          <p className="font-medium text-brand">Compliance Required</p>
          <p className="mt-1 text-sm text-secondary">
            Your compliance status is <span className="font-semibold">{complianceData.status}</span>. You must complete and get approval for compliance verification before creating ads.
          </p>
          <p className="mt-2 text-sm text-secondary">
            Progress: {complianceData.progress}% • Documents: {complianceData.documents.filter(d => d.status).length}/{complianceData.documents.length} verified
          </p>
        </div>
      )}
      {!complianceLoading && complianceData && isComplianceApproved && (
        <div className="mb-6 rounded-2xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-4">
          <p className="font-medium text-green-700 dark:text-green-300">✓ Compliance Verified</p>
          <p className="mt-1 text-sm text-secondary">
            Your account is compliant and verified. You can create ads.
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Property type</label>
            <select className="input" {...register('propertyType')}>
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {formatLabel(type)}
                </option>
              ))}
            </select>
            {errors.propertyType && <p className="text-xs text-brand mt-1">{errors.propertyType.message}</p>}
          </div>
          <div>
            <label className="label">Title</label>
            <input className="input" placeholder="Listing title" {...register('title')} />
            {errors.title && <p className="text-xs text-brand mt-1">{errors.title.message}</p>}
          </div>
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input min-h-[120px]" {...register('description')} />
          {errors.description && <p className="text-xs text-brand mt-1">{errors.description.message}</p>}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Price</label>
            <input className="input" type="number" step="0.01" {...register('price', { valueAsNumber: true })} />
            {errors.price && <p className="text-xs text-brand mt-1">{errors.price.message}</p>}
          </div>
          <div>
            <label className="label">Currency</label>
            <input className="input" placeholder="NGN" {...register('currency')} />
            {errors.currency && <p className="text-xs text-brand mt-1">{errors.currency.message}</p>}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Address</label>
            <input className="input" {...register('address')} />
            {errors.address && <p className="text-xs text-brand mt-1">{errors.address.message}</p>}
          </div>
          <div>
            <label className="label">City</label>
            <input className="input" {...register('city')} />
            {errors.city && <p className="text-xs text-brand mt-1">{errors.city.message}</p>}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="label">State</label>
            <input className="input" {...register('state')} />
            {errors.state && <p className="text-xs text-brand mt-1">{errors.state.message}</p>}
          </div>
          <div>
            <label className="label">Country</label>
            <input className="input" {...register('country')} />
            {errors.country && <p className="text-xs text-brand mt-1">{errors.country.message}</p>}
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" {...register('status')}>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {formatLabel(status)}
                </option>
              ))}
            </select>
            {errors.status && <p className="text-xs text-brand mt-1">{errors.status.message}</p>}
          </div>
        </div>
        {geocodingStatus !== 'idle' && (
          <div className="rounded-lg border border-border/60 bg-surface-secondary/60 p-3">
            {geocodingStatus === 'loading' && (
              <p className="text-sm text-secondary">📍 Locating coordinates...</p>
            )}
            {geocodingStatus === 'success' && coordinates && (
              <p className="text-sm text-green-600 dark:text-green-400">
                ✓ Location found: {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
              </p>
            )}
            {geocodingStatus === 'error' && (
              <p className="text-sm text-amber-600 dark:text-amber-400">
                ⚠ {geocodingError || 'Unable to find coordinates. The ad will be created without location data.'}
              </p>
            )}
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="label">Land size</label>
            <input className="input" type="number" step="0.01" {...register('landSize', { valueAsNumber: true })} />
            {errors.landSize && <p className="text-xs text-brand mt-1">{errors.landSize.message}</p>}
          </div>
          <div>
            <label className="label">Size unit</label>
            <select className="input" {...register('landSizeUnit')}>
              {LAND_SIZE_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {formatLabel(unit)}
                </option>
              ))}
            </select>
            {errors.landSizeUnit && <p className="text-xs text-brand mt-1">{errors.landSizeUnit.message}</p>}
          </div>
          <div>
            <label className="label">Land type</label>
            <select className="input" {...register('landType')}>
              {LAND_TYPES.map((type) => (
                <option key={type} value={type}>
                  {formatLabel(type)}
                </option>
              ))}
            </select>
            {errors.landType && <p className="text-xs text-brand mt-1">{errors.landType.message}</p>}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <label className="inline-flex items-center gap-2 text-sm text-secondary">
            <input type="checkbox" className="h-4 w-4 rounded border border-border text-brand focus:ring-brand" {...register('hasTitleDocument')} />
            Has title document
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-secondary">
            <input type="checkbox" className="h-4 w-4 rounded border border-border text-brand focus:ring-brand" {...register('isFenced')} />
            Property is fenced
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-secondary">
            <input type="checkbox" className="h-4 w-4 rounded border border-border text-brand focus:ring-brand" {...register('hasAccessRoad')} />
            Good access road
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-secondary">
            <input type="checkbox" className="h-4 w-4 rounded border border-border text-brand focus:ring-brand" {...register('hasUtilities')} />
            Utilities available
          </label>
        </div>
        <div>
          <label className="label">Title document type</label>
          <select className="input" {...register('titleDocumentType')}>
            {TITLE_DOCUMENT_TYPES.map((doc) => (
              <option key={doc} value={doc}>
                {formatLabel(doc)}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Gallery images</label>
            <input className="input" type="file" multiple {...register('mediaFiles')} />
          </div>
          <div>
            <label className="label">Certificate of Occupancy</label>
            <input className="input" type="file" {...register('certificate_of_occupancy')} />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="label">Governor&apos;s consent</label>
            <input className="input" type="file" {...register('governors_consent')} />
          </div>
          <div>
            <label className="label">Survey plan</label>
            <input className="input" type="file" {...register('survey_plan')} />
          </div>
          <div>
            <label className="label">Deed of assignment</label>
            <input className="input" type="file" {...register('deed_of_assignment')} />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Excision</label>
            <input className="input" type="file" {...register('excision')} />
          </div>
          <div>
            <label className="label">Gazette</label>
            <input className="input" type="file" {...register('gazette')} />
          </div>
        </div>
        <div className="flex justify-end">
          <button className="btn btn-primary" disabled={isSubmitting || !merchantCode || complianceLoading}>
            {isSubmitting ? 'Publishing…' : complianceLoading ? 'Checking compliance…' : 'Publish ad'}
          </button>
        </div>
      </form>
    </section>

    <section className="rounded-3xl border border-border/60 bg-surface p-6 shadow-lg">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm text-secondary">Existing ads</p>
          <h2 className="text-xl font-semibold text-primary">Monitor performance</h2>
        </div>
        <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="label">Ad ID</label>
            <input
              className="input"
              value={filters.adId}
              onChange={(e) => setFilters((prev) => ({ ...prev, adId: e.target.value }))}
              placeholder="Filter by ID"
            />
          </div>
          <div>
            <label className="label">Page</label>
            <input
              className="input"
              type="number"
              min={1}
              value={filters.pageNumber}
              onChange={(e) => setFilters((prev) => ({ ...prev, pageNumber: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">Page size</label>
            <input
              className="input"
              type="number"
              min={1}
              value={filters.pageSize}
              onChange={(e) => setFilters((prev) => ({ ...prev, pageSize: e.target.value }))}
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              className="btn btn-ghost w-full"
              onClick={() => fetchAds()}
              disabled={loadingAds}
            >
              {loadingAds ? 'Refreshing…' : 'Refresh list'}
            </button>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <div>
            <label className="label">Property type</label>
            <select
              className="input"
              value={filters.propertyType}
              onChange={(e) => setFilters((prev) => ({ ...prev, propertyType: e.target.value }))}
            >
              <option value="">All property types</option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {formatLabel(type)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Land type</label>
            <select
              className="input"
              value={filters.landType}
              onChange={(e) => setFilters((prev) => ({ ...prev, landType: e.target.value }))}
            >
              <option value="">All land uses</option>
              {LAND_TYPES.map((type) => (
                <option key={type} value={type}>
                  {formatLabel(type)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Size unit</label>
            <select
              className="input"
              value={filters.landSizeUnit}
              onChange={(e) => setFilters((prev) => ({ ...prev, landSizeUnit: e.target.value }))}
            >
              <option value="">All units</option>
              {LAND_SIZE_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {formatLabel(unit)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Ad status</label>
            <select
              className="input"
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            >
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {formatLabel(status)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Verification</label>
            <select
              className="input"
              value={filters.verification}
              onChange={(e) => setFilters((prev) => ({ ...prev, verification: e.target.value }))}
            >
              <option value="">All statuses</option>
              {VERIFICATION_FILTER_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {formatLabel(option)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Featured</label>
            <select
              className="input"
              value={filters.isFeatured}
              onChange={(e) => setFilters((prev) => ({ ...prev, isFeatured: e.target.value }))}
            >
              {FEATURED_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {fetchError && (
          <div className="rounded-2xl border border-brand/40 bg-brand/10 px-4 py-3 text-sm text-brand">
            {fetchError}
          </div>
        )}
        {!ads.length && !fetchError && !loadingAds && adsEmptyState}
        {loadingAds && (
          <div className="rounded-2xl border border-dashed border-border/60 p-6 text-center text-sm text-secondary">
            Loading ads…
          </div>
        )}
        {ads.map((ad) => (
          <article key={ad.adId ?? ad.title} className="rounded-2xl border border-border/60 bg-surface-secondary/60 p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-primary">{ad.title ?? 'Untitled listing'}</h3>
                <p className="text-sm text-secondary">{[ad.address, ad.city, ad.state, ad.country].filter(Boolean).join(', ')}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadgeClass(ad.status)}`}>
                {ad.status ?? 'Unknown'}
              </span>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm text-muted">
              <div>
                <p className="text-secondary">Price</p>
                <p className="font-semibold text-primary">{ad.price ? `${ad.currency ?? 'NGN'} ${ad.price}` : '—'}</p>
              </div>
              <div>
                <p className="text-secondary">Land size</p>
                <p className="font-semibold text-primary">{ad.landSize ? `${ad.landSize} ${ad.landSizeUnit ?? ''}` : '—'}</p>
              </div>
              <div>
                <p className="text-secondary">Type</p>
                <p className="font-semibold text-primary">{ad.landType ?? '—'}</p>
              </div>
              <div>
                <p className="text-secondary">Ad ID</p>
                <p className="font-semibold text-primary">{ad.adId ?? '—'}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  </div>
</main>
);
}
