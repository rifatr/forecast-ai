import { useEffect, useState } from 'react';
import { CloudSun, RefreshCw, Trees } from 'lucide-react';
import { getDashboard } from '../api/dashboard';
import { AccountHero } from '../components/account/AccountHero';
import { QuotaUsageCard } from '../components/account/QuotaUsageCard';
import type { DashboardData } from '../types/dashboard';

export function Account() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadDashboard();
  }, []);

  async function loadDashboard() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getDashboard();
      setDashboard(response);
      setUpdatedAt(new Date());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load account information.');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading && !dashboard) {
    return <AccountLoadingState />;
  }

  if (error && !dashboard) {
    return <AccountErrorState error={error} onRetry={() => void loadDashboard()} />;
  }

  if (!dashboard || !updatedAt) {
    return null;
  }

  return (
    <div className="account-page animate-fade-in">
      <AccountHero
        updatedAt={updatedAt}
        isRefreshing={isLoading}
        onRefresh={() => void loadDashboard()}
      />

      {error && <div className="inline-alert">{error}</div>}

      <section className="account-quota-grid" aria-label="Available API capacity">
        <QuotaUsageCard
          title="Weather API requests"
          unit="requests"
          icon={CloudSun}
          quota={dashboard.usage}
          variant="weather"
        />
        <QuotaUsageCard
          title="Farm AI analyses"
          unit="analyses"
          icon={Trees}
          quota={dashboard.treesQuota}
          resetAt={'error' in dashboard.treesQuota ? undefined : dashboard.treesQuota.resets_at}
          variant="farm"
        />
      </section>
    </div>
  );
}

function AccountLoadingState() {
  return (
    <div className="account-state panel">
      <RefreshCw className="animate-spin" size={28} />
      <strong>Loading account dashboard…</strong>
      <span>Checking your available API capacity.</span>
    </div>
  );
}

function AccountErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="account-state panel">
      <CloudSun size={28} />
      <strong>We couldn’t load your account dashboard.</strong>
      <span>{error}</span>
      <button className="button-primary" type="button" onClick={onRetry}>
        <RefreshCw size={17} />
        Try again
      </button>
    </div>
  );
}
