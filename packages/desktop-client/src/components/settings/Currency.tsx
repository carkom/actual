import React, { useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { parse } from 'loot-core/shared/rules';
import { send } from 'loot-core/src/platform/client/fetch';

import { Button } from '../common/Button2';
import { Stack } from '../common/Stack';
import { Text } from '../common/Text';
import { CurrencyItem } from '../util/CurrencyItem';

import { Setting } from './UI';

export type condType = {
  id?: string;
  index: string;
  currency: string;
  rate: number;
};

function onCommit(currency, currencyId) {
  const test = { ...currency, id: currencyId };
  send('currency-create', test);
}

export function CurrencySettings() {
  const currencyId = uuidv4();
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
      <Button
        variant="bare"
        aria-label="Edit account name"
        className="hover-visible"
        onPress={() => {
          onCommit(conditions[0], currencyId);
          onCommit(conditions[1], currencyId);
        }}
      >
        <Text>Commit</Text>
      </Button>
    </Setting>
  );
}
