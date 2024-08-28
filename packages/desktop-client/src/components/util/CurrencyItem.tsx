import React, { createRef } from 'react';

import { type SyncedPrefs } from 'loot-core/types/prefs';

import { theme } from '../../style/theme';
import { Select } from '../common/Select';
import { Text } from '../common/Text';
import { View } from '../common/View';
import { EditorButtons } from '../modals/EditRule';
import { type condType } from '../settings/Currency';

import { GenericInput } from './GenericInput';

export const currencies: { value: SyncedPrefs['currencies']; label: string }[] =
  [
    { value: 'None', label: 'None' },
    { value: 'AUS', label: 'AUS' },
    { value: 'EUR', label: 'EUR' },
    { value: 'GBP', label: 'GBP' },
    { value: 'USD', label: 'USD' },
  ];

function removeCondition({ index, conditions, setConditions }) {
  const copy = [...conditions];
  if (conditions.length === 2) {
    copy[0].currency = 'None';
  }
  copy.splice(index, 1);
  setConditions(copy);
}

function addCondition({ index, conditions, setConditions, adjustedList }) {
  //adjustedList
  const copy = [...conditions];
  if (conditions.length === 1) {
    copy[0].currency =
      copy[0].currency === 'None' ? adjustedList[0] : copy[0].currency;
    copy.splice(index + 1, 0, {
      index: index + 1,
      currency: adjustedList[1],
      rate: 1,
    });
  } else {
    copy.splice(index + 1, 0, {
      index: index + 1,
      currency: adjustedList[0],
      rate: 1,
    });
  }
  setConditions(copy);
}

type CurrencyItemProps = {
  title: string;
  conditions: condType[];
  setConditions;
  index: number;
  cond: condType;
};

export function CurrencyItem({
  title,
  conditions,
  setConditions,
  index,
  cond,
}: CurrencyItemProps) {
  const selectedCurrencies = conditions.map(v => v.currency);
  const inputRef = createRef<HTMLInputElement>();
  const adjustedList =
    conditions.length > 1
      ? currencies.filter(c => c.value !== 'None')
      : currencies;
  const filteredList = adjustedList
    .filter(c => !selectedCurrencies.includes(c.value))
    .map(f => f.value);
  const disabledList = adjustedList
    .filter(c => selectedCurrencies.includes(c.value))
    .map(f => f.value);
  const totalCurrencies = adjustedList.map(v => v.value).length;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      }}
    >
      <Text
        style={{
          display: 'flex',
          marginRight: 10,
        }}
      >
        <label>{title}</label>
      </Text>
      <Select
        onChange={value => {
          const copy = [...conditions];
          copy[index].currency = value;
          setConditions(copy);
        }}
        value={cond.currency}
        options={adjustedList.map(f => [f.value, f.label])}
        disabledKeys={disabledList}
        buttonStyle={{
          marginRight: 10,
          ':hover': {
            backgroundColor: theme.buttonNormalBackgroundHover,
          },
        }}
      />
      {cond.index !== 'base' && (
        <GenericInput
          inputRef={inputRef}
          field={null}
          subfield={null}
          type="number"
          value={cond.rate}
          multi={false}
          style={{
            marginRight: 10,
            maxWidth: 150,
            justifyItems: 'center',
          }}
          onChange={(v: number) => {
            const copy = [...conditions];
            copy[index].rate = v;
            setConditions(copy);
          }}
        />
      )}
      <EditorButtons
        onAdd={
          totalCurrencies === index + 1
            ? ''
            : () => {
                addCondition({
                  index: index === 0 ? 0 : index + 1,
                  conditions,
                  setConditions,
                  adjustedList: filteredList,
                });
              }
        }
        onDelete={
          index === 0
            ? ''
            : () => {
                removeCondition({
                  index,
                  conditions,
                  setConditions,
                });
              }
        }
      />
    </View>
  );
}
