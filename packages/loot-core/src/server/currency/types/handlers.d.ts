import { condType } from '../../../../../desktop-client/src/components/settings/Currency';

export interface CurrencyHandlers {
  'currency-create': (currency: condType) => Promise<string>;
}
