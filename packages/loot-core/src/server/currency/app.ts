import { v4 as uuidv4 } from 'uuid';

import {
  CurrencyData,
  CurrencyEntity,
} from '../../types/models/currencies';

import { condType } from '../../../../desktop-client/src/components/settings/Currency';
import { rateToInteger } from '../../shared/util';
import { createApp } from '../app';
import * as db from '../db';
import { mutator } from '../mutators';

import { CurrencyHandlers } from './types/handlers';

const currencyModel = {
  toJS(row: CurrencyData) {
    const { index_value, commit_date, ...fields } = row;
    const test: CurrencyEntity = {
      ...fields,
      index: index_value,
      commitDate: commit_date,
    };
    return test;
  },

  fromJS(currency: CurrencyEntity) {
    const { index, commitDate, ...row } = currency;
    const test2: CurrencyData = {
      ...row,
      index_value: index,
      commit_date: commitDate,
    };
    return test2;
  },
};

async function createCurrency(currency: condType) {
  const currencyId = uuidv4();
  const timeStamp = Date.now().toString();

  await db.insertWithSchema(
    'currencies',
    currencyModel.fromJS({
      id: currency.id,
      index: currency.index.toString(),
      currency: currency.currency,
      commitDate: timeStamp,
      rate: rateToInteger(currency.rate),
    }),
  );

  /*create error check for no changes
  if (item.conditions.length > 0) {
    const condExists = conditionExists(item, filter.filters, true);
    if (condExists) {
      throw new Error(
        'Duplicate filter warning: conditions already exist. Filter name: ' +
          condExists,
      );
    }
  } else {
    throw new Error('Conditions are required');
  }*/

  // Create the currency log item here based on the info

  return currencyId;
}

export const app = createApp<CurrencyHandlers>();

app.method('currency-create', mutator(createCurrency));
