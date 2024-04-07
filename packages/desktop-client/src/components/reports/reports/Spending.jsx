import React, { useState, useEffect, useMemo } from 'react';

import * as monthUtils from 'loot-core/src/shared/months';
import { amountToCurrency } from 'loot-core/src/shared/util';

import { useCategories } from '../../../hooks/useCategories';
import { useFilters } from '../../../hooks/useFilters';
import { theme, styles } from '../../../style';
import { AlignedText } from '../../common/AlignedText';
import { Block } from '../../common/Block';
import { Text } from '../../common/Text';
import { View } from '../../common/View';
import { AppliedFilters } from '../../filters/AppliedFilters';
import { PrivacyFilter } from '../../PrivacyFilter';
import { SpendingGraph } from '../graphs/SpendingGraph';
import { Header } from '../Header';
import { LoadingIndicator } from '../LoadingIndicator';
import { createSpendingSpreadsheet } from '../spreadsheets/spending-spreadsheet';
import { useReport } from '../useReport';

export function Spending() {
  const categories = useCategories();

  const {
    filters,
    conditionsOp,
    onApply: onApplyFilter,
    onDelete: onDeleteFilter,
    onUpdate: onUpdateFilter,
    onCondOpChange,
  } = useFilters();

  const [selectedCategories, setSelectedCategories] = useState();
  const [dataCheck, setDataCheck] = useState(false);

  useEffect(() => {
    if (selectedCategories === undefined && categories.list.length !== 0) {
      setSelectedCategories(categories.list);
    }
  }, [categories, selectedCategories]);

  const getGraphData = useMemo(() => {
    setDataCheck(false);
    return createSpendingSpreadsheet({
      categories,
      selectedCategories,
      conditions: filters,
      conditionsOp,
      setDataCheck,
    });
  }, [categories, selectedCategories, filters, conditionsOp]);

  const data = useReport('default', getGraphData);

  if (!data) {
    return null;
  }

  return (
    <View style={{ ...styles.page, minWidth: 650, overflow: 'hidden' }}>
      <View
        style={{
          flexDirection: 'row',
          flexShrink: 0,
        }}
      >
        <Header title="Monthly Spending Report" />
        <Text
          style={{
            ...styles.veryLargeText,
            marginTop: 40,
            color: theme.pageTextPositive,
          }}
        />
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          padding: 15,
          paddingTop: 0,
          flexGrow: 1,
        }}
      >
        <View
          style={{
            flexGrow: 1,
          }}
        >
          {filters && filters.length > 0 && (
            <View
              style={{ marginBottom: 10, marginLeft: 5, flexShrink: 0 }}
              spacing={2}
              direction="row"
              justify="flex-start"
              align="flex-start"
            >
              <AppliedFilters
                filters={filters}
                onUpdate={onUpdateFilter}
                onDelete={onDeleteFilter}
                conditionsOp={conditionsOp}
                onCondOpChange={onCondOpChange}
              />
            </View>
          )}
          <View
            style={{
              backgroundColor: theme.tableBackground,
              flexGrow: 1,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                flexGrow: 1,
              }}
            >
              <View
                style={{
                  flexDirection: 'column',
                  flexGrow: 1,
                  padding: 10,
                  paddingTop: 10,
                }}
              >
                <View
                  style={{
                    alignItems: 'flex-end',
                    paddingTop: 10,
                  }}
                >
                  <View
                    style={{
                      ...styles.mediumText,
                      fontWeight: 500,
                      marginBottom: 5,
                    }}
                  >
                    <AlignedText
                      left={<Block>Spent Last MTD:</Block>}
                      right={
                        <Text>
                          <PrivacyFilter blurIntensity={5}>
                            {amountToCurrency(
                              Math.abs(
                                data.intervalData[
                                  monthUtils.getDay(monthUtils.currentDay()) - 1
                                ][
                                  monthUtils.subMonths(
                                    monthUtils.currentMonth(),
                                    1,
                                  )
                                ].cumulative,
                              ),
                            )}
                          </PrivacyFilter>
                        </Text>
                      }
                    />
                    <AlignedText
                      left={<Block>Spent MTD:</Block>}
                      right={
                        <Text>
                          <PrivacyFilter blurIntensity={5}>
                            {amountToCurrency(
                              Math.abs(
                                data.intervalData[
                                  monthUtils.getDay(monthUtils.currentDay()) - 1
                                ][monthUtils.currentMonth()].cumulative,
                              ),
                            )}
                          </PrivacyFilter>
                        </Text>
                      }
                    />
                  </View>
                </View>

                {dataCheck ? (
                  <SpendingGraph
                    style={{ flexGrow: 1 }}
                    compact={false}
                    data={data}
                  />
                ) : (
                  <LoadingIndicator message="Loading report..." />
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
