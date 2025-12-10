// Geocoding utility functions using Google Maps Geocoding API

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeocodeResult {
  coordinates: Coordinates | null;
  error?: string;
}

/**
 * Fetches coordinates (latitude and longitude) for a given address using Google Maps Geocoding API
 * @param address Full address string
 * @param city City name
 * @param state State or region
 * @param country Country name
 * @returns Promise with coordinates or null if geocoding fails
 */
export async function geocodeAddress(
  address: string,
  city?: string,
  state?: string,
  country?: string
): Promise<GeocodeResult> {
  // Get API key from environment variable
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.warn('Google Maps API key not configured');
    return { coordinates: null, error: 'Google Maps API key not configured' };
  }

  // Build full address string
  const addressParts = [address, city, state, country].filter(Boolean);
  if (addressParts.length === 0) {
    return { coordinates: null, error: 'No address provided' };
  }

  const fullAddress = addressParts.join(', ');

  try {
    const encodedAddress = encodeURIComponent(fullAddress);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        coordinates: {
          latitude: location.lat,
          longitude: location.lng,
        },
      };
    }

    if (data.status === 'ZERO_RESULTS') {
      return { coordinates: null, error: 'Address not found' };
    }

    if (data.status === 'REQUEST_DENIED') {
      return { coordinates: null, error: 'Google Maps API request denied. Check your API key.' };
    }

    return { coordinates: null, error: data.error_message || `Geocoding failed: ${data.status}` };
  } catch (error) {
    console.error('Geocoding error:', error);
    return { 
      coordinates: null, 
      error: error instanceof Error ? error.message : 'Network error during geocoding' 
    };
  }
}

/**
 * Debounce function to limit API calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
