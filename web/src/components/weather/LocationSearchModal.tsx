import { useEffect, useRef, useState } from 'react';
import { LocateFixed, MapPin, Search, X } from 'lucide-react';
import {
  attachPlaceAutocomplete,
  clearGoogleAutocompleteContainers,
} from '../../lib/googlePlaces';
import type { PlaceSelection } from '../../lib/googlePlaces';
import type { ForecastOptions } from '../../types/weather';
import { ForecastPreferences } from './ForecastPreferences';

interface LocationSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelected: (selection: PlaceSelection, options: ForecastOptions) => void;
  options: ForecastOptions;
}

export function LocationSearchModal({
  isOpen,
  onClose,
  onLocationSelected,
  options,
}: LocationSearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selection, setSelection] = useState<PlaceSelection | null>(null);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forecastOptions, setForecastOptions] = useState(options);

  useEffect(() => {
    if (!isOpen || !inputRef.current) {
      return undefined;
    }

    let isDisposed = false;
    let detachAutocomplete: (() => void) | undefined;

    clearGoogleAutocompleteContainers();
    setSelection(null);
    setError(null);
    setForecastOptions(options);
    setIsLoadingGoogle(true);

    void attachPlaceAutocomplete(
      inputRef.current,
      (nextSelection) => {
        if (!isDisposed) {
          setSelection(nextSelection);
          setError(null);
        }
      },
      (googleError) => {
        if (!isDisposed) {
          setSelection(null);
          setError(googleError.message);
        }
      },
    )
      .then((detach) => {
        if (isDisposed) {
          detach();
          return;
        }

        detachAutocomplete = detach;
        inputRef.current?.focus();
      })
      .catch((caught) => {
        if (!isDisposed) {
          setError(caught instanceof Error ? caught.message : 'Location search is unavailable.');
        }
      })
      .finally(() => {
        if (!isDisposed) {
          setIsLoadingGoogle(false);
        }
      });

    return () => {
      isDisposed = true;
      detachAutocomplete?.();
      clearGoogleAutocompleteContainers();
    };
  }, [isOpen, options]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  function handleConfirm() {
    if (!selection) {
      return;
    }

    onLocationSelected(selection, forecastOptions);
  }

  return (
    <div className="location-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="location-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          className="location-modal-close"
          type="button"
          onClick={onClose}
          aria-label="Close location search"
        >
          <X size={20} />
        </button>

        <div className="location-modal-heading">
          <span className="location-modal-icon">
            <Search size={22} />
          </span>
          <div>
            <p className="eyebrow">Search location</p>
            <h2 id="location-modal-title">Where do you want the forecast?</h2>
            <p>Choose a suggestion to set the exact location for this forecast.</p>
          </div>
        </div>

        <label className="place-search-field" htmlFor="place-search-input">
          <span>Location</span>
          <div>
            <MapPin size={19} />
            <input
              ref={inputRef}
              id="place-search-input"
              type="text"
              placeholder="Search city, address, or landmark"
              autoComplete="off"
            />
          </div>
        </label>

        {isLoadingGoogle && <p className="place-search-status">Loading Google location search…</p>}
        {error && <p className="place-search-error">{error}</p>}

        {selection && (
          <div className="selected-place">
            <LocateFixed size={19} />
            <span>
              <small>Selected location</small>
              <strong>{selection.label}</strong>
            </span>
          </div>
        )}

        <ForecastPreferences options={forecastOptions} onChange={setForecastOptions} />

        <div className="location-modal-actions">
          <button className="button-ghost" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="button-primary" type="button" onClick={handleConfirm} disabled={!selection}>
            View forecast
          </button>
        </div>
      </section>
    </div>
  );
}
