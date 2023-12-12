import React, { useState, useRef, useEffect } from 'react';

import { FocusScope } from '@react-aria/focus';

import { mapField, FIELD_TYPES, TYPE_INFO } from 'loot-core/src/shared/rules';
import { titleFirst } from 'loot-core/src/shared/util';

import { theme } from '../../style';
import Button from '../common/Button';
import Select from '../common/Select';
import Stack from '../common/Stack';
import View from '../common/View';
import { Tooltip } from '../tooltips';
import GenericInput from '../util/GenericInput';

import OpButton from './OpButton';
import subfieldToOptions from './subfieldToOptions';

function ConfigureField({
  field,
  initialSubfield = field,
  op,
  value,
  dispatch,
  onApply,
}) {
  const [subfield, setSubfield] = useState(initialSubfield);
  const inputRef = useRef();
  const prevOp = useRef(null);

  useEffect(() => {
    if (prevOp.current !== op && inputRef.current) {
      inputRef.current.focus();
    }
    prevOp.current = op;
  }, [op]);

  const type = FIELD_TYPES.get(field);
  let ops = TYPE_INFO[type].ops.filter(op => op !== 'isbetween');

  // Month and year fields are quite hacky right now! Figure out how
  // to clean this up later
  if (subfield === 'month' || subfield === 'year') {
    ops = ['is'];
  }

  return (
    <Tooltip
      position="bottom-left"
      style={{ padding: 15, color: theme.menuItemText }}
      width={275}
      onClose={() => dispatch({ type: 'close' })}
      data-testid="filters-menu-tooltip"
    >
      <FocusScope>
        <View style={{ marginBottom: 10 }}>
          <Stack direction="row" align="flex-start">
            {field === 'amount' || field === 'date' ? (
              <Select
                bare
                options={
                  field === 'amount'
                    ? [
                        ['amount', 'Amount'],
                        ['amount-inflow', 'Amount (inflow)'],
                        ['amount-outflow', 'Amount (outflow)'],
                      ]
                    : field === 'date'
                    ? [
                        ['date', 'Date'],
                        ['month', 'Month'],
                        ['year', 'Year'],
                      ]
                    : null
                }
                value={subfield}
                onChange={sub => {
                  setSubfield(sub);

                  if (sub === 'month' || sub === 'year') {
                    dispatch({ type: 'set-op', op: 'is' });
                  }
                }}
                style={{ borderWidth: 1 }}
              />
            ) : (
              titleFirst(mapField(field))
            )}
            <View style={{ flex: 1 }} />
          </Stack>
        </View>

        <View
          style={{
            color: theme.pageTextLight,
            marginBottom: 10,
          }}
        >
          {field === 'saved' && 'Existing filters will be cleared'}
        </View>

        <Stack
          direction="row"
          align="flex-start"
          spacing={1}
          style={{ flexWrap: 'wrap' }}
        >
          {type === 'boolean' ? (
            <>
              <OpButton
                op="true"
                selected={value === true}
                onClick={() => {
                  dispatch({ type: 'set-op', op: 'is' });
                  dispatch({ type: 'set-value', value: true });
                }}
              />
              <OpButton
                op="false"
                selected={value === false}
                onClick={() => {
                  dispatch({ type: 'set-op', op: 'is' });
                  dispatch({ type: 'set-value', value: false });
                }}
              />
            </>
          ) : (
            <>
              <Stack
                direction="row"
                align="flex-start"
                spacing={1}
                style={{ flexWrap: 'wrap' }}
              >
                {ops.slice(0, 3).map(currOp => (
                  <OpButton
                    key={currOp}
                    op={currOp}
                    selected={currOp === op}
                    onClick={() => dispatch({ type: 'set-op', op: currOp })}
                  />
                ))}
              </Stack>
              <Stack
                direction="row"
                align="flex-start"
                spacing={1}
                style={{ flexWrap: 'wrap' }}
              >
                {ops.slice(3, ops.length).map(currOp => (
                  <OpButton
                    key={currOp}
                    op={currOp}
                    selected={currOp === op}
                    onClick={() => dispatch({ type: 'set-op', op: currOp })}
                  />
                ))}
              </Stack>
            </>
          )}
        </Stack>

        <form action="#">
          {type !== 'boolean' && (
            <GenericInput
              inputRef={inputRef}
              field={field}
              subfield={subfield}
              type={
                type === 'id' && (op === 'contains' || op === 'doesNotContain')
                  ? 'string'
                  : type
              }
              value={value}
              multi={op === 'oneOf' || op === 'notOneOf'}
              style={{ marginTop: 10 }}
              onChange={v => dispatch({ type: 'set-value', value: v })}
            />
          )}

          <Stack
            direction="row"
            justify="flex-end"
            align="center"
            style={{ marginTop: 15 }}
          >
            <View style={{ flex: 1 }} />
            <Button
              type="primary"
              onClick={e => {
                e.preventDefault();
                onApply({
                  field,
                  op,
                  value,
                  options: subfieldToOptions(field, subfield),
                });
              }}
            >
              Apply
            </Button>
          </Stack>
        </form>
      </FocusScope>
    </Tooltip>
  );
}

export default ConfigureField;
