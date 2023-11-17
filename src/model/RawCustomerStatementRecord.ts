import type { CustomerStatementRecord } from './CustomerStatementRecord';

export type RawCustomerStatementRecord = Partial<Record<keyof CustomerStatementRecord, string>>;
