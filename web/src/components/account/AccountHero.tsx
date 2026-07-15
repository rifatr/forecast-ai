import { RefreshCw } from 'lucide-react';

interface AccountHeroProps {
  updatedAt: Date;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export function AccountHero({
  updatedAt,
  isRefreshing,
  onRefresh,
}: AccountHeroProps) {
  return (
    <section className="account-hero">
      <div className="account-hero-copy">
        <p className="eyebrow">Account</p>
        <h1>My account</h1>
        <p>Manage your API plan and available analysis capacity.</p>
      </div>

      <div className="account-hero-actions">
        <small>Updated {formatUpdatedAt(updatedAt)}</small>
        <button
          className="account-refresh-button"
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw size={17} className={isRefreshing ? 'animate-spin' : ''} />
          {isRefreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>
    </section>
  );
}

function formatUpdatedAt(updatedAt: Date): string {
  return updatedAt.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}
