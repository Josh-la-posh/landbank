import { NextRequest, NextResponse } from 'next/server';
import { adsApi } from '@/lib/api';
import { mapToListingCards, normalizeAdsPayload } from '@/lib/ads';

const ALLOWED_PARAMS = new Set([
  'propertyType',
  'landType',
  'landSizeUnit',
  'status',
  'verification',
  'isFeatured',
  'city',
  'state',
  'pageNumber',
  'pageSize',
  'adId',
]);

export async function GET(request: NextRequest){
  const merchantCode = '';

  const queryEntries = Array.from(request.nextUrl.searchParams.entries());
  const filteredParams: Record<string, string> = {};

  queryEntries.forEach(([key, value]) => {
    if (!value || !ALLOWED_PARAMS.has(key)) return;
    filteredParams[key] = value;
  });

  const params = {
    pageNumber: '1',
    pageSize: '9',
    status: 'ACTIVE',
    verification: 'VERIFIED',
    ...filteredParams,
  };

  const { data, error } = await adsApi.list({ merchantCode, ...params });

  if (!data || !data.requestSuccessful){
    return NextResponse.json({ error: data?.message ?? error ?? 'Unable to load listings.' }, { status: 502 });
  }

  const listings = mapToListingCards(normalizeAdsPayload(data.responseData));

  return NextResponse.json({ listings });
}
