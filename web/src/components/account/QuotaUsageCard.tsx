import type { LucideIcon } from 'lucide-react';
import { CircleAlert } from 'lucide-react';
import type { DashboardError, DashboardUsage } from '../../types/dashboard';

interface QuotaUsageCardProps {
  title: string;
  unit: string;
  icon: LucideIcon;
  quota: DashboardUsage | DashboardError;
  resetAt?: string;
  variant: 'weather' | 'farm';
}

export function QuotaUsageCard({
  title,
  unit,
  icon: Icon,
  quota,
  resetAt,
  variant,
}: QuotaUsageCardProps) {
  if ('error' in quota) {
    return (
      <section className={`quota-usage-card ${variant} quota-unavailable`}>
        <div className="quota-card-heading">
          <span className="quota-icon">
            <Icon size={20} />
          </span>
          <div>
            <h2>{title}</h2>
          </div>
        </div>
        <div className="quota-error">
          <CircleAlert size={18} />
          <span>{quota.error}</span>
        </div>
      </section>
    );
  }

  const percentUsed = quota.unlimited || quota.limit <= 0
    ? 0
    : Math.min(100, Math.max(0, (quota.used / quota.limit) * 100));
  const remainingLabel = quota.unlimited ? 'Unlimited' : quota.remaining.toLocaleString();

  return (
    <section className={`quota-usage-card ${variant}`}>
      <div className="quota-card-heading">
        <span className="quota-icon">
          <Icon size={20} />
        </span>
        <div>
          <p className="eyebrow">Available capacity</p>
          <h2>{title}</h2>
        </div>
        <span className="plan-badge">{formatPlan(quota.plan)}</span>
      </div>

      <div className="quota-main-value">
        <strong>{remainingLabel}</strong>
        <span>{quota.unlimited ? `${unit} available` : `${unit} remaining`}</span>
      </div>

      <div className="quota-progress" aria-label={`${Math.round(percentUsed)} percent of quota used`}>
        <span style={{ width: `${percentUsed}%` }} />
      </div>

      <div className="quota-details">
        <span>
          <b>{quota.unlimited ? 'Unlimited' : quota.used.toLocaleString()}</b>
          {quota.unlimited ? 'available' : `of ${quota.limit.toLocaleString()} used`}
        </span>
      </div>

      {resetAt && <p className="quota-reset">Resets {formatResetDate(resetAt)}</p>}
    </section>
  );
}

function formatPlan(plan: string): string {
  return `${plan.charAt(0).toUpperCase()}${plan.slice(1)} plan`;
}

function formatResetDate(timestamp: string): string {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return 'on the next quota cycle';
  }

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
