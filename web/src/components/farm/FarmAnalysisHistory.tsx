import { Leaf, RefreshCw } from 'lucide-react';
import type { FarmAnalysis } from '../../types/farm';

interface FarmAnalysisHistoryProps {
  analyses: FarmAnalysis[];
  isLoading: boolean;
  onRefresh: () => void;
  onSelect: (analysis: FarmAnalysis) => void;
}

export function FarmAnalysisHistory({
  analyses,
  isLoading,
  onRefresh,
  onSelect,
}: FarmAnalysisHistoryProps) {
  return (
    <section className="panel farm-history">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Previous work</p>
          <h2>Analysis history</h2>
        </div>
        <button className="icon-button" type="button" onClick={onRefresh} title="Refresh history">
          <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {isLoading ? (
        <p className="farm-empty">Loading previous analyses…</p>
      ) : analyses.length === 0 ? (
        <p className="farm-empty">
          No saved analyses yet. Your completed farm analyses will appear here.
        </p>
      ) : (
        <div className="history-list">
          {analyses.map((item) => (
            <button
              type="button"
              className="history-item"
              key={item.analysis_id}
              onClick={() => onSelect(item)}
            >
              <Leaf size={19} />
              <span>
                <strong>{item.location || item.county || 'Farm analysis'}</strong>
                <small>{formatHistoryDate(item.timestamp)}</small>
              </span>
              <b>{item.total_tree_count} trees</b>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function formatHistoryDate(timestamp: string): string {
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? 'Unknown date' : date.toLocaleDateString();
}
