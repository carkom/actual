import React, {
  PureComponent,
  Component,
  forwardRef,
  useEffect,
  useRef,
} from 'react';

import { useFocusRing } from '@react-aria/focus';
import { useListBox, useListBoxSection, useOption } from '@react-aria/listbox';
import { mergeProps } from '@react-aria/utils';
import { Item, Section } from '@react-stately/collections';
import { useListState } from '@react-stately/list';
import { css } from 'glamor';
import memoizeOne from 'memoize-one';

import * as monthUtils from 'loot-core/src/shared/months';
import { getScheduledAmount } from 'loot-core/src/shared/schedules';
import {
  titleFirst,
  integerToCurrency,
  groupById,
} from 'loot-core/src/shared/util';

import ArrowsSynchronize from '../../icons/v2/ArrowsSynchronize';
import CheckCircle1 from '../../icons/v2/CheckCircle1';
import { styles, colors } from '../../style';
import { Text, TextOneLine, View } from '../common';

const zIndices = { SECTION_HEADING: 10 };

let getPayeesById = memoizeOne(payees => groupById(payees));
let getAccountsById = memoizeOne(accounts => groupById(accounts));

function isPreviewId(id) {
  return id.indexOf('preview/') !== -1;
}

function getDescriptionPretty(transaction, payee, transferAcct) {
  let { amount } = transaction;

  if (transferAcct) {
    return `Transfer ${amount > 0 ? 'from' : 'to'} ${transferAcct.name}`;
  } else if (payee) {
    return payee.name;
  }

  return '';
}

function lookupName(items, id) {
  return items.find(item => item.id === id).name;
}

function Status({ status }) {
  let color;

  switch (status) {
    case 'missed':
      color = colors.errorText;
      break;
    case 'due':
      color = colors.warningText;
      break;
    case 'upcoming':
      color = colors.tableText;
      break;
    default:
  }

  return (
    <Text
      style={{
        fontSize: 11,
        color,
        fontStyle: 'italic',
      }}
    >
      {titleFirst(status)}
    </Text>
  );
}

class Transaction extends PureComponent {
  render() {
    const {
      transaction,
      accounts,
      categories,
      payees,
      showCategory,
      added,
      // onSelect,
      style,
    } = this.props;
    let {
      id,
      payee: payeeId,
      amount,
      category,
      cleared,
      is_parent,
      notes,
      schedule,
    } = transaction;

    if (isPreviewId(id)) {
      amount = getScheduledAmount(amount);
    }

    let categoryName = category ? lookupName(categories, category) : null;

    let payee = payees && payeeId && getPayeesById(payees)[payeeId];
    let transferAcct =
      payee &&
      payee.transfer_acct &&
      getAccountsById(accounts)[payee.transfer_acct];

    let prettyDescription = getDescriptionPretty(
      transaction,
      payee,
      transferAcct,
    );
    let prettyCategory = transferAcct
      ? 'Transfer'
      : is_parent
      ? 'Split'
      : categoryName;

    let isPreview = isPreviewId(id);
    let textStyle = isPreview && {
      fontStyle: 'italic',
      color: colors.tableText,
    };

    return (
      // <Button
      //   onClick={() => onSelect(transaction)}
      //   style={{
      //     backgroundColor: 'white',
      //     border: 'none',
      //     width: '100%',
      //     '&:active': { opacity: 0.1 }
      //   }}
      // >
      <ListItem
        style={[
          { flex: 1, height: 60, padding: '5px 10px', color: colors.tableText }, // remove padding when Button is back
          isPreview && { backgroundColor: colors.tableBackground },
          style,
        ]}
      >
        <View style={[{ flex: 1 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {schedule && (
              <ArrowsSynchronize
                style={{
                  width: 12,
                  height: 12,
                  marginRight: 5,
                  color: 'inherit',
                }}
              />
            )}
            <TextOneLine
              style={[
                styles.text,
                textStyle,
                { fontSize: 14, fontWeight: added ? '600' : '400' },
                prettyDescription === '' && {
                  color: colors.tableText,
                  fontStyle: 'italic',
                },
              ]}
            >
              {prettyDescription || 'Empty'}
            </TextOneLine>
          </View>
          {isPreview ? (
            <Status status={notes} />
          ) : (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 3,
              }}
            >
              <CheckCircle1
                style={{
                  width: 11,
                  height: 11,
                  color: cleared ? colors.noticeText : colors.tableText,
                  marginRight: 5,
                }}
              />
              {showCategory && (
                <TextOneLine
                  style={{
                    fontSize: 11,
                    marginTop: 1,
                    fontWeight: '400',
                    color: prettyCategory
                      ? colors.tableTextInactive
                      : colors.formInputTextHighlight,
                    fontStyle: prettyCategory ? null : 'italic',
                    textAlign: 'left',
                  }}
                >
                  {prettyCategory || 'Uncategorized'}
                </TextOneLine>
              )}
            </View>
          )}
        </View>
        <Text
          style={[
            styles.text,
            textStyle,
            {
              marginLeft: 25,
              marginRight: 5,
              fontSize: 14,
            },
          ]}
        >
          {integerToCurrency(amount)}
        </Text>
      </ListItem>
      // </Button>
    );
  }
}

export class TransactionList extends Component {
  makeData = memoizeOne(transactions => {
    // Group by date. We can assume transactions is ordered
    const sections = [];
    transactions.forEach(transaction => {
      if (
        sections.length === 0 ||
        transaction.date !== sections[sections.length - 1].date
      ) {
        // Mark the last transaction in the section so it can render
        // with a different border
        let lastSection = sections[sections.length - 1];
        if (lastSection && lastSection.data.length > 0) {
          let lastData = lastSection.data;
          lastData[lastData.length - 1].isLast = true;
        }

        sections.push({
          id: transaction.date,
          date: transaction.date,
          data: [],
        });
      }

      if (!transaction.is_child) {
        sections[sections.length - 1].data.push(transaction);
      }
    });
    return sections;
  });

  render() {
    const {
      transactions,
      scrollProps = {},
      onLoadMore,
      // refreshControl
    } = this.props;

    const sections = this.makeData(transactions);

    return (
      <>
        {scrollProps.ListHeaderComponent}
        <ListBox
          {...scrollProps}
          aria-label="transaction list"
          label=""
          loadMore={onLoadMore}
          selectionMode="none"
          style={{ flex: '1 auto', height: '100%', overflowY: 'auto' }}
        >
          {sections.length === 0 ? (
            // Nothing found
            <Section>
              <Item>
                <div
                  style={{
                    color: colors.pageText,
                    backgroundColor: colors.pageBackground,
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                  }}
                >
                  <Text style={{ fontSize: 15 }}>No transactions</Text>
                </div>
              </Item>
            </Section>
          ) : null}
          {sections.map(section => {
            return (
              // Date header
              <Section
                title={monthUtils.format(section.date, 'MMMM dd, yyyy')}
                key={section.id}
                // Can't style for some reason?
                // Maybe since inside a Listbox and need to style with that?
                style={{ backgroundColor: colors.errorText }}
              >
                {section.data.map((transaction, index, transactions) => {
                  return (
                    //Transactions within the date
                    <Item
                      key={transaction.id}
                      style={{
                        backgroundColor: colors.pageBackground,
                        fontSize:
                          index === transactions.length - 1 ? 98 : 'inherit',
                      }}
                      textValue={transaction.id}
                    >
                      <Transaction
                        transaction={transaction}
                        categories={this.props.categories}
                        accounts={this.props.accounts}
                        payees={this.props.payees}
                        showCategory={this.props.showCategory}
                        notes={this.props.notes}
                        added={this.props.isNew(transaction.id)}
                        onSelect={() => {}} // onSelect(transaction)}
                      />
                    </Item>
                  );
                })}
              </Section>
            );
          })}
        </ListBox>
      </>
    );
  }
}

function ListBox(props) {
  let state = useListState(props);
  let listBoxRef = useRef();
  let { listBoxProps, labelProps } = useListBox(props, state, listBoxRef);

  useEffect(() => {
    function loadMoreTransactions() {
      if (
        Math.abs(
          listBoxRef.current.scrollHeight -
            listBoxRef.current.clientHeight -
            listBoxRef.current.scrollTop,
        ) < listBoxRef.current.clientHeight // load more when we're one screen height from the end
      ) {
        props.loadMore();
      }
    }

    listBoxRef.current.addEventListener('scroll', loadMoreTransactions);

    return () => {
      listBoxRef.current?.removeEventListener('scroll', loadMoreTransactions);
    };
  }, [state.collection]);

  return (
    <>
      <div {...labelProps}>{props.label}</div>
      <ul
        {...listBoxProps}
        ref={listBoxRef}
        style={{
          padding: 0,
          listStyle: 'none',
          margin: 0,
          overflowY: 'auto',
          width: '100%',
        }}
      >
        {[...state.collection].map(item => (
          <ListBoxSection key={item.key} section={item} state={state} />
        ))}
      </ul>
    </>
  );
}

function ListBoxSection({ section, state }) {
  let { itemProps, headingProps, groupProps } = useListBoxSection({
    heading: section.rendered,
    'aria-label': section['aria-label'],
  });

  // The heading is rendered inside an <li> element, which contains
  // a <ul> with the child items.
  return (
    <li {...itemProps} style={{ width: '100%' }}>
      {section.rendered && (
        <div
          {...headingProps}
          {...css(styles.smallText, {
            backgroundColor: colors.tableRowHeaderBackground,
            borderBottom: `1px solid ${colors.tableBorder}`,
            borderTop: `1px solid ${colors.tableBorder}`,
            color: colors.tableRowHeaderText,
            display: 'flex',
            justifyContent: 'center',
            paddingBottom: 4,
            paddingTop: 4,
            position: 'sticky',
            top: '0',
            width: '100%',
            zIndex: zIndices.SECTION_HEADING,
          })}
        >
          {section.rendered}
        </div>
      )}
      <ul
        {...groupProps}
        style={{
          padding: 0,
          listStyle: 'none',
        }}
      >
        {[...section.childNodes].map((node, index, nodes) => (
          <Option
            key={node.key}
            item={node}
            state={state}
            isLast={index === nodes.length - 1}
          />
        ))}
      </ul>
    </li>
  );
}

function Option({ isLast, item, state }) {
  // Get props for the option element
  let ref = useRef();
  let { optionProps, isSelected } = useOption({ key: item.key }, state, ref);

  // Determine whether we should show a keyboard
  // focus ring for accessibility
  let { isFocusVisible, focusProps } = useFocusRing();

  return (
    <li
      {...mergeProps(optionProps, focusProps)}
      ref={ref}
      style={{
        background: isSelected
          ? colors.tableRowBackgroundHighlight
          : colors.tableBackground,
        color: isSelected ? colors.tableText : null,
        outline: isFocusVisible ? '2px solid orange' : 'none',
        ...(!isLast && { borderBottom: `1px solid ${colors.tableBorder}` }),
      }}
    >
      {item.rendered}
    </li>
  );
}

const ROW_HEIGHT = 50;

const ListItem = forwardRef(({ children, style, ...props }, ref) => {
  return (
    <View
      style={[
        {
          height: ROW_HEIGHT,
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 10,
          paddingRight: 10,
        },
        style,
      ]}
      ref={ref}
      {...props}
    >
      {children}
    </View>
  );
});
