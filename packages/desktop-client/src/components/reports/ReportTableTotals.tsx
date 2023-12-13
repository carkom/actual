import React, { type UIEventHandler, useLayoutEffect, useState } from 'react';
import { type RefProp } from 'react-spring';

import {
  amountToCurrency,
  amountToInteger,
  integerToCurrency,
} from 'loot-core/src/shared/util';

import { styles, theme } from '../../style';
import View from '../common/View';
import { Row, Cell } from '../table';

import { type DataEntity } from './entities';

type ReportTableTotalsProps = {
  data: DataEntity;
  scrollWidth?: number;
  balanceTypeOp: string;
  mode: string;
  monthsCount: number;
  totalScrollRef: RefProp<HTMLDivElement>;
  handleScroll: UIEventHandler<HTMLDivElement>;
};

function ReportTableTotals({
  data,
  scrollWidth,
  balanceTypeOp,
  mode,
  monthsCount,
  totalScrollRef,
  handleScroll,
}: ReportTableTotalsProps) {
  const [scrollWidthTotals, setScrollWidthTotals] = useState(0);

  useLayoutEffect(() => {
    if (totalScrollRef.current) {
      const [parent, child] = [
        totalScrollRef.current.offsetParent
          ? totalScrollRef.current.parentElement.scrollHeight
          : 0,
        totalScrollRef.current ? totalScrollRef.current.scrollHeight : 0,
      ];
      setScrollWidthTotals(parent > 0 && child > 0 && parent - child);
    }
  });

  const average = amountToInteger(data[balanceTypeOp]) / monthsCount;
  return (
    <Row
      collapsed={true}
      height={32 + scrollWidthTotals}
      style={{
        borderTopWidth: 1,
        borderColor: theme.tableBorder,
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: 150,
          flexShrink: 0,
          ...styles.tnum,
        }}
      >
        <Cell
          style={{
            height: 32,
          }}
          value={'Totals'}
        />
        {scrollWidthTotals > 0 && (
          <Cell
            style={{
              height: scrollWidthTotals,
              color: theme.tableText,
              backgroundColor: theme.tableBackground,
              border: 'none',
            }}
          />
        )}
      </View>
      {mode === 'time' ? (
        <View
          innerRef={totalScrollRef}
          onScroll={handleScroll}
          id={'total'}
          style={{
            overflowX: 'auto',
            flexDirection: 'row',
            flex: 1,
          }}
        >
          {data.monthData.map(item => {
            return (
              <Cell
                style={{
                  minWidth: 85,
                  ...styles.tnum,
                }}
                key={amountToCurrency(item[balanceTypeOp])}
                value={amountToCurrency(item[balanceTypeOp])}
                title={
                  Math.abs(item[balanceTypeOp]) > 100000 &&
                  amountToCurrency(item[balanceTypeOp])
                }
                width="flex"
                privacyFilter
              />
            );
          })}
        </View>
      ) : (
        <Cell width="flex" />
      )}
      <View
        style={{
          flexShrink: 0,
          ...styles.tnum,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            height: 32,
          }}
        >
          {balanceTypeOp === 'totalTotals' && (
            <>
              <Cell
                style={{
                  width: 85,
                  ...styles.tnum,
                }}
                value={amountToCurrency(data.totalAssets)}
                title={
                  Math.abs(data.totalAssets) > 100000 &&
                  amountToCurrency(data.totalAssets)
                }
              />
              <Cell
                style={{
                  width: 85,
                  ...styles.tnum,
                }}
                value={amountToCurrency(data.totalDebts)}
                title={
                  Math.abs(data.totalDebts) > 100000 &&
                  amountToCurrency(data.totalDebts)
                }
              />
            </>
          )}
          <Cell
            style={{
              width: 85,
              ...styles.tnum,
            }}
            value={amountToCurrency(data[balanceTypeOp])}
            title={
              Math.abs(data[balanceTypeOp]) > 100000 &&
              amountToCurrency(data[balanceTypeOp])
            }
            privacyFilter
          />
          <Cell
            style={{
              width: 85,
              ...styles.tnum,
            }}
            value={integerToCurrency(Math.round(average))}
            title={
              Math.abs(Math.round(average / 100)) > 100000 &&
              integerToCurrency(Math.round(average))
            }
            privacyFilter
          />

          {scrollWidth > 0 && <Cell width={scrollWidth} />}
        </View>
        {scrollWidthTotals > 0 && (
          <Cell
            style={{
              height: scrollWidthTotals,
              color: theme.tableText,
              backgroundColor: theme.tableBackground,
              border: 'none',
            }}
          />
        )}
      </View>
    </Row>
  );
}

export default ReportTableTotals;
