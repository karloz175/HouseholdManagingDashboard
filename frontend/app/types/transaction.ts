export type TransactionType = "income" | "expense";
export type TransactionCategory =
  | "Food"
  | "Housing"
  | "Other fees and bills"
  | "Health, hygiene and chemicals"
  | "Clothes and footwear"
  | "Relaxation"
  | "Transport"
  | "Other expenses";
export type TransactionCurrency = "PLN" | "EUR" | "USD" | "CHF" | "CZK";

export interface Transaction {
  id: number | bigint;
  name: string;
  description: string; //optional field for more details about transaction
  value: number;
  date: string; // when transaction had place format (e.g., '2025-01-09')
  type: TransactionType;
  category: TransactionCategory;
  currency: TransactionCurrency;
  createdAt: string; // when created
  updatedAt: string; // when last updated
}

export interface DatesRange {
  startDate: string;
  endDate: string;
}
