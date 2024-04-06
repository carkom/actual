// @ts-strict-ignore

import { runQuery } from 'loot-core/src/client/query-helpers';
import { type useSpreadsheet } from 'loot-core/src/client/SpreadsheetProvider';
import { send } from 'loot-core/src/platform/client/fetch';
import * as monthUtils from 'loot-core/src/shared/months';
import { integerToAmount } from 'loot-core/src/shared/util';
import {
  type CategoryEntity,
  type RuleConditionEntity,
  type CategoryGroupEntity,
} from 'loot-core/src/types/models';
import {
  type GroupedEntity,
} from 'loot-core/src/types/models/reports';

import { getSpecificRange } from '../reportRanges';

import { makeQuery } from './makeQuery';

export type createSpendingSpreadsheetProps = {
  categories: { list: CategoryEntity[]; grouped: CategoryGroupEntity[] };
  selectedCategories: CategoryEntity[];
  conditions: RuleConditionEntity[];
  conditionsOp: string;
  setDataCheck?: (value: boolean) => void;
};

export function createSpendingSpreadsheet({
  categories,
  selectedCategories,
  conditions = [],
  conditionsOp,
  setDataCheck,
}: createSpendingSpreadsheetProps) {
  const [startDate, endDate] = getSpecificRange(3, null, 'Months');
  //const startDate = monthUtils.getMonth(monthUtils.currentDay()) + '-01';
  //const endDate = monthUtils.getMonthEnd(monthUtils.currentDay());
  const interval = 'Daily';

  const categoryFilter = (categories.list || []).filter(
    category =>
      selectedCategories &&
      selectedCategories.some(
        selectedCategory => selectedCategory.id === category.id,
      ),
  );

  return async (
    spreadsheet: ReturnType<typeof useSpreadsheet>,
    setData: (data: GroupedEntity) => void,
  ) => {

    const { filters } = await send('make-filters-from-conditions', {
      conditions: conditions.filter(cond => !cond.customName),
    });
    const conditionsOpKey = conditionsOp === 'or' ? '$or' : '$and';

    const [assets, debts] = await Promise.all([
      runQuery(
        makeQuery(
          'assets',
          startDate,
          endDate,
          interval,
          selectedCategories,
          categoryFilter,
          conditionsOpKey,
          filters,
        ),
      ).then(({ data }) => data),
      runQuery(
        makeQuery(
          'debts',
          startDate,
          endDate,
          interval,
          selectedCategories,
          categoryFilter,
          conditionsOpKey,
          filters,
        ),
      ).then(({ data }) => data),
    ]);

    const intervals = monthUtils.dayRangeInclusive(startDate, endDate);

    let totalAssets = 0;
    let totalDebts = 0;

    const test = monthUtils.rangeInclusive(
      startDate,
      monthUtils.getMonth(endDate) + '-01',
    );

    const intervalData = test
    .slice(0)
    .reverse().map(month => 
      intervals.reduce((arr, intervalItem) => {
      
        let perIntervalAssets = 0;
        let perIntervalDebts = 0;

        if (month === monthUtils.getMonth(intervalItem)) {
          const intervalAssets = assets
            .filter(e => !e.categoryIncome)
            .filter(asset => asset.date === intervalItem)
            .reduce((a, v) => (a = a + v.amount), 0);
          perIntervalAssets += intervalAssets;

          const intervalDebts = debts
            .filter(e => !e.categoryIncome)
            .filter(debt => debt.date === intervalItem)
            .reduce((a, v) => (a = a + v.amount), 0);
          perIntervalDebts += intervalDebts;

          totalAssets += perIntervalAssets;
          totalDebts += perIntervalDebts;

          arr.push({
            date: intervalItem,
            totalDebts: integerToAmount(perIntervalDebts),
            totalAssets: integerToAmount(perIntervalAssets),
            totalTotals: integerToAmount(perIntervalDebts + perIntervalAssets),
            cumTotals:
              intervalItem <= monthUtils.currentDay()
                ? integerToAmount(totalDebts + totalAssets)
                : null,
          });
        }

        return arr;
      }, [])
    );

    setData({
      intervalData,
      startDate,
      endDate,
      totalDebts: integerToAmount(totalDebts),
      totalAssets: integerToAmount(totalAssets),
      totalTotals: integerToAmount(totalAssets + totalDebts),
    });
    setDataCheck?.(true);
  };
}
