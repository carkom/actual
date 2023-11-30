import { runQuery } from 'loot-core/src/client/query-helpers';
import { send } from 'loot-core/src/platform/client/fetch';
import * as monthUtils from 'loot-core/src/shared/months';
import { integerToAmount } from 'loot-core/src/shared/util';

import { categoryLists } from '../ReportOptions';

import filterHiddenItems from './filterHiddenItems';
import makeQuery from './makeQuery';
import recalculate from './recalculate';

function createSpreadsheet(
  start,
  end,
  categories,
  selectedCategories,
  conditions = [],
  conditionsOp,
  hidden,
  uncat,
) {
  let [catList, catGroup] = categoryLists(uncat, categories);

  let categoryFilter = (catList || []).filter(
    category =>
      !category.hidden &&
      selectedCategories &&
      selectedCategories.some(
        selectedCategory => selectedCategory.id === category.id,
      ),
  );

  return async (spreadsheet, setData) => {
    if (catList.length === 0) {
      return null;
    }

    let { filters } = await send('make-filters-from-conditions', {
      conditions: conditions.filter(cond => !cond.customName),
    });
    const conditionsOpKey = conditionsOp === 'or' ? '$or' : '$and';

    const [assets, debts] = await Promise.all([
      runQuery(
        makeQuery(
          'assets',
          start,
          end,
          hidden,
          selectedCategories,
          categoryFilter,
          conditionsOpKey,
          filters,
        ),
      ).then(({ data }) => data),
      runQuery(
        makeQuery(
          'debts',
          start,
          end,
          hidden,
          selectedCategories,
          categoryFilter,
          conditionsOpKey,
          filters,
        ),
      ).then(({ data }) => data),
    ]);

    const months = monthUtils.rangeInclusive(start, end);

    const groupedData = catGroup
      .filter(f => (hidden || f.hidden === 0) && f)
      .map(
        group => {
          let totalAssets = 0;
          let totalDebts = 0;

          const monthData = months.reduce((arr, month) => {
            let groupedAssets = 0;
            let groupedDebts = 0;

            group.categories.map(item => {
              let monthAssets = filterHiddenItems(item, assets)
                .filter(
                  asset => asset.date === month && asset.category === item.id,
                )
                .reduce((a, v) => (a = a + v.amount), 0);
              groupedAssets += monthAssets;

              let monthDebts = filterHiddenItems(item, debts)
                .filter(
                  debts => debts.date === month && debts.category === item.id,
                )
                .reduce((a, v) => (a = a + v.amount), 0);
              groupedDebts += monthDebts;

              return null;
            });

            totalAssets += groupedAssets;
            totalDebts += groupedDebts;

            arr.push({
              date: month,
              totalAssets: integerToAmount(groupedAssets),
              totalDebts: integerToAmount(groupedDebts),
              totalTotals: integerToAmount(groupedDebts + groupedAssets),
            });

            return arr;
          }, []);

          const stackedCategories = group.categories.map(item => {
            const calc = recalculate(item, months, assets, debts, 'category');
            return { ...calc };
          });

          return {
            id: group.id,
            name: group.name,
            totalAssets: integerToAmount(totalAssets),
            totalDebts: integerToAmount(totalDebts),
            totalTotals: integerToAmount(totalAssets + totalDebts),
            monthData,
            categories: stackedCategories,
          };
        },
        [start, end],
      );

    setData(groupedData);
  };
}

export default createSpreadsheet;
