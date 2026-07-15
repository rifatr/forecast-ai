import { CheckCircle2, CircleAlert, RotateCcw } from 'lucide-react';
import type { FarmAnalysis } from '../../types/farm';

interface FarmAnalysisResultProps {
  analysis: FarmAnalysis;
  onAnalyzeAgain: () => void;
}

interface FocusedResultListProps {
  eyebrow: string;
  title: string;
  items: string[];
  className: string;
}

interface ContextItemProps {
  label: string;
  value: string;
}

interface MetricProps {
  label: string;
  value: string | number;
}

export function FarmAnalysisResult({
  analysis,
  onAnalyzeAgain,
}: FarmAnalysisResultProps) {
  const healthTotal =
    analysis.tree_health.healthy +
    analysis.tree_health.needs_care +
    analysis.tree_health.needs_replacement;
  const healthItems = [
    ['Healthy', analysis.tree_health.healthy, 'health-good'],
    ['Needs care', analysis.tree_health.needs_care, 'health-care'],
    ['Replace', analysis.tree_health.needs_replacement, 'health-replace'],
  ] as const;

  return (
    <section className="panel analysis-result">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Analysis complete</p>
          <h2>{analysis.location || analysis.county || 'Farm assessment'}</h2>
        </div>
        <div className="analysis-actions">
          <CheckCircle2 className="result-success" size={22} />
          <button type="button" className="button-secondary" onClick={onAnalyzeAgain}>
            <RotateCcw size={16} />
            Analyze another image
          </button>
        </div>
      </div>

      {analysis.low_confidence && (
        <div className="low-confidence">
          <CircleAlert size={16} />
          Low confidence: consider a clearer or more overhead image.
        </div>
      )}

      <section className="result-focus">
        <div className="focus-heading">
          <div>
            <p className="eyebrow">Tree health</p>
            <h3>{analysis.total_tree_count} trees assessed</h3>
          </div>
          <span>{formatPercentage(analysis.confidence_score)} confidence</span>
        </div>

        <div className="health-focus-grid">
          {healthItems.map(([label, count, className]) => (
            <div className={`health-focus-card ${className}`} key={label}>
              <span>{label}</span>
              <strong>{count}</strong>
              <small>{formatPercentage(healthTotal ? count / healthTotal : 0)} of trees</small>
            </div>
          ))}
        </div>
      </section>

      <FocusedResultList
        eyebrow={`Recommended action${analysis.recommendations.length === 1 ? '' : 's'}`}
        title="What to do next"
        items={analysis.recommendations}
        className="recommendation-focus"
      />

      <FocusedResultList
        eyebrow={`Field observation${analysis.observations.length === 1 ? '' : 's'}`}
        title="What the image shows"
        items={analysis.observations}
        className="observation-focus"
      />

      <div className="analysis-metrics">
        <Metric 
          label="Trees detected" 
          value={analysis.total_tree_count} 
        />
        <Metric 
          label="Canopy coverage" 
          value={formatPercentage(analysis.canopy_coverage_pct)} 
        />
        <Metric 
          label="Density / acre" 
          value={analysis.tree_density_per_acre?.toFixed(1) ?? '—'} 
        />
        <Metric 
          label="Likely species" 
          value={analysis.tree_species_guess} 
        />
      </div>

      <div className="analysis-context">
        <ContextItem 
          label="County" 
          value={analysis.county || 'Not provided'}
        />
        <ContextItem
          label="Farm size"
          value={analysis.land_acres === null ? 'Not provided' : `${analysis.land_acres} acres`}
        />
        <ContextItem 
          label="Analyzed" 
          value={formatAnalysisTime(analysis.timestamp)} 
        />
        <ContextItem 
          label="Reference" 
          value={analysis.analysis_id} 
        />
      </div>

      <ProcessingDetails analysis={analysis} />
    </section>
  );
}

function FocusedResultList({
  eyebrow,
  title,
  items,
  className,
}: FocusedResultListProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className={className}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h3>{title}</h3>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function ContextItem({ label, value }: ContextItemProps) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Metric({ label, value }: MetricProps) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ProcessingDetails({ analysis }: { analysis: FarmAnalysis }) {
  const { cv_debug: debug } = analysis;

  return (
    <details className="processing-details">
      <summary>Processing details</summary>
      <dl>
        <div>
          <dt>Original image</dt>
          <dd>{debug.orig_resolution}</dd>
        </div>
        <div>
          <dt>Processed image</dt>
          <dd>{debug.work_resolution}</dd>
        </div>
        <div>
          <dt>Candidate crowns</dt>
          <dd>{debug.peaks_detected}</dd>
        </div>
        <div>
          <dt>Detected trees</dt>
          <dd>{debug.after_area_filter}</dd>
        </div>
        <div>
          <dt>Canopy pixels</dt>
          <dd>{debug.canopy_px.toLocaleString()}</dd>
        </div>
      </dl>
      <div className="processing-image-links">
        <a href={analysis.original_image_url} target="_blank" rel="noreferrer">
          Open submitted image
        </a>
        {analysis.overlay_image_url && (
          <a href={analysis.overlay_image_url} target="_blank" rel="noreferrer">
            Open processed overlay
          </a>
        )}
      </div>
    </details>
  );
}

function formatPercentage(value: number): string {
  return `${Math.round(value <= 1 ? value * 100 : value)}%`;
}

function formatAnalysisTime(timestamp: string): string {
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? 'Unknown' : date.toLocaleString();
}
