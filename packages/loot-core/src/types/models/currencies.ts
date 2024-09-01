export interface CurrencyEntity {
  id: string;
  index: string;
  currency: string;
  commitDate: string;
  rate: number;
  tombstone?: boolean;
}

export interface CurrencyData {
  id: string;
  index_value: string;
  currency: string;
  commit_date: string;
  rate: number;
  tombstone?: boolean;
}
