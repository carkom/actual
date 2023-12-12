import React from 'react';

import { type RuleConditionEntity } from 'loot-core/src/types/models';

import Menu from '../common/Menu';
import MenuTooltip from '../common/MenuTooltip';

function FilterMenu(
  onClose,
  filterId: RuleConditionEntity,
  onFilterMenuSelect: (item: string) => void,
) {
  return (
    <MenuTooltip width={200} onClose={onClose}>
      <Menu
        onMenuSelect={item => {
          onFilterMenuSelect(item);
        }}
        items={[
          ...(!filterId.id
            ? [
                { name: 'save-filter', text: 'Save new filter' },
                { name: 'clear-filter', text: 'Clear all conditions' },
              ]
            : [
                ...(filterId.id !== null && filterId.status === 'saved'
                  ? [
                      { name: 'rename-filter', text: 'Rename' },
                      { name: 'delete-filter', text: 'Delete' },
                      Menu.line,
                      {
                        name: 'save-filter',
                        text: 'Save new filter',
                        disabled: true,
                      },
                      { name: 'clear-filter', text: 'Clear all conditions' },
                    ]
                  : [
                      { name: 'rename-filter', text: 'Rename' },
                      { name: 'update-filter', text: 'Update condtions' },
                      { name: 'reload-filter', text: 'Revert changes' },
                      { name: 'delete-filter', text: 'Delete' },
                      Menu.line,
                      { name: 'save-filter', text: 'Save new filter' },
                      { name: 'clear-filter', text: 'Clear all conditions' },
                    ]),
              ]),
        ]}
      />
    </MenuTooltip>
  );
}

export default FilterMenu;
