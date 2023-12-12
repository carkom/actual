import React from 'react';

import { theme } from '../../style';
import Text from '../common/Text';
import { FieldSelect } from '../modals/EditRule';

function CondOpMenu({ conditionsOp, onCondOpChange, filters }) {
  return (
    filters.length > 1 && (
      <Text style={{ color: theme.pageText, marginTop: 11, marginRight: 5 }}>
        <FieldSelect
          style={{ display: 'inline-flex' }}
          fields={[
            ['and', 'all'],
            ['or', 'any'],
          ]}
          value={conditionsOp}
          onChange={(name, value) => onCondOpChange(value, filters)}
        />
        of:
      </Text>
    )
  );
}

export default CondOpMenu;
