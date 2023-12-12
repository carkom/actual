import React, { useEffect, createRef } from 'react';

import { theme } from '../../style';
import Button from '../common/Button';
import MenuTooltip from '../common/MenuTooltip';
import Stack from '../common/Stack';
import Text from '../common/Text';
import { FormField, FormLabel } from '../forms';
import GenericInput from '../util/GenericInput';

function NameFilter({
  onClose,
  menuItem,
  name,
  setName,
  adding,
  onAddUpdate,
  err,
}) {
  const inputRef = createRef<HTMLTextAreaElement>();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <MenuTooltip width={325} onClose={onClose}>
      {menuItem !== 'update-filter' && (
        <form>
          <Stack
            direction="row"
            justify="flex-end"
            align="center"
            style={{ padding: 10 }}
          >
            <FormField style={{ flex: 1 }}>
              <FormLabel
                title="Filter Name"
                htmlFor="name-field"
                style={{ userSelect: 'none' }}
              />
              <GenericInput
                inputRef={inputRef}
                field="string"
                type="string"
                value={name}
                onChange={setName}
              />
            </FormField>
            <Button
              type="primary"
              style={{ marginTop: 18 }}
              onClick={e => {
                e.preventDefault();
                onAddUpdate();
              }}
            >
              {adding ? 'Add' : 'Update'}
            </Button>
          </Stack>
        </form>
      )}
      {err && (
        <Stack direction="row" align="center" style={{ padding: 10 }}>
          <Text style={{ color: theme.errorText }}>{err}</Text>
        </Stack>
      )}
    </MenuTooltip>
  );
}

export default NameFilter;
