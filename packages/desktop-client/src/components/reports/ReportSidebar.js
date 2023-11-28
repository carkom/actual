import React from 'react';

import * as monthUtils from 'loot-core/src/shared/months';

import { theme } from '../../style';
import Button from '../common/Button';
import Select from '../common/Select';
import Text from '../common/Text';
import View from '../common/View';
import { Checkbox } from '../forms';

import CategorySelector from './CategorySelector';
import {
  validateStart,
  validateEnd,
  getLatestRange,
  getFullRange,
  validateRange,
} from './Header';
import { ReportOptions } from './ReportOptions';

function ModeButton({ selected, children, style, onSelect }) {
  return (
    <Button
      type="bare"
      style={{
        padding: '5px 10px',
        backgroundColor: theme.menuBackground,
        marginRight: 5,
        fontSize: 'inherit',
        ...(selected && {
          backgroundColor: theme.buttonPrimaryBackground,
          color: theme.buttonPrimaryText,
          ':hover': {
            backgroundColor: theme.buttonPrimaryBackgroundHover,
            color: theme.buttonPrimaryTextHover,
          },
        }),
        ...style,
      }}
      onClick={onSelect}
    >
      {children}
    </Button>
  );
}

export function ReportSidebar({
  start,
  end,
  onChangeDates,
  dateRange,
  setDateRange,
  dateRangeLine,
  allMonths,
  graphType,
  setGraphType,
  setViewLegend,
  typeDisabled,
  setTypeDisabled,
  groupBy,
  setGroupBy,
  balanceType,
  setBalanceType,
  mode,
  setMode,
  showEmpty,
  setShowEmpty,
  showOffBudgetHidden,
  setShowOffBudgetHidden,
  showUncategorized,
  setShowUncategorized,
  categories,
  selectedCategories,
  setSelectedCategories,
}) {
  const onSelectRange = cond => {
    switch (cond) {
      case 'All time':
        onChangeDates(...getFullRange(allMonths));
        break;
      case 'Year to date':
        onChangeDates(
          ...validateRange(
            allMonths,
            monthUtils.getYearStart(monthUtils.currentMonth()),
            monthUtils.currentMonth(),
          ),
        );
        break;
      case 'Last year':
        onChangeDates(
          ...validateRange(
            allMonths,
            monthUtils.getYearStart(
              monthUtils.prevYear(monthUtils.currentMonth()),
            ),
            monthUtils.getYearEnd(
              monthUtils.prevYear(monthUtils.currentDate()),
            ),
          ),
        );
        break;
      default:
        onChangeDates(...getLatestRange(ReportOptions.dateRangeMap.get(cond)));
    }
  };

  const onChangeMode = cond => {
    setMode(cond);
    if (cond === 'time') {
      if (graphType === 'TableGraph') {
        setTypeDisabled([]);
      } else {
        setTypeDisabled(['Net']);
        if (['Net'].includes(balanceType)) {
          setBalanceType('Expense');
        }
      }
      if (graphType === 'BarGraph') {
        setGraphType('StackedBarGraph');
      }
      if (['AreaGraph', 'DonutGraph'].includes(graphType)) {
        setGraphType('TableGraph');
        //setViewLegend(false);
      }
      if (['Month', 'Year'].includes(groupBy)) {
        setGroupBy('Category');
      }
    } else {
      if (graphType === 'StackedBarGraph') {
        setGraphType('BarGraph');
      } else {
        setTypeDisabled([]);
      }
    }
  };

  const onChangeSplit = cond => {
    setGroupBy(cond);
    if (mode === 'total') {
      if (graphType !== 'TableGraph') {
        setTypeDisabled(!['Month', 'Year'].includes(groupBy) ? [] : ['Net']);
      }
    }
    if (['Net'].includes(balanceType) && graphType !== 'TableGraph') {
      setBalanceType('Expense');
    }
  };

  return (
    <View
      style={{
        width: 225,
        paddingTop: 10,
        paddingRight: 10,
        flexShrink: 0,
        overflowY: 'auto',
      }}
    >
      <View style={{ flexShrink: 0 }}>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 5,
            alignItems: 'center',
          }}
        >
          <Text>
            <strong>Display</strong>
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            padding: 5,
            alignItems: 'center',
          }}
        >
          <Text style={{ width: 40, textAlign: 'right', marginRight: 5 }}>
            Mode:
          </Text>
          <ModeButton
            selected={mode === 'total'}
            onSelect={() => onChangeMode('total')}
          >
            Total
          </ModeButton>
          <ModeButton
            selected={mode === 'time'}
            onSelect={() => onChangeMode('time')}
          >
            Time
          </ModeButton>
        </View>
        <View
          style={{
            flexDirection: 'row',
            padding: 5,
            alignItems: 'center',
          }}
        >
          <Text style={{ width: 40, textAlign: 'right', marginRight: 5 }}>
            Split:
          </Text>
          <Select
            value={groupBy}
            onChange={e => onChangeSplit(e)}
            options={ReportOptions.groupBy.map(option => [
              option.description,
              option.description,
            ])}
            disabledKeys={
              mode === 'time'
                ? ['Month', 'Year']
                : graphType === 'AreaGraph'
                ? ['Category', 'Group', 'Payee', 'Account', 'Year']
                : ['Year']
            }
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            padding: 5,
            alignItems: 'center',
          }}
        >
          <Text style={{ width: 40, textAlign: 'right', marginRight: 5 }}>
            Type:
          </Text>
          <Select
            value={balanceType}
            onChange={setBalanceType}
            options={ReportOptions.balanceType.map(option => [
              option.description,
              option.description,
            ])}
            disabledKeys={typeDisabled}
          />
        </View>
        {/* //It would be nice to retain this for future usage
            <View
              style={{
                flexDirection: 'row',
                padding: 5,
                alignItems: 'center',
              }}
            >
              <Text style={{ width: 40, textAlign: 'right', marginRight: 5, paddingLeft: -10 }}>
                Interval:
              </Text>
              <Select
                value={interval}
                onChange={setInterval}
                options={intervalOptions.map(option => [
                  option.value,
                  option.description,
                ])}
                disabledKeys={
                  [1,2,3,4,5]
                }
              />
            </View>
            */}
        <View
          style={{
            flexDirection: 'row',
            padding: 5,
            alignItems: 'center',
          }}
        >
          <Text style={{ width: 40, textAlign: 'right', marginRight: 5 }} />

          <Checkbox
            id="show-empty-columns"
            checked={showEmpty}
            value={showEmpty}
            onChange={() => setShowEmpty(!showEmpty)}
          />
          <label
            htmlFor="show-empty-columns"
            title="Show rows that are zero or blank"
            style={{ fontSize: 12 }}
          >
            Show Empty Rows
          </label>
        </View>
        <View
          style={{
            flexDirection: 'row',
            padding: 5,
            alignItems: 'center',
          }}
        >
          <Text style={{ width: 40, textAlign: 'right', marginRight: 5 }} />

          <Checkbox
            id="show-hidden-columns"
            checked={showOffBudgetHidden}
            value={showOffBudgetHidden}
            onChange={() => setShowOffBudgetHidden(!showOffBudgetHidden)}
          />
          <label
            htmlFor="show-hidden-columns"
            title="Show off budget accounts and hidden categories"
            style={{ fontSize: 12 }}
          >
            Off Budget Items
          </label>
        </View>
        <View
          style={{
            flexDirection: 'row',
            padding: 5,
            alignItems: 'center',
          }}
        >
          <Text style={{ width: 40, textAlign: 'right', marginRight: 5 }} />

          <Checkbox
            id="show-uncategorized"
            checked={showUncategorized}
            value={showUncategorized}
            onChange={() => setShowUncategorized(!showUncategorized)}
          />
          <label
            htmlFor="show-uncategorized"
            title="Show uncategorized transactions"
            style={{ fontSize: 12 }}
          >
            Uncategorized
          </label>
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: theme.pillBorderDark,
            marginTop: 10,
            flexShrink: 0,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            marginTop: 10,
            marginBottom: 5,
            alignItems: 'center',
          }}
        >
          <Text>
            <strong>Date filters</strong>
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            padding: 5,
            alignItems: 'center',
          }}
        >
          <Text style={{ width: 40, textAlign: 'right', marginRight: 5 }}>
            Range:
          </Text>
          <Select
            value={dateRange}
            onChange={e => {
              setDateRange(e);
              onSelectRange(e);
            }}
            options={ReportOptions.dateRange.map(option => [
              option.description,
              option.description,
            ])}
            line={dateRangeLine}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            padding: 5,
            alignItems: 'center',
          }}
        >
          <Text style={{ width: 40, textAlign: 'right', marginRight: 5 }}>
            From:
          </Text>
          <Select
            onChange={newValue =>
              onChangeDates(...validateStart(allMonths, newValue, end))
            }
            value={start}
            defaultLabel={monthUtils.format(start, 'MMMM, yyyy')}
            options={allMonths.map(({ name, pretty }) => [name, pretty])}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            padding: 5,
            alignItems: 'center',
          }}
        >
          <Text style={{ width: 40, textAlign: 'right', marginRight: 5 }}>
            To:
          </Text>
          <Select
            onChange={newValue =>
              onChangeDates(...validateEnd(allMonths, start, newValue))
            }
            value={end}
            options={allMonths.map(({ name, pretty }) => [name, pretty])}
          />
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: theme.pillBorderDark,
            marginTop: 10,
            flexShrink: 0,
          }}
        />
      </View>
      {['Category', 'Group'].includes(groupBy) && (
        <View
          style={{
            marginTop: 10,
            minHeight: 200,
          }}
        >
          <CategorySelector
            categoryGroups={categories.grouped}
            categories={categories.list}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        </View>
      )}
    </View>
  );
}
