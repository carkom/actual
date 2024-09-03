import React, {
  type RefObject,
  useLayoutEffect,
  useRef,
  type UIEventHandler,
  useMemo,
} from 'react';

import 'ag-grid-community/styles/ag-grid.css'; // Mandatory CSS required by the Data Grid
import 'ag-grid-community/styles/ag-theme-material.css'; // Optional Theme applied to the Data Grid

import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component

import { amountToCurrency } from 'loot-core/shared/util';
import {
  type DataEntity,
  type balanceTypeOpType,
} from 'loot-core/src/types/models/reports';
import { type RuleConditionEntity } from 'loot-core/types/models/rule';

import { type CSSProperties } from '../../../../style';
import { theme } from '../../../../style/theme';
import { View } from '../../../common/View';
import { ReportOptions } from '../../ReportOptions';

type ReportTableProps = {
  saveScrollWidth: (value: number) => void;
  headerScrollRef: RefObject<HTMLDivElement>;
  listScrollRef: RefObject<HTMLDivElement>;
  totalScrollRef: RefObject<HTMLDivElement>;
  handleScroll: UIEventHandler<HTMLDivElement>;
  groupBy: string;
  balanceTypeOp: balanceTypeOpType;
  data: DataEntity;
  filters?: RuleConditionEntity[];
  mode: string;
  intervalsCount: number;
  interval: string;
  compact: boolean;
  style?: CSSProperties;
  compactStyle?: CSSProperties;
  showHiddenCategories?: boolean;
  showOffBudget?: boolean;
};

export function ReportTable({
  saveScrollWidth,
  groupBy,
  balanceTypeOp,
  data,
  mode,
  intervalsCount,
  interval,
}: ReportTableProps) {
  const stacked: Record<string, number> = {};
  const rowData = data.data.map(v => {
    v.intervalData.map(
      (c, index) => (stacked[data.intervalData[index].date] = c.totalTotals),
    );
    return {
      name: v.name,
      ...stacked,
      netAssets: v.netAssets,
      netDebts: v.netDebts,
      totalAssets: v.totalAssets,
      totalDebts: v.totalDebts,
      totalTotals: v.totalTotals,
      average: v[balanceTypeOp] / intervalsCount,
    };
  });

  const contentRef = useRef<HTMLDivElement>(null);

  const defaultColDef = useMemo(() => {
    return {
      //flex: 1,
      //filter: true,
      initialWidth: 100,
      headerClass: 'header',
      columnHeaderMouseOver: 'header-hover',
    };
  }, []);

  // Column Definitions: Defines the columns to be displayed.
  const colDefs = [
    {
      field: 'name',
      pinned: 'left',
      cellStyle: { paddingLeft: 5 },
      headerName:
        groupBy === 'Interval'
          ? ReportOptions.intervalMap.get(interval)
          : groupBy,
    },
    ...(mode === 'time'
      ? data.intervalData.map(v => {
          return {
            field: v.date,
            cellStyle: { paddingLeft: 5 },
            headerName: v.date,
          };
        })
      : balanceTypeOp === 'totalTotals'
        ? [
            {
              field: 'totalAssets',
              cellStyle: { paddingLeft: 5 },
              headerName: 'Deposits',
            },
            {
              field: 'totalDebts',
              cellStyle: { paddingLeft: 5 },
              headerName: 'Payments',
            },
          ]
        : []),
    {
      field: balanceTypeOp,
      pinned: mode === 'time' ? 'right' : null,
      cellStyle: { paddingLeft: 5 },
      headerName: 'Totals',
    },
    {
      field: 'average',
      valueFormatter: p => amountToCurrency(p.data.average),
      pinned: mode === 'time' ? 'right' : null,
      cellStyle: { paddingLeft: 5 },
      headerName: 'Average',
    },
  ];

  useLayoutEffect(() => {
    if (contentRef.current && saveScrollWidth) {
      saveScrollWidth(contentRef.current ? contentRef.current.offsetWidth : 0);
    }
  });
  return (
    <>
      <style type="text/css">
        {`
          .ag-theme-material {
            --ag-background-color: ${theme.tableBackground};
            --ag-foreground-color: ${theme.tableText};
            --ag-header-foreground-color: ${theme.tableHeaderText};
            --ag-header-background-color: ${theme.tableHeaderBackground};
            --ag-header-cell-hover-background-color: ${theme.buttonPrimaryBackgroundHover};
            --ag-borders: none;
            --ag-border-color: ${theme.tableBackground};
            --ag-row-border-width: 0px;
            --ag-font-size: 13px;
            --ag-row-hover-color: ${theme.tableRowBackgroundHover};
            --ag-header-column-resize-handle-display: none;
            --ag-header-column-separator-color: ${theme.tableTextSubdued};
            --ag-header-column-separator-display: block;
            --ag-header-column-separator-height: 75%;
            --ag-header-column-separator-width: 2px;
            --ag-icon-font-color-asc: ${theme.tableHeaderText};
            --ag-icon-font-color-desc: ${theme.tableHeaderText};
          }
          .header {
            padding-left: 5px;
          }
        `}
      </style>

      <View
        className="ag-theme-material" // applying the Data Grid theme
        style={{
          height: '250px',
          //alignItems: 'center',
        }} // the Data Grid will fill the size of the parent container
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          rowSelection="multiple"
          defaultColDef={defaultColDef}
          maintainColumnOrder={true}
          headerHeight={30}
          rowHeight={30}
          //suppressHorizontalScroll={true}
          //embedFullWidthRows={true}
          columnWidth={10}
          freezeColumns="pinned"
          //grandTotalRow={'bottom'}
          style={{
            marginLeft: 30,
          }}
        />
      </View>
    </>
  );
}
