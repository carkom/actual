import React from 'react';
import { useSelector } from 'react-redux';

import { useReports } from 'loot-core/src/client/data-hooks/reports';

import useFeatureFlag from '../../hooks/useFeatureFlag';
import AnimatedLoading from '../../icons/AnimatedLoading';
import { theme, styles } from '../../style';
import View from '../common/View';

import Convert from './Convert';
import CashFlowCard from './reports/CashFlowCard';
import CategorySpendingCard from './reports/CategorySpendingCard';
import CustomReportCard from './reports/CustomReportCard';
import CustomReportListCards from './reports/CustomReportListCards';
import NetWorthCard from './reports/NetWorthCard';
import SankeyCard from './reports/SankeyCard';

export function LoadingIndicator() {
  return (
    <View
      style={{
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <AnimatedLoading style={{ width: 25, height: 25 }} />
    </View>
  );
}

export default function Overview() {
  let reports = useReports();
  let categorySpendingReportFeatureFlag = useFeatureFlag(
    'categorySpendingReport',
  );
  let sankeyFeatureFlag = useFeatureFlag('sankeyReport');

  let customReportsFeatureFlag = useFeatureFlag('customReports');

  const featureCount =
    3 -
    Convert(categorySpendingReportFeatureFlag) -
    Convert(sankeyFeatureFlag) -
    Convert(customReportsFeatureFlag);

  let accounts = useSelector(state => state.queries.accounts);
  return (
    <View
      style={{
        ...styles.page,
        ...{ paddingLeft: 40, paddingRight: 40, minWidth: 700 },
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          flex: '0 0 auto',
        }}
      >
        <NetWorthCard accounts={accounts} />
        <CashFlowCard />
      </View>
      <View
        style={{
          flex: '0 0 auto',
          flexDirection: 'row',
        }}
      >
        {categorySpendingReportFeatureFlag && <CategorySpendingCard />}
        {sankeyFeatureFlag && <SankeyCard />}
        {customReportsFeatureFlag && <CustomReportCard />}
        {featureCount !== 3 &&
          [...Array(featureCount)].map((e, i) => (
            <View key={i} style={{ padding: 15, flex: 1 }} />
          ))}
      </View>
      {customReportsFeatureFlag && (
        <>
          <View
            style={{
              height: 1,
              backgroundColor: theme.sidebarBackground,
              marginTop: 10,
              flexShrink: 0,
            }}
          />
          <CustomReportListCards reports={reports} />
        </>
      )}
    </View>
  );
}
