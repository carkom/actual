import React, { memo } from 'react';

import {
  amountToCurrency,
  amountToInteger,
  integerToCurrency,
} from 'loot-core/src/shared/util';

import { styles, theme } from '../../style';
import { Row, Cell } from '../table';

import { type GroupedEntity } from './entities';

type ReportTableRowProps = {
  item: GroupedEntity;
  balanceTypeOp?: string;
  groupByItem: string;
  mode: string;
  monthsCount: number;
  style?: object;
};

const ReportTableRow = memo(
  ({
    item,
    balanceTypeOp,
    groupByItem,
    mode,
    monthsCount,
    style,
  }: ReportTableRowProps) => {
    const average = amountToInteger(item[balanceTypeOp]) / monthsCount;
    return (
      <Row
        key={item[groupByItem]}
        collapsed={true}
        style={{
          color: theme.tableText,
          backgroundColor: theme.tableBackground,
          ...style,
        }}
      >
        {item.monthData && mode === 'time'
          ? item.monthData.map(month => {
              return (
                <Cell
                  style={{
                    minWidth: 85,
                    ...styles.tnum,
                  }}
                  key={amountToCurrency(month[balanceTypeOp])}
                  value={amountToCurrency(month[balanceTypeOp])}
                  title={
                    Math.abs(month[balanceTypeOp]) > 100000 &&
                    amountToCurrency(month[balanceTypeOp])
                  }
                  width="flex"
                  privacyFilter
                />
              );
            })
          : balanceTypeOp === 'totalTotals' && (
              <>
                <Cell
                  value={amountToCurrency(item.totalAssets)}
                  title={
                    Math.abs(item.totalAssets) > 100000 &&
                    amountToCurrency(item.totalAssets)
                  }
                  width="flex"
                  style={{
                    minWidth: 85,
                    ...styles.tnum,
                  }}
                />
                <Cell
                  value={amountToCurrency(item.totalDebts)}
                  title={
                    Math.abs(item.totalDebts) > 100000 &&
                    amountToCurrency(item.totalDebts)
                  }
                  width="flex"
                  style={{
                    minWidth: 85,
                    ...styles.tnum,
                  }}
                />
              </>
            )}
        <Cell
          value={amountToCurrency(item[balanceTypeOp])}
          title={
            Math.abs(item[balanceTypeOp]) > 100000 &&
            amountToCurrency(item[balanceTypeOp])
          }
          style={{
            fontWeight: 600,
            minWidth: 85,
            ...styles.tnum,
          }}
          width="flex"
          privacyFilter
        />
        <Cell
          value={integerToCurrency(Math.round(average))}
          title={
            Math.abs(Math.round(average / 100)) > 100000 &&
            integerToCurrency(Math.round(average))
          }
          style={{
            fontWeight: 600,
            minWidth: 85,
            ...styles.tnum,
          }}
          width="flex"
          privacyFilter
        />
      </Row>
    );
  },
);

export default ReportTableRow;