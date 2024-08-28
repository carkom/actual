import React, { useState } from 'react';

import { parse } from 'loot-core/shared/rules';

import { Stack } from '../common/Stack';
import { Text } from '../common/Text';
import { CurrencyItem } from '../util/CurrencyItem';

import { Setting } from './UI';

export type condType = {
  index: string;
  currency: string;
  rate: number;
};

export function CurrencySettings() {
  const cond: condType[] = [{ index: 'base', currency: 'None', rate: 1 }];
  const [conditions, setConditions] = useState(cond.map(parse));

  return (
    <Setting
      primaryAction={
        <Stack spacing={2}>
          <CurrencyItem
            title="Base currency"
            conditions={conditions}
            setConditions={setConditions}
            index={0}
            cond={conditions[0]}
          />
          {conditions.length > 1 &&
            conditions
              .filter(c => c.index !== 'base')
              .map((cond, index) => {
                return (
                  <CurrencyItem
                    key={index + 1}
                    title={`Currency ${index + 2}`}
                    conditions={conditions}
                    setConditions={setConditions}
                    index={index + 1}
                    cond={cond}
                  />
                );
              })}
        </Stack>
      }
    >
      <Text>
        <strong>Currency</strong> allows for accounts to have different
        currencies.
      </Text>
    </Setting>
  );
}
