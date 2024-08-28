import * as React from 'react';
import type { SVGProps } from 'react';
export const TbCurrencyEuro = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    style={{
      color: 'inherit',
      ...props.style,
    }}
  >
    <path d="M17.2 7a6 7 0 1 0 0 10" />
    <path d="M13 10h-8m0 4h8" />
  </svg>
);
