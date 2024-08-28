import React, { type ReactNode } from 'react';

import { TbCurrencyDollar } from '../../icons/v2/CurrencyDollar';
import { TbCurrencyDollarAus } from '../../icons/v2/CurrencyDollarAus';
import { TbCurrencyEuro } from '../../icons/v2/CurrencyEuro';
import { TbCurrencyPound } from '../../icons/v2/CurrencyPound';
import { type CSSProperties } from '../../style';

type CurrencySymbolProps = {
  currency: string;
  width?: number;
  style?: CSSProperties;
};

export function CurrencySymbol({
  currency,
  width = 15,
  style,
}: CurrencySymbolProps) {
  switch (currency) {
    case 'AUS':
      return <TbCurrencyDollarAus width={width} style={style} />;
    case 'EUR':
      return <TbCurrencyEuro width={width} style={style} />;
    case 'GBP':
      return <TbCurrencyPound width={width} style={style} />;
    case 'USD':
      return <TbCurrencyDollar width={width} style={style} />;
    default:
      break;
  }
}
