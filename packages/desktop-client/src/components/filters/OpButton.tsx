import React from 'react';

import { friendlyOp } from 'loot-core/src/shared/rules';

import { type CSSProperties, theme } from '../../style';
import { Button } from '../common/Button';

type OpButtonProps = {
  op: string;
  selected: boolean;
  onClick;
  style?: CSSProperties;
};

export function OpButton({ op, selected, onClick, style }: OpButtonProps) {
  return (
    <Button
      type="bare"
      style={{
        backgroundColor: theme.pillBackground,
        marginBottom: 5,
        ...style,
        ...(selected && {
          color: theme.buttonNormalSelectedText,
          '&,:hover,:active': {
            backgroundColor: theme.buttonNormalSelectedBackground,
            color: theme.buttonNormalSelectedText,
          },
        }),
      }}
      onClick={onClick}
    >
      {friendlyOp(op)}
    </Button>
  );
}
