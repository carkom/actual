
type subfieldFromFilter = {
  field;
  value;
  options?;
};

function subfieldFromFilter({ field, value, options }) {
  if (field === 'date') {
    if (value.length === 7) {
      return 'month';
    } else if (value.length === 4) {
      return 'year';
    }
  } else if (field === 'amount') {
    if (options && options.inflow) {
      return 'amount-inflow';
    } else if (options && options.outflow) {
      return 'amount-outflow';
    }
  }
  return field;
}

export default subfieldFromFilter;
