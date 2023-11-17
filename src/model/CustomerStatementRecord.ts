export interface CustomerStatementRecord {
  transactionReference: string;
  accountNumber: string;
  startBalance: number;
  mutation: string;
  endBalance: number;
  description: string;
}
