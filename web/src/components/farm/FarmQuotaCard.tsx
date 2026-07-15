import { Sprout } from 'lucide-react';
import type { FarmQuota } from '../../types/farm';

interface FarmQuotaCardProps {
  quota: FarmQuota | null;
  isLoading: boolean;
}

export function FarmQuotaCard({ quota, isLoading }: FarmQuotaCardProps) {
  let content = <span>Quota unavailable</span>;

  if (isLoading) {
    content = <span>Loading quota…</span>;
  } else if (quota) {
    content = (
      <>
        <strong>{quota.unlimited ? 'Unlimited' : quota.remaining}</strong>
        <span>
          {quota.unlimited ? 'Farm analyses available' : `of ${quota.limit} analyses remaining`}
        </span>
      </>
    );
  }

  return (
    <div className="quota-card">
      <Sprout size={21} />
      {content}
    </div>
  );
}
