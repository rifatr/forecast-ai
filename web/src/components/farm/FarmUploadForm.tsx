import type { ChangeEvent, SubmitEvent } from 'react';
import { CloudUpload, FileImage, LoaderCircle, Trees, X } from 'lucide-react';
import type { FarmAnalysisInput } from '../../types/farm';

interface FarmUploadFormProps {
  details: FarmAnalysisInput;
  previewUrl: string | null;
  isAnalyzing: boolean;
  onDetailChange: (field: keyof FarmAnalysisInput, value: string) => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
}

export function FarmUploadForm({
  details,
  previewUrl,
  isAnalyzing,
  onDetailChange,
  onFileChange,
  onRemoveImage,
  onSubmit,
}: FarmUploadFormProps) {
  return (
    <section className="panel upload-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Step 1</p>
          <h2>Upload farm image</h2>
        </div>
        <FileImage size={21} />
      </div>

      <form className="farm-form" onSubmit={onSubmit}>
        {previewUrl ? (
          <div className="image-preview">
            <img src={previewUrl} alt="Selected farm area" />
            <button
              type="button"
              className="remove-image"
              onClick={onRemoveImage}
              aria-label="Remove selected image"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <label className="upload-dropzone">
            <CloudUpload size={33} />
            <strong>Choose a farm image</strong>
            <span>JPEG or PNG, maximum 10 MB</span>
            <input type="file" accept="image/jpeg,image/png" onChange={onFileChange} />
          </label>
        )}

        <div className="farm-form-grid">
          <label>
            County or region
            <input
              value={details.county}
              onChange={(event) => onDetailChange('county', event.target.value)}
              placeholder="e.g. Bomet"
            />
          </label>
          <label>
            Land size (acres)
            <input
              value={details.landAcres}
              onChange={(event) => onDetailChange('landAcres', event.target.value)}
              type="number"
              min="0"
              step="0.1"
              placeholder="e.g. 2.5"
            />
          </label>
          <label className="wide-field">
            <span>Location information</span>
            <input
              value={details.location}
              onChange={(event) => onDetailChange('location', event.target.value)}
              placeholder="Farm name or GPS description"
            />
          </label>
          <label className="wide-field">
            Notes
            <textarea
              value={details.notes}
              onChange={(event) => onDetailChange('notes', event.target.value)}
              placeholder="Optional context, such as crop type or concern"
              rows={3}
            />
          </label>
        </div>

        <button className="button-primary analyze-button" type="submit" disabled={isAnalyzing}>
          {isAnalyzing ? <LoaderCircle className="animate-spin" size={18} /> : <Trees size={18} />}
          {isAnalyzing ? 'Analyzing image…' : 'Analyze farm image'}
        </button>
      </form>
    </section>
  );
}
