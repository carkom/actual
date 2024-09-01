import { useMemo } from 'react';

import { q } from '../../shared/query';
import { type CurrencyEntity } from '../../types/models';
import { useLiveQuery } from '../query-hooks';

function toJS(rows) {
  const currencies = rows.map(row => {
    return {
      id: row.id,
      index: row.index_value,
      currency: row.currency,
      commitDate: row.commit_date,
      rate: row.rate,
      tombstone: row.tombstone,
    };
  });
  return currencies;
}

export function useCurrencies() {
  const queryData = useLiveQuery<CurrencyEntity[]>(
    () => q('currencies').select('*'),
    [],
  );

  return useMemo(
    () => ({
      isLoading: queryData === null,
      data: toJS(queryData || []),
    }),
    [queryData],
  );
}
