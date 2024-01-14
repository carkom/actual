import React from 'react';
import { useSelector } from 'react-redux';

import { getMonthYearFormat } from 'loot-core/src/shared/months';

import { useCategories } from '../../hooks/useCategories';
import { AccountAutocomplete } from '../autocomplete/AccountAutocomplete';
import { Autocomplete } from '../autocomplete/Autocomplete';
import { CategoryAutocomplete } from '../autocomplete/CategoryAutocomplete';
import { PayeeAutocomplete } from '../autocomplete/PayeeAutocomplete';
import { SavedFilterAutocomplete } from '../autocomplete/SavedFilterAutocomplete';
import { Input } from '../common/Input';
import { View } from '../common/View';
import { Checkbox } from '../forms';
import { DateSelect } from '../select/DateSelect';
import { RecurringSchedulePicker } from '../select/RecurringSchedulePicker';

<<<<<<<< HEAD:packages/desktop-client/src/components/util/GenericInput.tsx
type GenericInputProps = {
  field;
  subfield?;
  type;
  multi?;
  value;
  inputRef;
  style?;
  onChange;
};

function GenericInput({
========
export function GenericInput({
>>>>>>>> upstream/master:packages/desktop-client/src/components/util/GenericInput.jsx
  field,
  subfield,
  type,
  multi,
  value,
  inputRef,
  style,
  onChange,
}: GenericInputProps) {
  const { grouped: categoryGroups } = useCategories();
  const dateFormat = useSelector(
    state => state.prefs.local.dateFormat || 'MM/dd/yyyy',
  );

  // This makes the UI more resilient in case of faulty data
  if (multi && !Array.isArray(value)) {
    value = [];
  } else if (!multi && Array.isArray(value)) {
    return null;
  }

  const showPlaceholder = multi ? value.length === 0 : true;

  let content;
  switch (type) {
    case 'id':
      switch (field) {
        case 'payee':
          content = (
            <PayeeAutocomplete
              showMakeTransfer={false}
              value={value}
              onSelect={onChange}
              inputProps={{
                inputRef,
                ...(showPlaceholder ? { placeholder: 'nothing' } : null),
              }}
            />
          );
          break;

        case 'account':
          content = (
            <AccountAutocomplete
              value={value}
              multi={multi}
              openOnFocus={true}
              onSelect={onChange}
              inputProps={{
                inputRef,
                ...(showPlaceholder ? { placeholder: 'nothing' } : null),
              }}
            />
          );
          break;

        case 'category':
          content = (
            <CategoryAutocomplete
              categoryGroups={categoryGroups}
              value={value}
              multi={multi}
              openOnFocus={true}
              onSelect={onChange}
              inputProps={{
                inputRef,
                ...(showPlaceholder ? { placeholder: 'nothing' } : null),
              }}
            />
          );
          break;

        default:
      }
      break;

    case 'saved':
      switch (field) {
        case 'saved':
          content = (
            <SavedFilterAutocomplete
              value={value}
              multi={multi}
              openOnFocus={true}
              onSelect={onChange}
              inputProps={{
                inputRef,
                ...(showPlaceholder ? { placeholder: 'nothing' } : null),
              }}
            />
          );
          break;

        default:
      }
      break;

    case 'date':
      switch (subfield) {
        case 'month':
          content = (
            <Input
              inputRef={inputRef}
              defaultValue={value || ''}
              placeholder={getMonthYearFormat(dateFormat).toLowerCase()}
              onEnter={e => onChange(e.target)}
              onBlur={e => onChange(e.target.value)}
            />
          );
          break;

        case 'year':
          content = (
            <Input
              inputRef={inputRef}
              defaultValue={value || ''}
<<<<<<<< HEAD:packages/desktop-client/src/components/util/GenericInput.tsx
              placeholder={'yyyy'}
              onEnter={e => onChange(e.target)}
========
              placeholder="yyyy"
              onEnter={e => onChange(e.target.value)}
>>>>>>>> upstream/master:packages/desktop-client/src/components/util/GenericInput.jsx
              onBlur={e => onChange(e.target.value)}
            />
          );
          break;

        default:
          if (value && value.frequency) {
            content = (
              <RecurringSchedulePicker
                value={value}
                buttonStyle={{ justifyContent: 'flex-start' }}
                onChange={onChange}
              />
            );
          } else {
            content = (
              <DateSelect
                value={value}
                dateFormat={dateFormat}
                openOnFocus={false}
                inputRef={inputRef}
                inputProps={{ placeholder: dateFormat.toLowerCase() }}
                onSelect={onChange}
              />
            );
          }
          break;
      }
      break;

    case 'boolean':
      content = (
        <Checkbox
          checked={value}
          value={value}
          onChange={() => onChange(!value)}
        />
      );
      break;

    default:
      if (multi) {
        content = (
          <Autocomplete
            multi={true}
            suggestions={[]}
            value={value}
            inputProps={{ inputRef }}
            onSelect={onChange}
          />
        );
      } else {
        content = (
          <Input
            inputRef={inputRef}
            defaultValue={value || ''}
            placeholder="nothing"
            onEnter={e => onChange(e.target)}
            onBlur={e => onChange(e.target.value)}
          />
        );
      }
      break;
  }

  return <View style={{ flex: 1, ...style }}>{content}</View>;
}

export default GenericInput;
