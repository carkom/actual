import React from 'react';

import { View } from '../common/View';

import { CondOpMenu } from './CondOpMenu';
import { FilterExpression } from './FilterExpression';

type AppliedFiltersProps = {
  filters;
  onUpdate;
  onDelete;
  conditionsOp;
  onCondOpChange;
  editingFilter?;
};

export function AppliedFilters({
  filters,
  editingFilter,
  onUpdate,
  onDelete,
  conditionsOp,
  onCondOpChange,
}: AppliedFiltersProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}
    >
      <CondOpMenu
        conditionsOp={conditionsOp}
        onCondOpChange={onCondOpChange}
        filters={filters}
      />
      {filters.map((filter, i) => (
        <FilterExpression
          key={i}
          customName={filter.customName}
          field={filter.field}
          op={filter.op}
          value={filter.value}
          options={filter.options}
          onChange={newFilter => onUpdate(filter, newFilter)}
          onDelete={() => onDelete(filter)}
        />
      ))}
    </View>
  );
}
