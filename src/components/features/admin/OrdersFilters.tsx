'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PackageCheck } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ADMIN_I18N } from '@/constants/admin-i18n.constants';

interface OrdersFiltersProps {
  statusFilter: string;
}

export function OrdersFilters({ statusFilter }: OrdersFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (status: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (status && status !== 'all') {
        params.set('status', status);
      } else {
        params.delete('status');
      }

      params.delete('page');
      router.push(`/admin/orders?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <div className="flex flex-wrap items-end gap-3">
      <Select value={statusFilter || 'all'} onValueChange={updateParams}>
        <SelectTrigger className="min-h-9 min-w-45">
          <SelectValue placeholder={ADMIN_I18N.filters.allStatuses} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            <span className="flex items-center gap-2">
              <PackageCheck  className='size-5'/>
              {ADMIN_I18N.filters.allStatuses}
            </span>
          </SelectItem>
          <SelectItem value="reservado">{ADMIN_I18N.statuses.reservado}</SelectItem>
          <SelectItem value="pagado">{ADMIN_I18N.statuses.pagado}</SelectItem>
          <SelectItem value="cancelado">{ADMIN_I18N.statuses.cancelado}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}