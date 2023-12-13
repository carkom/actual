import React from 'react';

import { type CSSProperties, styles, theme } from '../../style';
import View from '../common/View';
import { Row, Cell } from '../table';

import { type GroupedEntity } from './entities';

type ReportTableColumnIndexProps = {
  item?: GroupedEntity;
  groupByItem?: string;
  headerStyle?: CSSProperties;
  compact?;
};

function ReportTableColumnIndex({
  item,
  groupByItem,
  headerStyle,
  compact,
}: ReportTableColumnIndexProps) {
  return (
    <>
      <Row
        collapsed={true}
        style={{
          color: theme.tableText,
          backgroundColor: theme.tableBackground,
          ...headerStyle,
        }}
      >
        {item ? (
          <Cell
            value={!compact && item[groupByItem]}
            width="flex"
            title={item[groupByItem].length > 12 && item[groupByItem]}
            style={{
              minWidth: 125,
              ...styles.tnum,
            }}
          />
        ) : (
          <Cell />
        )}
      </Row>
      {item.categories && (
        <>
          <View>
            {item.categories.map(cat => {
              return (
                <Row
                  key={cat.id}
                  collapsed={true}
                  style={{
                    color: theme.tableText,
                    backgroundColor: theme.tableBackground,
                  }}
                >
                  {cat ? (
                    <Cell
                      value={!compact && cat[groupByItem]}
                      width="flex"
                      title={cat[groupByItem].length > 12 && cat[groupByItem]}
                      style={{
                        minWidth: 125,
                        ...styles.tnum,
                      }}
                    />
                  ) : (
                    <Cell />
                  )}
                </Row>
              );
            })}
          </View>
          <Row height={20} />
        </>
      )}
    </>
  );
}

export default ReportTableColumnIndex;
