export function subfieldToOptions(field, subfield) {
  switch (field) {
    case 'amount':
      switch (subfield) {
        case 'amount-inflow':
          return { inflow: true };
        case 'amount-outflow':
          return { outflow: true };
        default:
          return null;
      }
    case 'date':
      switch (subfield) {
        case 'month':
          return { month: true };
        case 'year':
          return { year: true };
        default:
          return null;
      }
    default:
      return null;
  }
}
