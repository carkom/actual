// @ts-strict-ignore
import React from 'react';

import { css } from 'glamor';
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import {
  amountToCurrency,
  amountToCurrencyNoDecimal,
} from 'loot-core/src/shared/util';
import { type GroupedEntity } from 'loot-core/src/types/models/reports';

import { usePrivacyMode } from '../../../hooks/usePrivacyMode';
import { theme } from '../../../style';
import { type CSSProperties } from '../../../style';
import { AlignedText } from '../../common/AlignedText';
import { Container } from '../Container';
import { numberFormatterTooltip } from '../numberFormatter';

type PayloadItem = {
  payload: {
    date: string;
    totalAssets: number | string;
    totalDebts: number | string;
    totalTotals: number | string;
    cumTotals: number | string;
  };
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: PayloadItem[];
  balanceTypeOp?: string;
};

const CustomTooltip = ({
  active,
  payload,
  balanceTypeOp,
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`${css({
          zIndex: 1000,
          pointerEvents: 'none',
          borderRadius: 2,
          boxShadow: '0 1px 6px rgba(0, 0, 0, .20)',
          backgroundColor: theme.menuBackground,
          color: theme.menuItemText,
          padding: 10,
        })}`}
      >
        <div>
          <div style={{ marginBottom: 10 }}>
            <strong>{payload[0].payload[0].date}</strong>
          </div>
          <div style={{ lineHeight: 1.5 }}>
            {['cumTotals'].includes(balanceTypeOp) && (
              <AlignedText
                left="Spending:"
                right={amountToCurrency(payload[0].payload[0].cumTotals)}
              />
            )}
            {['totalAssets', 'totalTotals'].includes(balanceTypeOp) && (
              <AlignedText
                left="Assets:"
                right={amountToCurrency(payload[0].payload.totalAssets)}
              />
            )}
            {['totalDebts', 'totalTotals'].includes(balanceTypeOp) && (
              <AlignedText
                left="Debt:"
                right={amountToCurrency(payload[0].payload.totalDebts)}
              />
            )}
            {['totalTotals'].includes(balanceTypeOp) && (
              <AlignedText
                left="Net:"
                right={
                  <strong>
                    {amountToCurrency(payload[0].payload.totalTotals)}
                  </strong>
                }
              />
            )}
          </div>
        </div>
      </div>
    );
  }
};

type SpendingGraphProps = {
  style?: CSSProperties;
  data: GroupedEntity;
  compact?: boolean;
};

export function SpendingGraph({ style, data, compact }: SpendingGraphProps) {
  const privacyMode = usePrivacyMode();
  const balanceTypeOp = 'cumTotals';
  const dataMax = Math.max(...data.intervalData[0].map(i => i[balanceTypeOp]));
  const dataMin = Math.min(...data.intervalData[0].map(i => i[balanceTypeOp]));

  const tickFormatter = tick => {
    if (!privacyMode) return `${amountToCurrencyNoDecimal(tick)}`; // Formats the tick values as strings with commas
    return '...';
  };

  const gradientOffset = () => {
    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }

    return dataMax / (dataMax - dataMin);
  };

  const off = gradientOffset();

  const getVal = obj => {
    return obj.cumTotals && -1 * obj.cumTotals;
  };

  const getDate = obj => {
    return obj.date;
  };

  return (
    <Container
      style={{
        ...style,
        ...(compact && { height: 'auto' }),
      }}
    >
      {(width, height) =>
        data.intervalData && (
          <ResponsiveContainer>
            <div>
              {!compact && <div style={{ marginTop: '15px' }} />}
              <AreaChart
                width={width}
                height={height}
                data={data.intervalData}
                margin={{
                  top: 0,
                  right: 0,
                  left: 0,
                  bottom: 0,
                }}
              >
                {compact ? null : (
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                )}
                {compact ? null : (
                  <XAxis
                    dataKey={val => getDate(val)}
                    tick={{ fill: theme.pageText }}
                    tickLine={{ stroke: theme.pageText }}
                  />
                )}
                {compact ? null : (
                  <YAxis
                    dataKey={val => getVal(val)}
                    domain={[0, 'auto']}
                    tickFormatter={tickFormatter}
                    tick={{ fill: theme.pageText }}
                    tickLine={{ stroke: theme.pageText }}
                    tickSize={0}
                  />
                )}
                <Tooltip
                  content={<CustomTooltip balanceTypeOp={balanceTypeOp} />}
                  formatter={numberFormatterTooltip}
                  isAnimationActive={false}
                />
                <defs>
                  <linearGradient
                    id={`fill${balanceTypeOp}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset={off}
                      stopColor={theme.reportsBlue}
                      stopOpacity={0.2}
                    />
                    <stop
                      offset={off}
                      stopColor={theme.reportsRed}
                      stopOpacity={0.2}
                    />
                  </linearGradient>
                  <linearGradient
                    id={`stroke${balanceTypeOp}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset={off}
                      stopColor={theme.reportsBlue}
                      stopOpacity={1}
                    />
                    <stop
                      offset={off}
                      stopColor={theme.reportsRed}
                      stopOpacity={1}
                    />
                  </linearGradient>
                </defs>

                <Area
                  type="linear"
                  dot={false}
                  activeDot={false}
                  animationDuration={0}
                  dataKey={val => getVal(val)}
                  stroke={`url(#stroke${balanceTypeOp})`}
                  fill={`url(#fill${balanceTypeOp})`}
                  fillOpacity={1}
                />
              </AreaChart>
            </div>
          </ResponsiveContainer>
        )
      }
    </Container>
  );
}
