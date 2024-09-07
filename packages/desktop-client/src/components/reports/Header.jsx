import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import * as monthUtils from 'loot-core/src/shared/months';

import { useResponsive } from '../../ResponsiveProvider';
import { theme } from '../../style/theme';
import { Button } from '../common/Button2';
import { Select } from '../common/Select';
import { View } from '../common/View';
import { AppliedFilters } from '../filters/AppliedFilters';
import { FilterButton } from '../filters/FiltersMenu';

import { ModeButton } from './ModeButton';
import {
  getFullRange,
  getLatestRange,
  validateEnd,
  validateStart,
} from './reportRanges';

export function Header({
  start,
  end,
  show1Month,
  allMonths,
  onChangeDates,
  filters,
  conditionsOp,
  onApply,
  onUpdateFilter,
  onDeleteFilter,
  onConditionsOpChange,
  headerPrefixItems,
  children,
}) {
  const location = useLocation();
  const path = location.pathname;
  const { isNarrowWidth } = useResponsive();

  const [isDateStatic, setIsDateStatic] = useState(false);
  const [liveDate, setLiveDate] = useState(3);

  return (
    <View
      style={{
        padding: 20,
        paddingTop: 0,
        flexShrink: 0,
      }}
    >
      {!['/reports/custom', '/reports/spending'].includes(path) && (
        <View
          style={{
            flexDirection: isNarrowWidth ? 'column' : 'row',
            alignItems: isNarrowWidth ? 'flex-start' : 'center',
            marginTop: 15,
            gap: 15,
          }}
        >
          {headerPrefixItems}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <ModeButton
              selected={!isDateStatic}
              onSelect={() => {
                setIsDateStatic(false);
              }}
            >
              Live
            </ModeButton>
            <ModeButton
              selected={isDateStatic}
              onSelect={() => {
                setIsDateStatic(true);
              }}
            >
              Static
            </ModeButton>
            {isDateStatic && (
              <>
                <Select
                  onChange={newValue =>
                    onChangeDates(
                      ...validateStart(
                        allMonths[allMonths.length - 1].name,
                        newValue,
                        end,
                      ),
                    )
                  }
                  value={start}
                  defaultLabel={monthUtils.format(start, 'MMMM, yyyy')}
                  options={allMonths.map(({ name, pretty }) => [name, pretty])}
                />
                <View>to</View>
                <Select
                  onChange={newValue =>
                    onChangeDates(
                      ...validateEnd(
                        allMonths[allMonths.length - 1].name,
                        start,
                        newValue,
                      ),
                    )
                  }
                  value={end}
                  options={allMonths.map(({ name, pretty }) => [name, pretty])}
                  buttonStyle={{ marginRight: 10 }}
                />
              </>
            )}
          </View>
          {!isDateStatic && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 15,
                flexWrap: 'wrap',
              }}
            >
              {show1Month && (
                <Button
                  selected={liveDate === 1}
                  onPress={() => {
                    onChangeDates(...getLatestRange(1));
                    setLiveDate(1);
                  }}
                  style={{
                    ...(liveDate === 1 && {
                      backgroundColor: theme.buttonPrimaryBackground,
                    }),
                  }}
                >
                  1 month
                </Button>
              )}
              <Button
                onPress={() => {
                  onChangeDates(...getLatestRange(2));
                  setLiveDate(3);
                }}
                style={{
                  ...(liveDate === 3 && {
                    backgroundColor: theme.buttonPrimaryBackground,
                  }),
                }}
              >
                3 months
              </Button>
              <Button
                onPress={() => {
                  onChangeDates(...getLatestRange(5));
                  setLiveDate(6);
                }}
                style={{
                  ...(liveDate === 6 && {
                    backgroundColor: theme.buttonPrimaryBackground,
                  }),
                }}
              >
                6 months
              </Button>
              <Button
                onPress={() => {
                  onChangeDates(...getLatestRange(11));
                  setLiveDate(12);
                }}
                style={{
                  ...(liveDate === 12 && {
                    backgroundColor: theme.buttonPrimaryBackground,
                  }),
                }}
              >
                1 Year
              </Button>
              <Button
                onPress={() => {
                  onChangeDates(
                    ...getFullRange(allMonths[allMonths.length - 1].name),
                  );
                  setLiveDate(0);
                }}
                style={{
                  ...(liveDate === 0 && {
                    backgroundColor: theme.buttonPrimaryBackground,
                  }),
                }}
              >
                All Time
              </Button>
            </View>
          )}
          {filters && (
            <FilterButton
              compact={isNarrowWidth}
              onApply={onApply}
              type="accounts"
            />
          )}
          {children || <View style={{ flex: 1 }} />}
        </View>
      )}
      {filters && filters.length > 0 && (
        <View
          style={{ marginTop: 5 }}
          spacing={2}
          direction="row"
          justify="flex-start"
          align="flex-start"
        >
          <AppliedFilters
            conditions={filters}
            onUpdate={onUpdateFilter}
            onDelete={onDeleteFilter}
            conditionsOp={conditionsOp}
            onConditionsOpChange={onConditionsOpChange}
          />
        </View>
      )}
    </View>
  );
}
