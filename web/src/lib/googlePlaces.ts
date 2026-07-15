import type { Coordinates } from '../types/weather';

const GOOGLE_MAPS_SCRIPT_ID = 'google-maps-places-script';
const GOOGLE_AUTH_FAILURE_EVENT = 'forecast-ai:google-auth-failure';

export interface PlaceSelection {
  label: string;
  coordinates: Coordinates;
}

interface GooglePlace {
  formatted_address?: string;
  name?: string;
  geometry?: {
    location?: {
      lat: () => number;
      lng: () => number;
    };
  };
}

interface GoogleAutocomplete {
  addListener: (eventName: 'place_changed', listener: () => void) => {
    remove: () => void;
  };
  getPlace: () => GooglePlace;
}

interface GoogleMapsPlaces {
  Autocomplete: new (
    input: HTMLInputElement,
    options: {
      fields: string[];
      types: string[];
    },
  ) => GoogleAutocomplete;
}

interface GoogleMapsApi {
  maps: {
    places: GoogleMapsPlaces;
  };
}

declare global {
  interface Window {
    google?: GoogleMapsApi;
    gm_authFailure?: () => void;
  }
}

let googleMapsPromise: Promise<GoogleMapsApi> | null = null;
let authenticationHandlerInstalled = false;

export function attachPlaceAutocomplete(
  input: HTMLInputElement,
  onPlaceSelected: (selection: PlaceSelection) => void,
  onError: (error: Error) => void,
): Promise<() => void> {
  let authenticationFailed = false;

  function handleAuthenticationFailure() {
    authenticationFailed = true;
    clearGoogleAutocompleteContainers();
    onError(createAuthenticationError());
  }

  window.addEventListener(GOOGLE_AUTH_FAILURE_EVENT, handleAuthenticationFailure);

  return loadGoogleMapsPlaces()
    .then((googleMaps) => {
      if (authenticationFailed) {
        throw createAuthenticationError();
      }

      const autocomplete = new googleMaps.maps.places.Autocomplete(input, {
        fields: ['formatted_address', 'geometry', 'name'],
        types: ['geocode'],
      });

      const listener = autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        const location = place.geometry?.location;

        if (!location) {
          return;
        }

        onPlaceSelected({
          label: place.formatted_address || place.name || 'Selected location',
          coordinates: {
            lat: String(location.lat()),
            lon: String(location.lng()),
          },
        });
      });

      return () => {
        listener.remove();
        window.removeEventListener(GOOGLE_AUTH_FAILURE_EVENT, handleAuthenticationFailure);
        clearGoogleAutocompleteContainers();
      };
    })
    .catch((caught) => {
      window.removeEventListener(GOOGLE_AUTH_FAILURE_EVENT, handleAuthenticationFailure);
      clearGoogleAutocompleteContainers();
      throw caught;
    });
}

export function clearGoogleAutocompleteContainers() {
  document.querySelectorAll('.pac-container, .gm-err-container, [class*="gm-err"]').forEach((container) => {
    container.closest('.pac-container')?.remove();
    container.remove();
  });
}

function loadGoogleMapsPlaces(): Promise<GoogleMapsApi> {
  if (window.google?.maps?.places) {
    return Promise.resolve(window.google);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return Promise.reject(
      new Error('Location search is not configured. Add VITE_GOOGLE_MAPS_API_KEY to the web environment.'),
    );
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    installAuthenticationFailureHandler();

    const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener(
        'load',
        () => {
          if (window.google?.maps?.places) {
            resolve(window.google);
          } else {
            reject(createAuthenticationError());
          }
        },
        { once: true },
      );
      existingScript.addEventListener(
        'error',
        () => reject(new Error('Google location search could not be loaded.')),
        { once: true },
      );
      return;
    }

    const script = document.createElement('script');
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.async = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places&v=weekly`;
    script.onload = () => {
      if (window.google?.maps?.places) {
        resolve(window.google);
      } else {
        reject(new Error('Google Places is unavailable for this API key.'));
      }
    };
    script.onerror = () => reject(new Error('Google location search could not be loaded.'));

    document.head.append(script);
  });

  return googleMapsPromise.catch((error) => {
    googleMapsPromise = null;
    throw error;
  });
}

function installAuthenticationFailureHandler() {
  if (authenticationHandlerInstalled) {
    return;
  }

  const previousHandler = window.gm_authFailure;

  window.gm_authFailure = () => {
    previousHandler?.();
    clearGoogleFailureUi();
    window.dispatchEvent(new Event(GOOGLE_AUTH_FAILURE_EVENT));
  };

  authenticationHandlerInstalled = true;
}

function clearGoogleFailureUi() {
  clearGoogleAutocompleteContainers();
  window.setTimeout(clearGoogleAutocompleteContainers, 0);
  window.setTimeout(clearGoogleAutocompleteContainers, 150);
}

function createAuthenticationError(): Error {
  return new Error(
    'Google rejected the location-search configuration. Check the API key, billing, enabled APIs, and allowed website referrers.',
  );
}
